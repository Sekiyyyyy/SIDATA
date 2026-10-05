<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\SchoolProfile;
use App\Models\Semester;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        $queryClasses = SchoolClass::where('is_active', true)->with('academicYear');
        $queryStudents = Student::with('currentClass')->where('status', 'Aktif');

        if ($user && $user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            $managedClass = SchoolClass::where('current_wali_kelas_id', $teacherId)->first();
            if ($managedClass) {
                $queryClasses->where('id', $managedClass->id);
                $queryStudents->where('current_class_id', $managedClass->id);
            } else {
                $queryClasses->whereRaw('1 = 0');
                $queryStudents->whereRaw('1 = 0');
            }
        }

        $classes = $queryClasses->get();
        $students = $queryStudents->get();

        return Inertia::render('Reports/Index', [
            'classes' => $classes,
            'students' => $students,
            'school' => SchoolProfile::first(),
        ]);
    }

    public function printBukuInduk(Student $student): Response
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if ($user && $user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            if (!$student->currentClass || $student->currentClass->current_wali_kelas_id !== $teacherId) {
                abort(403, 'Akses ditolak. Anda hanya berhak mencetak berkas siswa dari kelas binaan Anda.');
            }
        }

        $student->load([
            'currentClass.waliKelas',
            'parents',
            'guardian',
            'educationHistory',
            'healthRecords.academicYear',
            'healthRecords.semester',
            'classHistories.schoolClass',
            'classHistories.waliKelas',
            'classHistories.academicYear',
            'classHistories.semester',
            'achievements',
            'studentExtracurriculars.extracurricular',
            'mutations',
            'graduation',
            'subjectScores.subject',
            'subjectScores.academicYear',
            'subjectScores.semester',
            'attendances.academicYear',
            'attendances.semester',
            'p5Assessments.project',
        ]);

        $subjects = \App\Models\Subject::orderBy('order_num')->get();
        $academicYears = \App\Models\AcademicYear::with('semesters')->get();
        $classes = SchoolClass::with('waliKelas')->get();

        return Inertia::render('Reports/PrintBukuInduk', [
            'student' => $student,
            'school' => SchoolProfile::first(),
            'subjects' => $subjects,
            'academicYears' => $academicYears,
            'classes' => $classes,
        ]);
    }

    public function printRaport(Student $student, Request $request)
    {
        return redirect()->route('reports.buku-induk', ['student' => $student->id]);
    }
}
