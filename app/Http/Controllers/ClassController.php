<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AuditLog;
use App\Models\SchoolClass;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClassController extends Controller
{
    public function index(): Response
    {
        $classes = SchoolClass::with(['academicYear', 'waliKelas', 'students'])->get();
        $teachers = Teacher::where('is_active', true)->get();
        $academicYears = AcademicYear::all();

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
            'teachers' => $teachers,
            'academicYears' => $academicYears,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->isWaliKelas()) {
            abort(403, 'Akses ditolak.');
        }

        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'name' => ['required', 'string', 'max:50'],
            'grade_level' => ['required', 'in:X,XI,XII'],
            'major' => ['required', 'string'],
            'current_wali_kelas_id' => ['nullable', 'exists:teachers,id'],
        ]);

        $class = SchoolClass::create($validated);
        AuditLog::record('Membuat Kelas Baru', $class, null, $class->toArray());

        return back()->with('success', "Kelas {$class->name} berhasil ditambahkan.");
    }

    public function update(Request $request, SchoolClass $class)
    {
        $user = Auth::user();
        if ($user->isWaliKelas()) {
            abort(403, 'Akses ditolak.');
        }

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:50'],
            'current_wali_kelas_id' => ['nullable', 'exists:teachers,id'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
        ]);

        $old = $class->toArray();
        $class->update(array_filter($validated, fn($val) => !is_null($val)));

        // Synchronize Wali Kelas to active StudentClassHistory for students in this class
        if (!empty($validated['current_wali_kelas_id'])) {
            $activeYear = \App\Models\AcademicYear::where('is_active', true)->first();
            $activeSem = \App\Models\Semester::where('is_active', true)->first();

            $students = \App\Models\Student::where('current_class_id', $class->id)->get();
            foreach ($students as $st) {
                if ($activeYear && $activeSem) {
                    \App\Models\StudentClassHistory::updateOrCreate(
                        [
                            'student_id' => $st->id,
                            'academic_year_id' => $activeYear->id,
                            'semester_id' => $activeSem->id,
                            'class_id' => $class->id,
                        ],
                        [
                            'wali_kelas_id' => $validated['current_wali_kelas_id'],
                            'status' => 'Active',
                            'start_date' => now(),
                        ]
                    );
                }
            }
        }

        AuditLog::record("Memperbarui Wali Kelas Rombel {$class->name}", $class, $old, $class->fresh()->toArray());

        $teacherName = $class->fresh()->waliKelas?->name ?? 'Belum ditentukan';
        return back()->with('success', "Wali kelas untuk rombel {$class->name} berhasil diperbarui menjadi {$teacherName}.");
    }
}
