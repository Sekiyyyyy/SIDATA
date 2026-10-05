<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Data Siswa
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_urut')->nullable()->default('1');
            $table->string('nis')->unique()->index();
            $table->string('nisn')->unique()->index();
            $table->string('nik')->nullable()->index();
            $table->string('name')->index();
            $table->string('nickname')->nullable();
            $table->enum('gender', ['Laki-laki', 'Perempuan'])->default('Laki-laki');
            $table->string('birth_place');
            $table->date('birth_date');
            $table->string('religion')->default('ISLAM');
            $table->string('citizenship')->default('INDONESIA');
            $table->string('child_order')->nullable()->default('1');
            $table->integer('siblings_count')->default(0);
            $table->integer('step_siblings_count')->default(0);
            $table->integer('foster_siblings_count')->default(0);
            $table->string('daily_language')->default('BAHASA INDONESIA');
            $table->string('blood_type')->nullable()->default('A');
            $table->text('address')->nullable();
            $table->string('rt_rw')->nullable()->default('-');
            $table->string('village')->nullable();
            $table->string('district')->nullable();
            $table->string('regency')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('phone')->nullable();
            $table->string('residence_type')->nullable(); // tinggal bersama ortu/wali
            $table->string('distance_to_school')->nullable(); // e.g. "5 KM"
            $table->enum('status', ['Aktif', 'Lulus', 'Pindah', 'Keluar', 'Tidak Aktif'])->default('Aktif')->index();
            $table->string('photo_url')->nullable()->default('/assets/aditya.jpg');
            $table->foreignId('current_class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Data Orang Tua
        Schema::create('parents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('father_name')->nullable();
            $table->string('father_nik')->nullable();
            $table->string('father_education')->nullable();
            $table->string('father_job')->nullable();
            $table->string('father_income')->nullable();
            $table->string('father_phone')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('mother_nik')->nullable();
            $table->string('mother_education')->nullable();
            $table->string('mother_job')->nullable();
            $table->string('mother_income')->nullable();
            $table->string('mother_phone')->nullable();
            $table->text('parent_address')->nullable();
            $table->string('parent_postal_code')->nullable();
            $table->timestamps();
        });

        // 3. Data Wali Murid
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('relation')->nullable(); // Hubungan keluarga
            $table->string('education')->nullable();
            $table->string('job')->nullable();
            $table->string('income')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // 4. Riwayat Pendidikan Sebelumnya (Asal SMP/MTs/SD)
        Schema::create('education_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('previous_school_type')->default('SMP NEGERI');
            $table->string('school_name')->default('SMP NEGERI 3 LUBUK PAKAM');
            $table->string('npsn')->nullable();
            $table->string('graduation_year')->nullable()->default('2023');
            $table->string('certificate_number')->nullable(); // No. Ijazah
            $table->string('certificate_date')->nullable();
            $table->timestamps();
        });

        // 5. Data Kesehatan & Fisik (Histori Semesteran)
        Schema::create('health_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->integer('height')->default(0); // cm
            $table->integer('weight')->default(0); // kg
            $table->integer('head_circumference')->nullable(); // cm
            $table->string('medical_history')->nullable()->default('-');
            $table->string('special_condition')->nullable()->default('-');
            $table->string('physical_disability')->nullable()->default('-');
            $table->string('special_needs')->nullable()->default('-');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 6. Student Academic Class History (FITUR UTAMA PROMPT.MD)
        Schema::create('student_class_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete()->index();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete()->index();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete()->index();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete()->index();
            $table->foreignId('wali_kelas_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->enum('status', ['Active', 'Completed', 'Promoted', 'Retained', 'Graduated', 'Transferred', 'Dropped'])->default('Active');
            $table->string('promotion_status')->nullable(); // e.g. "Naik ke Kelas XI PPLG 2", "Lulus"
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 7. Master Mata Pelajaran
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            $table->string('name');
            $table->enum('category', ['Umum', 'Kejuruan', 'Muatan Lokal', 'Pilihan'])->default('Umum');
            $table->string('grade_level')->default('X');
            $table->integer('default_kktp')->default(75);
            $table->integer('order_num')->default(1);
            $table->timestamps();
        });

        // 8. Nilai Siswa (Intrakurikuler Kurikulum Merdeka)
        Schema::create('student_subject_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->decimal('score', 5, 2);
            $table->decimal('kktp', 5, 2)->default(75);
            $table->text('competency_achievement')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'subject_id', 'academic_year_id', 'semester_id'], 'unique_score_entry');
        });

        // 9. Presensi / Kehadiran Siswa
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->integer('sick_days')->default(0);
            $table->integer('permitted_days')->default(0);
            $table->integer('unexcused_days')->default(0);
            $table->integer('dispensary_days')->default(0);
            $table->integer('school_activity_days')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'academic_year_id', 'semester_id'], 'unique_attendance_entry');
        });

        // 10. Prestasi Siswa
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['Akademik', 'Non-akademik', 'Olahraga', 'Seni', 'Lainnya'])->default('Akademik');
            $table->enum('level', ['Sekolah', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'])->default('Sekolah');
            $table->string('title');
            $table->string('year');
            $table->string('organizer')->nullable();
            $table->string('rank')->nullable();
            $table->text('notes')->nullable();
            $table->string('document_url')->nullable();
            $table->timestamps();
        });

        // 11. Ekstrakurikuler
        Schema::create('extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('coach_name')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('student_extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('extracurricular_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->string('grade')->default('Baik'); // Sangat Baik, Baik, Cukup
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 12. Projek P5 (Projek Penguatan Profil Pelajar Pancasila)
        Schema::create('p5_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->string('title'); // e.g. "Pembuatan Pupuk Organik (Eco Enzym)"
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('p5_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('p5_project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('dimension');
            $table->string('element')->nullable();
            $table->string('sub_element')->nullable();
            $table->enum('target_achievement', [
                'Mulai Berkembang',
                'Sedang Berkembang',
                'Berkembang Sesuai Harapan',
                'Sangat Berkembang'
            ])->default('Mulai Berkembang');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 13. Mutasi Siswa
        Schema::create('mutations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->enum('mutation_type', ['Masuk', 'Keluar', 'Pindah Sekolah', 'Pindah Kelas'])->default('Masuk');
            $table->string('from_to');
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->string('document_url')->nullable();
            $table->timestamps();
        });

        // 14. Kelulusan Siswa
        Schema::create('graduations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('graduation_year');
            $table->string('certificate_number')->nullable();
            $table->date('graduation_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 15. Audit Log (Pencatatan Tindakan Penting Pengguna)
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('user_name')->nullable();
            $table->string('role')->nullable();
            $table->string('action'); // Create, Update, Delete, Promote, Mutate, Login
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('record_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('graduations');
        Schema::dropIfExists('mutations');
        Schema::dropIfExists('p5_assessments');
        Schema::dropIfExists('p5_projects');
        Schema::dropIfExists('student_extracurriculars');
        Schema::dropIfExists('extracurriculars');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('student_subject_scores');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('student_class_histories');
        Schema::dropIfExists('health_records');
        Schema::dropIfExists('education_histories');
        Schema::dropIfExists('guardians');
        Schema::dropIfExists('parents');
        Schema::dropIfExists('students');
    }
};
