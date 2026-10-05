<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AuditLog;
use App\Models\SchoolClass;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentSubjectScore;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
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

        $subjects = Subject::orderBy('order_num')->get();
        $activeYear = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        $students = [];
        $selectedClass = null;
        $selectedStudent = null;
        $studentId = $request->input('student_id');

        if ($classId) {
            $selectedClass = SchoolClass::with('waliKelas')->find($classId);
            $students = Student::where('current_class_id', $classId)
                ->orderBy('nomor_urut')
                ->orderBy('name')
                ->with([
                    'subjectScores' => function ($q) use ($activeSem) {
                        if ($activeSem) $q->where('semester_id', $activeSem->id)->with('subject');
                    },
                    'attendances' => function ($q) use ($activeSem) {
                        if ($activeSem) $q->where('semester_id', $activeSem->id);
                    },
                    'studentExtracurriculars.extracurricular',
                ])
                ->get();

            if (!$studentId && $students->isNotEmpty()) {
                $studentId = (string) $students->first()->id;
            }

            if ($studentId) {
                $selectedStudent = Student::with([
                    'currentClass.waliKelas',
                    'parents',
                    'subjectScores' => function ($q) use ($activeSem) {
                        if ($activeSem) $q->where('semester_id', $activeSem->id)->with('subject');
                    },
                    'attendances' => function ($q) use ($activeSem) {
                        if ($activeSem) $q->where('semester_id', $activeSem->id);
                    },
                    'studentExtracurriculars.extracurricular',
                    'achievements',
                    'classHistories.schoolClass',
                ])->find($studentId);
            }
        }

        return Inertia::render('Grades/Index', [
            'classes' => $classes,
            'subjects' => $subjects,
            'selectedClassId' => $classId ? (string) $classId : null,
            'selectedClass' => $selectedClass,
            'students' => $students,
            'selectedStudent' => $selectedStudent,
            'selectedStudentId' => $studentId ? (string) $studentId : null,
            'activeYear' => $activeYear,
            'activeSem' => $activeSem,
            'school' => \App\Models\SchoolProfile::first(),
        ]);
    }

    public function update(Request $request)
    {
        // Support saving all subjects for the student paper report card at once
        if ($request->has('scores') && is_array($request->input('scores'))) {
            $validated = $request->validate([
                'student_id' => ['required', 'exists:students,id'],
                'academic_year_id' => ['required', 'exists:academic_years,id'],
                'semester_id' => ['required', 'exists:semesters,id'],
                'class_id' => ['required', 'exists:classes,id'],
                'scores' => ['required', 'array'],
                'scores.*.subject_id' => ['required', 'exists:subjects,id'],
                'scores.*.score' => ['required', 'numeric', 'between:0,100'],
                'scores.*.kktp' => ['required', 'numeric', 'between:0,100'],
                'scores.*.competency_achievement' => ['nullable', 'string'],
                'attendance' => ['nullable', 'array'],
                'attendance.sick_days' => ['nullable', 'integer', 'min:0'],
                'attendance.permitted_days' => ['nullable', 'integer', 'min:0'],
                'attendance.unexcused_days' => ['nullable', 'integer', 'min:0'],
            ]);

            foreach ($validated['scores'] as $sc) {
                StudentSubjectScore::updateOrCreate(
                    [
                        'student_id' => $validated['student_id'],
                        'subject_id' => $sc['subject_id'],
                        'academic_year_id' => $validated['academic_year_id'],
                        'semester_id' => $validated['semester_id'],
                    ],
                    [
                        'class_id' => $validated['class_id'],
                        'score' => $sc['score'],
                        'kktp' => $sc['kktp'],
                        'competency_achievement' => $sc['competency_achievement'] ?? null,
                    ]
                );
            }

            // Optional attendance update directly from report sheet
            if (!empty($validated['attendance'])) {
                \App\Models\Attendance::updateOrCreate(
                    [
                        'student_id' => $validated['student_id'],
                        'academic_year_id' => $validated['academic_year_id'],
                        'semester_id' => $validated['semester_id'],
                    ],
                    [
                        'class_id' => $validated['class_id'],
                        'sick_days' => $validated['attendance']['sick_days'] ?? 0,
                        'permitted_days' => $validated['attendance']['permitted_days'] ?? 0,
                        'unexcused_days' => $validated['attendance']['unexcused_days'] ?? 0,
                    ]
                );
            }

            AuditLog::record('Memperbarui Lembar Nilai Rapor Siswa', [
                'student_id' => $validated['student_id'],
                'count' => count($validated['scores']),
            ]);

            return back()->with('success', 'Nilai lembar rapor siswa berhasil disimpan.');
        }

        // Single subject score update
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'semester_id' => ['required', 'exists:semesters,id'],
            'class_id' => ['required', 'exists:classes,id'],
            'score' => ['required', 'numeric', 'between:0,100'],
            'kktp' => ['required', 'numeric', 'between:0,100'],
            'competency_achievement' => ['nullable', 'string'],
        ]);

        $score = StudentSubjectScore::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'subject_id' => $validated['subject_id'],
                'academic_year_id' => $validated['academic_year_id'],
                'semester_id' => $validated['semester_id'],
            ],
            $validated
        );

        AuditLog::record('Memperbarui Nilai Mata Pelajaran Siswa', $score);

        return back()->with('success', 'Nilai berhasil disimpan.');
    }
}
