<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $role = $user->role;

        $activeYear = AcademicYear::where('is_active', true)->first();
        $activeSemester = Semester::where('is_active', true)->first();

        // 1. DASHBOARD KHUSUS WALI KELAS (Section 27 prompt.md)
        if ($role === 'wali_kelas') {
            $teacher = $user->teacher;
            $managedClass = $teacher ? SchoolClass::where('current_wali_kelas_id', $teacher->id)->first() : null;

            $studentsQuery = Student::query();
            if ($managedClass) {
                $studentsQuery->where('current_class_id', $managedClass->id);
            } else {
                $studentsQuery->whereRaw('1 = 0'); // Belum ada kelas yang diampu
            }

            $students = $studentsQuery->with(['parents', 'educationHistory', 'healthRecords', 'attendances', 'currentClass'])->get();

            $totalStudents = $students->count();
            $maleCount = $students->where('gender', 'Laki-laki')->count();
            $femaleCount = $students->where('gender', 'Perempuan')->count();
            $incompleteDataCount = $students->filter(fn ($s) => $s->data_completion_percentage < 100)->count();

            return Inertia::render('Dashboard/WaliKelas', [
                'managedClass' => $managedClass,
                'students' => $students,
                'stats' => [
                    'total' => $totalStudents,
                    'male' => $maleCount,
                    'female' => $femaleCount,
                    'incomplete' => $incompleteDataCount,
                    'attendanceRate' => '98.5%',
                ],
            ]);
        }

        // 2. DASHBOARD KHUSUS OPERATOR (Section 26 prompt.md)
        if ($role === 'operator') {
            $totalStudents = Student::count();
            $totalClasses = SchoolClass::count();
            $totalTeachers = Teacher::count();
            $unassignedClassStudents = Student::whereNull('current_class_id')->count();
            $incompleteDataStudents = Student::get()->filter(fn ($s) => $s->data_completion_percentage < 100)->count();

            $classes = SchoolClass::with(['waliKelas', 'students'])->get();

            return Inertia::render('Dashboard/Operator', [
                'stats' => [
                    'totalStudents' => $totalStudents,
                    'totalClasses' => $totalClasses,
                    'totalTeachers' => $totalTeachers,
                    'unassignedStudents' => $unassignedClassStudents,
                    'incompleteStudents' => $incompleteDataStudents,
                    'activeYear' => $activeYear?->name ?? '2024/2025',
                    'activeSemester' => $activeSemester?->type ?? 'Ganjil',
                ],
                'classes' => $classes,
            ]);
        }

        // 3. DASHBOARD KHUSUS ADMIN (Section 25 prompt.md)
        $totalStudents = Student::count();
        $activeStudents = Student::where('status', 'Aktif')->count();
        $graduatedStudents = Student::where('status', 'Lulus')->count();
        $transferredStudents = Student::where('status', 'Pindah')->count();
        $totalTeachers = Teacher::count();
        $totalWaliKelas = SchoolClass::whereNotNull('current_wali_kelas_id')->count();
        $totalClasses = SchoolClass::count();
        $maleCount = Student::where('gender', 'Laki-laki')->count();
        $femaleCount = Student::where('gender', 'Perempuan')->count();

        $studentsByClass = SchoolClass::withCount('students')->get()->map(function ($c) {
            return [
                'name' => $c->name,
                'count' => $c->students_count,
            ];
        });

        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'totalStudents' => $totalStudents,
                'activeStudents' => $activeStudents,
                'graduatedStudents' => $graduatedStudents,
                'transferredStudents' => $transferredStudents,
                'totalTeachers' => $totalTeachers,
                'totalWaliKelas' => $totalWaliKelas,
                'totalClasses' => $totalClasses,
                'male' => $maleCount,
                'female' => $femaleCount,
            ],
            'chartData' => [
                'studentsByClass' => $studentsByClass,
                'gender' => [
                    ['name' => 'Laki-laki', 'value' => $maleCount],
                    ['name' => 'Perempuan', 'value' => $femaleCount],
                ],
            ],
            'recentStudents' => Student::with('currentClass')->latest()->take(5)->get(),
        ]);
    }
}
