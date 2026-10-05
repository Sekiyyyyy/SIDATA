<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// Guest Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Authenticated Application Routes
Route::middleware('auth')->group(function () {
    Route::get('/', fn () => redirect()->route('dashboard'));
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Manajemen Siswa (Section 9, 28, 46 prompt.md)
    Route::get('/students/export', [StudentController::class, 'export'])->name('students.export');
    Route::get('/students/template', [StudentController::class, 'downloadTemplate'])->name('students.template');
    Route::post('/students/import', [StudentController::class, 'import'])->name('students.import');
    Route::resource('students', StudentController::class);

    // Kenaikan Kelas & Riwayat (Section 6, 38, 39 prompt.md)
    Route::get('/promotions', [PromotionController::class, 'index'])->name('promotions.index');
    Route::post('/promotions/process', [PromotionController::class, 'process'])->name('promotions.process');

    // Manajemen Kelas & Wali Kelas (Section 5, 7, 24 prompt.md)
    Route::get('/classes', [ClassController::class, 'index'])->name('classes.index');
    Route::post('/classes', [ClassController::class, 'store'])->name('classes.store');
    Route::put('/classes/{class}', [ClassController::class, 'update'])->name('classes.update');

    // Presensi & Kehadiran (Section 13, 19 prompt.md)
    Route::get('/attendances', [AttendanceController::class, 'index'])->name('attendances.index');
    Route::post('/attendances', [AttendanceController::class, 'update'])->name('attendances.update');

    // Nilai Kurikulum Merdeka (Section 16, 17 prompt.md)
    Route::get('/grades', [GradeController::class, 'index'])->name('grades.index');
    Route::post('/grades', [GradeController::class, 'update'])->name('grades.update');

    // Laporan & Cetak Resmi A4 (Section 33, 58 prompt.md)
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/buku-induk/{student}', [ReportController::class, 'printBukuInduk'])->name('reports.buku-induk');
    Route::get('/reports/rapor/{student}', [ReportController::class, 'printRaport'])->name('reports.rapor');

    // Audit Log Sistem (Section 34 prompt.md)
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
});
