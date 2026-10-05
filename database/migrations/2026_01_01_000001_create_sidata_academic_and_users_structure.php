<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Profil Sekolah
        Schema::create('school_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('SMK NEGERI 1 BERINGIN');
            $table->string('npsn')->default('10200847');
            $table->string('address')->default('Jl. Pendidikan No. 3, Beringin');
            $table->string('district')->default('Beringin');
            $table->string('regency')->default('Deli Serdang');
            $table->string('province')->default('Sumatera Utara');
            $table->string('postal_code')->default('20552');
            $table->string('phone')->nullable()->default('0831 8006 8288');
            $table->string('email')->nullable()->default('smkn1beringin@sch.id');
            $table->string('website')->nullable()->default('https://smkn1beringin.sch.id');
            $table->string('principal_name')->default('Hj. Hafrida Hanum, S.Pd, M.Pd');
            $table->string('principal_nip')->default('19680414 199403 2009');
            $table->string('logo_url')->nullable()->default('/assets/logo.jpg');
            $table->timestamps();
        });

        // 2. Tahun Ajaran
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g. "2023/2024", "2024/2025"
            $table->boolean('is_active')->default(false);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        // 3. Semester
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['Ganjil', 'Genap']); // Ganjil / Genap
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // 4. Guru (Termasuk Wali Kelas)
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nip')->nullable()->unique();
            $table->string('name');
            $table->string('gender')->default('Laki-laki');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('specialty')->nullable(); // Bidang Pengajaran
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Kelas / Rombel
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g. "X PPLG 1", "X PPLG 2", "XI PPLG 2"
            $table->string('grade_level'); // X, XI, XII
            $table->string('major'); // PPLG, MPLB, dsb
            $table->foreignId('current_wali_kelas_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('semesters');
        Schema::dropIfExists('academic_years');
        Schema::dropIfExists('school_profiles');
    }
};
