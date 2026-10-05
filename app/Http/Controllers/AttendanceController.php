<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Attendance;
use App\Models\AuditLog;
use App\Models\SchoolClass;
use App\Models\Semester;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $classes = SchoolClass::where('is_active', true)->with('waliKelas')->get();

        $classId = $request->input('class_id');

        if ($user->isWaliKelas() && !$classId) {
            $managed = SchoolClass::where('current_wali_kelas_id', $user->teacher?->id)->first();
            $classId = $managed?->id;
        }

        if (!$classId && $classes->isNotEmpty()) {
            $classId = (string) $classes->first()->id;
        }

        $activeYear = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        $students = [];
        $selectedClass = null;
        if ($classId) {
            $selectedClass = SchoolClass::with('waliKelas')->find($classId);
            $students = Student::where('current_class_id', $classId)
                ->orderBy('nomor_urut')
                ->orderBy('name')
                ->with(['attendances' => function ($q) use ($activeSem) {
                    if ($activeSem) $q->where('semester_id', $activeSem->id);
                }])
                ->get();
        }

        return Inertia::render('Attendances/Index', [
            'classes' => $classes,
            'selectedClassId' => $classId ? (string) $classId : null,
            'selectedClass' => $selectedClass,
            'students' => $students,
            'activeYear' => $activeYear,
            'activeSem' => $activeSem,
            'school' => \App\Models\SchoolProfile::first(),
        ]);
    }

    public function update(Request $request)
    {
        // Support bulk saving for the full paper ledger
        if ($request->has('attendances') && is_array($request->input('attendances'))) {
            $validated = $request->validate([
                'academic_year_id' => ['required', 'exists:academic_years,id'],
                'semester_id' => ['required', 'exists:semesters,id'],
                'class_id' => ['required', 'exists:classes,id'],
                'attendances' => ['required', 'array'],
                'attendances.*.student_id' => ['required', 'exists:students,id'],
                'attendances.*.sick_days' => ['required', 'integer', 'min:0'],
                'attendances.*.permitted_days' => ['required', 'integer', 'min:0'],
                'attendances.*.unexcused_days' => ['required', 'integer', 'min:0'],
                'attendances.*.notes' => ['nullable', 'string'],
            ]);

            foreach ($validated['attendances'] as $attItem) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $attItem['student_id'],
                        'academic_year_id' => $validated['academic_year_id'],
                        'semester_id' => $validated['semester_id'],
                    ],
                    [
                        'class_id' => $validated['class_id'],
                        'sick_days' => $attItem['sick_days'],
                        'permitted_days' => $attItem['permitted_days'],
                        'unexcused_days' => $attItem['unexcused_days'],
                        'notes' => $attItem['notes'] ?? null,
                    ]
                );
            }

            AuditLog::record('Memperbarui Rekapitulasi Presensi Kertas Kelas', [
                'class_id' => $validated['class_id'],
                'count' => count($validated['attendances']),
            ]);

            return back()->with('success', 'Rekapitulasi presensi lembar kelas berhasil disimpan.');
        }

        // Single student update
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'semester_id' => ['required', 'exists:semesters,id'],
            'class_id' => ['required', 'exists:classes,id'],
            'sick_days' => ['required', 'integer', 'min:0'],
            'permitted_days' => ['required', 'integer', 'min:0'],
            'unexcused_days' => ['required', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $attendance = Attendance::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'academic_year_id' => $validated['academic_year_id'],
                'semester_id' => $validated['semester_id'],
            ],
            $validated
        );

        AuditLog::record('Memperbarui Kehadiran Siswa', $attendance);

        return back()->with('success', 'Data kehadiran berhasil disimpan.');
    }
}
