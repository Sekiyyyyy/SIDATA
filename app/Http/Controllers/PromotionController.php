<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AuditLog;
use App\Models\SchoolClass;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentClassHistory;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        if ($user->isWaliKelas()) {
            abort(403, 'Akses khusus Operator dan Administrator untuk proses Kenaikan Kelas.');
        }

        $academicYears = AcademicYear::with('semesters')->get();
        $classes = SchoolClass::with(['waliKelas', 'academicYear'])->get();
        $teachers = Teacher::where('is_active', true)->get();

        $selectedClassId = $request->input('class_id');
        $students = [];

        if ($selectedClassId) {
            $students = Student::where('current_class_id', $selectedClassId)
                ->where('status', 'Aktif')
                ->with(['subjectScores', 'attendances'])
                ->get();
        }

        return Inertia::render('Promotions/Index', [
            'academicYears' => $academicYears,
            'classes' => $classes,
            'teachers' => $teachers,
            'selectedClassId' => $selectedClassId,
            'students' => $students,
        ]);
    }

    public function process(Request $request)
    {
        $user = Auth::user();
        if ($user->isWaliKelas()) {
            abort(403, 'Akses ditolak.');
        }

        $validated = $request->validate([
            'source_class_id' => ['required', 'exists:classes,id'],
            'target_academic_year_id' => ['required', 'exists:academic_years,id'],
            'target_semester_id' => ['required', 'exists:semesters,id'],
            'target_class_id' => ['required', 'exists:classes,id'],
            'new_wali_kelas_id' => ['nullable', 'exists:teachers,id'],
            'promotions' => ['required', 'array'],
            'promotions.*.student_id' => ['required', 'exists:students,id'],
            'promotions.*.status' => ['required', 'in:Naik Kelas,Tidak Naik,Lulus,Pindah,Keluar'],
            'promotions.*.notes' => ['nullable', 'string'],
        ]);

        $sourceClass = SchoolClass::findOrFail($validated['source_class_id']);
        $targetClass = SchoolClass::findOrFail($validated['target_class_id']);
        $newWali = $validated['new_wali_kelas_id'] ? Teacher::find($validated['new_wali_kelas_id']) : null;

        DB::beginTransaction();
        try {
            $processedCount = 0;

            // Update wali kelas di kelas tujuan jika dipilih
            if ($newWali) {
                $targetClass->update([
                    'current_wali_kelas_id' => $newWali->id,
                ]);
            }

            foreach ($validated['promotions'] as $item) {
                $student = Student::findOrFail($item['student_id']);
                $statusChoice = $item['status'];

                // 1. Tutup histori kelas lama (JANGAN PERNAH DIHAPUS - Sesuai Section 6 & 59 prompt.md)
                $oldHistory = StudentClassHistory::where('student_id', $student->id)
                    ->where('class_id', $sourceClass->id)
                    ->where('status', 'Active')
                    ->latest()
                    ->first();

                if ($oldHistory) {
                    $historyStatus = match ($statusChoice) {
                        'Naik Kelas' => 'Promoted',
                        'Tidak Naik' => 'Retained',
                        'Lulus' => 'Graduated',
                        'Pindah' => 'Transferred',
                        'Keluar' => 'Dropped',
                        default => 'Completed',
                    };

                    $oldHistory->update([
                        'status' => $historyStatus,
                        'promotion_status' => $statusChoice . ' ke ' . $targetClass->name,
                        'end_date' => now(),
                        'notes' => $item['notes'] ?? $oldHistory->notes,
                    ]);
                }

                // 2. Jika Naik Kelas, pindahkan ke kelas tujuan dan buat histori baru
                if ($statusChoice === 'Naik Kelas') {
                    $student->update([
                        'current_class_id' => $targetClass->id,
                        'status' => 'Aktif',
                    ]);

                    StudentClassHistory::create([
                        'student_id' => $student->id,
                        'academic_year_id' => $validated['target_academic_year_id'],
                        'semester_id' => $validated['target_semester_id'],
                        'class_id' => $targetClass->id,
                        'wali_kelas_id' => $targetClass->current_wali_kelas_id,
                        'status' => 'Active',
                        'promotion_status' => 'Hasil Kenaikan dari ' . $sourceClass->name,
                        'start_date' => now(),
                        'notes' => 'Naik ke kelas ' . $targetClass->name . ' dengan Wali Kelas ' . ($targetClass->waliKelas?->name ?? 'Belum ditentukan'),
                    ]);

                    $processedCount++;
                } elseif ($statusChoice === 'Lulus') {
                    $student->update([
                        'status' => 'Lulus',
                    ]);
                    $processedCount++;
                } elseif (in_array($statusChoice, ['Pindah', 'Keluar'])) {
                    $student->update([
                        'status' => $statusChoice,
                    ]);
                    $processedCount++;
                }
            }

            AuditLog::record(
                "Kenaikan Kelas ({$sourceClass->name} ➔ {$targetClass->name})",
                $targetClass,
                ['source_class' => $sourceClass->name, 'count' => count($validated['promotions'])],
                ['target_class' => $targetClass->name, 'processed' => $processedCount]
            );

            DB::commit();

            return redirect()->route('promotions.index')->with(
                'success',
                "Proses berhasil: {$processedCount} siswa berhasil diproses kenaikan dari {$sourceClass->name} ke {$targetClass->name}."
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memproses kenaikan kelas: ' . $e->getMessage());
        }
    }
}
