<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Achievement;
use App\Models\Attendance;
use App\Models\EducationHistory;
use App\Models\Extracurricular;
use App\Models\HealthRecord;
use App\Models\P5Assessment;
use App\Models\P5Project;
use App\Models\SchoolClass;
use App\Models\SchoolProfile;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentClassHistory;
use App\Models\StudentExtracurricular;
use App\Models\StudentParent;
use App\Models\StudentSubjectScore;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Profil Sekolah (SMKN 1 Beringin)
        $school = SchoolProfile::create([
            'name' => 'SMK NEGERI 1 BERINGIN',
            'npsn' => '10200847',
            'address' => 'Jl. Pendidikan No. 3, Beringin',
            'district' => 'Beringin',
            'regency' => 'Deli Serdang',
            'province' => 'Sumatera Utara',
            'postal_code' => '20552',
            'phone' => '0831 8006 8288',
            'email' => 'info@smkn1beringin.sch.id',
            'website' => 'https://smkn1beringin.sch.id',
            'principal_name' => 'Hj. Hafrida Hanum, S.Pd, M.Pd',
            'principal_nip' => '19680414 199403 2009',
            'logo_url' => '/assets/logo.jpg',
        ]);

        // 2. Tiga Role Pengguna Wajib (Section 53 prompt.md)
        $adminUser = User::create([
            'name' => 'Administrator SIDATA',
            'email' => 'admin@sidata.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'phone' => '0812 0000 0001',
            'avatar' => '/assets/aditya.jpg',
        ]);

        $operatorUser = User::create([
            'name' => 'Operator Akademik',
            'email' => 'operator@sidata.test',
            'password' => Hash::make('password'),
            'role' => 'operator',
            'is_active' => true,
            'phone' => '0812 0000 0002',
            'avatar' => '/assets/aditya.jpg',
        ]);

        $waliKelasUser = User::create([
            'name' => 'Agusti Wardani, S.Pd.I',
            'email' => 'walikelas@sidata.test',
            'password' => Hash::make('password'),
            'role' => 'wali_kelas',
            'is_active' => true,
            'phone' => '0812 6543 8899',
            'avatar' => '/assets/aditya.jpg',
        ]);

        // 3. Guru & Tenaga Pengajar
        $waliTeacher = Teacher::create([
            'user_id' => $waliKelasUser->id,
            'nip' => '19821214 201101 2005',
            'name' => 'Agusti Wardani, S.Pd.I',
            'gender' => 'Perempuan',
            'phone' => '0812 6543 8899',
            'email' => 'agusti.wardani@smkn1beringin.sch.id',
            'specialty' => 'Pendidikan Agama & Budi Pekerti',
            'is_active' => true,
        ]);

        $guruBudi = Teacher::create([
            'nip' => '19850312 201402 1003',
            'name' => 'Budi Santoso, S.Kom',
            'gender' => 'Laki-laki',
            'phone' => '0813 4455 6677',
            'email' => 'budi.santoso@smkn1beringin.sch.id',
            'specialty' => 'Dasar-dasar PPLG & Informatika',
            'is_active' => true,
        ]);

        $guruSartika = Teacher::create([
            'nip' => '19880721 201503 2004',
            'name' => 'Dewi Sartika, M.Pd',
            'gender' => 'Perempuan',
            'phone' => '0813 9988 7766',
            'email' => 'dewi.sartika@smkn1beringin.sch.id',
            'specialty' => 'Matematika & Statistika',
            'is_active' => true,
        ]);

        // 4. Tahun Ajaran & Semester
        $ay2023 = AcademicYear::create([
            'name' => '2023/2024',
            'is_active' => false,
            'start_date' => '2023-07-15',
            'end_date' => '2024-06-25',
        ]);

        $sem1_2023 = Semester::create([
            'academic_year_id' => $ay2023->id,
            'type' => 'Ganjil',
            'is_active' => false,
        ]);

        $sem2_2023 = Semester::create([
            'academic_year_id' => $ay2023->id,
            'type' => 'Genap',
            'is_active' => false,
        ]);

        $ay2024 = AcademicYear::create([
            'name' => '2024/2025',
            'is_active' => true,
            'start_date' => '2024-07-15',
            'end_date' => '2025-06-25',
        ]);

        $sem1_2024 = Semester::create([
            'academic_year_id' => $ay2024->id,
            'type' => 'Ganjil',
            'is_active' => true,
        ]);

        $sem2_2024 = Semester::create([
            'academic_year_id' => $ay2024->id,
            'type' => 'Genap',
            'is_active' => false,
        ]);

        // 5. Rombel / Kelas
        $classXPplg1 = SchoolClass::create([
            'academic_year_id' => $ay2023->id,
            'name' => 'X PPLG 1',
            'grade_level' => 'X',
            'major' => 'PPLG',
            'current_wali_kelas_id' => $guruBudi->id,
            'is_active' => true,
        ]);

        $classXPplg2 = SchoolClass::create([
            'academic_year_id' => $ay2023->id,
            'name' => 'X PPLG 2',
            'grade_level' => 'X',
            'major' => 'PPLG',
            'current_wali_kelas_id' => $waliTeacher->id, // Agusti Wardani
            'is_active' => true,
        ]);

        $classXiPplg2 = SchoolClass::create([
            'academic_year_id' => $ay2024->id,
            'name' => 'XI PPLG 2',
            'grade_level' => 'XI',
            'major' => 'PPLG',
            'current_wali_kelas_id' => $guruSartika->id, // Kelas tujuan kenaikan
            'is_active' => true,
        ]);

        // 6. Master Mata Pelajaran Kurikulum Merdeka (Sesuai Foto 2 & 4)
        $subjectsData = [
            // Mapel Umum
            ['code' => 'PAI', 'name' => 'Pendidikan Agama dan Budi Pekerti', 'category' => 'Umum', 'default_kktp' => 75, 'order_num' => 1],
            ['code' => 'PPKN', 'name' => 'Pendidikan Pancasila', 'category' => 'Umum', 'default_kktp' => 80, 'order_num' => 2],
            ['code' => 'BIN', 'name' => 'Bahasa Indonesia', 'category' => 'Umum', 'default_kktp' => 75, 'order_num' => 3],
            ['code' => 'PJOK', 'name' => 'Pendidikan Jasmani, Olahraga, dan Kesehatan', 'category' => 'Umum', 'default_kktp' => 70, 'order_num' => 4],
            ['code' => 'SEJ', 'name' => 'Sejarah', 'category' => 'Umum', 'default_kktp' => 75, 'order_num' => 5],
            ['code' => 'SNB', 'name' => 'Seni Budaya', 'category' => 'Umum', 'default_kktp' => 78, 'order_num' => 6],
            ['code' => 'MLK', 'name' => 'Muatan Lokal (Conversation)', 'category' => 'Muatan Lokal', 'default_kktp' => 75, 'order_num' => 7],
            // Mapel Kejuruan
            ['code' => 'MTK', 'name' => 'Matematika', 'category' => 'Kejuruan', 'default_kktp' => 75, 'order_num' => 8],
            ['code' => 'BIG', 'name' => 'Bahasa Inggris', 'category' => 'Kejuruan', 'default_kktp' => 75, 'order_num' => 9],
            ['code' => 'INF', 'name' => 'Informatika', 'category' => 'Kejuruan', 'default_kktp' => 75, 'order_num' => 10],
            ['code' => 'IPAS', 'name' => 'Projek Ilmu Pengetahuan Alam dan Sosial (IPAS)', 'category' => 'Kejuruan', 'default_kktp' => 80, 'order_num' => 11],
            ['code' => 'PPLG', 'name' => 'Dasar-dasar Program Keahlian (PPLG)', 'category' => 'Kejuruan', 'default_kktp' => 75, 'order_num' => 12],
        ];

        $subjects = [];
        foreach ($subjectsData as $s) {
            $subjects[$s['code']] = Subject::create([
                'code' => $s['code'],
                'name' => $s['name'],
                'category' => $s['category'],
                'grade_level' => 'X',
                'default_kktp' => $s['default_kktp'],
                'order_num' => $s['order_num'],
            ]);
        }

        // 7. Data Ekstrakurikuler
        $pramuka = Extracurricular::create([
            'name' => 'Praja Muda Karana (Pramuka)',
            'coach_name' => 'Kak Iskandar, S.Pd',
            'description' => 'Kepanduan, kedisiplinan, kemandirian dan teknik bertahan hidup.',
        ]);

        $pmr = Extracurricular::create([
            'name' => 'Palang Merah Remaja (PMR)',
            'coach_name' => 'Ns. Ratna Wulandari, S.Kep',
            'description' => 'Pertolongan pertama pada kecelakaan, donor darah, dan kebersihan lingkungan.',
        ]);

        // 8. Projek P5 Semester 1 & 2
        $p5Sem1 = P5Project::create([
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem1_2023->id,
            'title' => 'Pembuatan Pupuk Organik (Eco Enzym) & Budaya Sehat',
            'description' => 'Mewujudkan kepedulian alam lewat pengelolaan limbah organik dan senam kebugaran.',
        ]);

        $p5Sem2 = P5Project::create([
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'title' => 'Penanaman Tanaman Palawija & Inovasi Digital',
            'description' => 'Kemandirian pangan sekolah dan perancangan media digital interaktif.',
        ]);

        // 9. SISWA 1: ADITYA CANDRA SITEPU (Data Asli dari 5 Foto Dokumen)
        $aditya = Student::create([
            'nomor_urut' => '1',
            'nis' => '28.354',
            'nisn' => '0082081407',
            'nik' => '1207192507080001',
            'name' => 'ADITYA CANDRA SITEPU',
            'nickname' => 'ADIT',
            'gender' => 'Laki-laki',
            'birth_place' => 'LUBUK PAKAM',
            'birth_date' => '2008-07-25',
            'religion' => 'ISLAM',
            'citizenship' => 'INDONESIA',
            'child_order' => '1 (SATU)',
            'siblings_count' => 2,
            'step_siblings_count' => 0,
            'foster_siblings_count' => 0,
            'daily_language' => 'BAHASA INDONESIA',
            'blood_type' => 'A',
            'address' => 'DESA ARAS KABU DUSUN AMAL NO. 086',
            'rt_rw' => '-',
            'village' => 'ARAS KABU',
            'district' => 'BERINGIN',
            'regency' => 'DELI SERDANG',
            'province' => 'SUMATERA UTARA',
            'postal_code' => '20552',
            'phone' => '0831 8006 8288',
            'residence_type' => 'Bersama Orang Tua',
            'distance_to_school' => '5 KM',
            'status' => 'Aktif',
            'photo_url' => '/assets/aditya.jpg',
            'current_class_id' => $classXPplg2->id,
        ]);

        StudentParent::create([
            'student_id' => $aditya->id,
            'father_name' => 'DODY CANDRA SITEPU',
            'father_nik' => '1207191005780002',
            'father_education' => 'SLTA / SEDERAJAT',
            'father_job' => 'BURUH HARIAN LEPAS',
            'father_income' => 'Rp 2.000.000 - Rp 3.000.000',
            'father_phone' => '0838 4341 3678',
            'mother_name' => 'JURHAIDAH',
            'mother_nik' => '1207194508800003',
            'mother_education' => 'SD / SEDERAJAT',
            'mother_job' => 'IBU RUMAH TANGGA',
            'mother_income' => '-',
            'mother_phone' => '0838 4341 3678',
            'parent_address' => 'DESA ARAS KABU DUSUN AMAL NO. 086',
            'parent_postal_code' => '20552',
        ]);

        EducationHistory::create([
            'student_id' => $aditya->id,
            'previous_school_type' => 'SMP NEGERI',
            'school_name' => 'SMP NEGERI 3 LUBUK PAKAM',
            'npsn' => '10200551',
            'graduation_year' => '2023',
            'certificate_number' => 'DN-07/D-SMP/K13/23/0040627',
            'certificate_date' => '9 JUNI 2023',
        ]);

        // Fisik Semester 1 & 2
        HealthRecord::create([
            'student_id' => $aditya->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem1_2023->id,
            'height' => 155,
            'weight' => 35,
            'head_circumference' => 54,
            'medical_history' => '-',
            'special_condition' => '-',
            'physical_disability' => '-',
            'notes' => 'Kondisi fisik sehat prima',
        ]);

        HealthRecord::create([
            'student_id' => $aditya->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'height' => 158,
            'weight' => 38,
            'head_circumference' => 54,
            'medical_history' => '-',
            'special_condition' => '-',
            'physical_disability' => '-',
            'notes' => 'Pertumbuhan normal (+3 cm, +3 kg)',
        ]);

        // Riwayat Akademik Berkelanjutan (Student Academic History)
        StudentClassHistory::create([
            'student_id' => $aditya->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem1_2023->id,
            'class_id' => $classXPplg2->id,
            'wali_kelas_id' => $waliTeacher->id,
            'status' => 'Completed',
            'promotion_status' => 'Lanjut Semester 2',
            'start_date' => '2023-07-17',
            'end_date' => '2023-12-22',
            'notes' => 'Siswa aktif berprestasi di semester ganjil',
        ]);

        StudentClassHistory::create([
            'student_id' => $aditya->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'class_id' => $classXPplg2->id,
            'wali_kelas_id' => $waliTeacher->id,
            'status' => 'Promoted',
            'promotion_status' => 'Naik ke Kelas XI PPLG 2',
            'start_date' => '2024-01-08',
            'end_date' => '2024-06-22',
            'notes' => 'Ditetapkan naik ke kelas XI PPLG 2 berdasarkan rapat dewan guru',
        ]);

        // Nilai Asli Semester 1 (Foto 2)
        $scoresSem1 = [
            'PAI' => [83, 75, 'Syu\'abul Iman, implementasi fikih muamalah'],
            'PPKN' => [82, 80, 'Penerapan nilai-nilai Pancasila dalam masyarakat'],
            'BIN' => [80, 75, 'Teks laporan, teks anekdot, dan hikayat'],
            'PJOK' => [73, 70, 'Bola voli, bulu tangkis, sepak bola, basket, dan atletik'],
            'SEJ' => [78, 75, 'Ilmu Sejarah dan Kerajaan Hindu Budha'],
            'SNB' => [85, 78, 'Teknik permainan alat musik dan karya musik / seni rupa'],
            'MLK' => [85, 75, 'Berkomunikasi dengan menggunakan teks naratif'],
            'MTK' => [80, 75, 'Barisan aritmatika, persamaan linear dan bentuk akar'],
            'BIG' => [83, 75, 'Teks deskriptif, recount, dan procedure'],
            'INF' => [89, 75, 'Algoritma dan penggunaan aplikasi perkantoran'],
            'IPAS' => [84, 80, 'Perubahan fisika, kimia, dan biologi dan dinamika sosial'],
            'PPLG' => [87, 75, 'Konsep dasar perangkat lunak dan gim serta budaya kerja'],
        ];

        foreach ($scoresSem1 as $code => $data) {
            StudentSubjectScore::create([
                'student_id' => $aditya->id,
                'subject_id' => $subjects[$code]->id,
                'academic_year_id' => $ay2023->id,
                'semester_id' => $sem1_2023->id,
                'class_id' => $classXPplg2->id,
                'score' => $data[0],
                'kktp' => $data[1],
                'competency_achievement' => $data[2],
            ]);
        }

        // Nilai Asli Semester 2 (Foto 4)
        $scoresSem2 = [
            'PAI' => [87, 75, 'Menganalisa cabang iman dan tawakal kepadanya'],
            'PPKN' => [86, 80, 'Kolaborasi budaya yang ada di Indonesia'],
            'BIN' => [82, 75, 'Menulis teks negosiasi, biografi, dan teks puisi'],
            'PJOK' => [81, 70, 'Mempraktikkan aktifitas jasmani untuk kesehatan'],
            'SEJ' => [81, 75, 'Menganalisis kerajaan Islam dalam ruang lingkup global'],
            'SNB' => [95, 78, 'Mengorganisasi pementasan seni dalam kepanitiaan'],
            'MLK' => [81, 75, 'Berinteraksi dengan lancar dan pantun atau majas'],
            'MTK' => [81, 75, 'Menentukan mean, median, dan modus pada data'],
            'BIG' => [86, 75, 'Mempresentasikan teks prosedur dan teks narasi'],
            'INF' => [92, 75, 'Merancang program komputer sebagai solusi persoalan'],
            'IPAS' => [84, 80, 'Mempresentasikan tata surya dengan berbagai media'],
            'PPLG' => [90, 75, 'Melakukan pemograman terstruktur perangkat lunak dan gim'],
        ];

        foreach ($scoresSem2 as $code => $data) {
            StudentSubjectScore::create([
                'student_id' => $aditya->id,
                'subject_id' => $subjects[$code]->id,
                'academic_year_id' => $ay2023->id,
                'semester_id' => $sem2_2023->id,
                'class_id' => $classXPplg2->id,
                'score' => $data[0],
                'kktp' => $data[1],
                'competency_achievement' => $data[2],
            ]);
        }

        // Presensi (Foto 5: 0 sakit, 0 izin, 0 alpa)
        Attendance::create([
            'student_id' => $aditya->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'class_id' => $classXPplg2->id,
            'sick_days' => 0,
            'permitted_days' => 0,
            'unexcused_days' => 0,
            'notes' => 'Tingkat kehadiran 100% sempurna',
        ]);

        // Prestasi & Beasiswa (Foto 3)
        Achievement::create([
            'student_id' => $aditya->id,
            'type' => 'Akademik',
            'level' => 'Kabupaten/Kota',
            'title' => 'Lomba Cerdas Cermat Jenjang SMK',
            'year' => '2023',
            'organizer' => 'Panitia Kegiatan Prestasi Dinas Pendidikan Deli Serdang',
            'rank' => 'Peserta Berprestasi',
            'notes' => 'Penerima Beasiswa Murid Berprestasi Tahun 2023',
        ]);

        // Ekstrakurikuler (Foto 5: Pramuka Baik, PMR Baik)
        StudentExtracurricular::create([
            'student_id' => $aditya->id,
            'extracurricular_id' => $pramuka->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'grade' => 'Baik',
            'notes' => 'Aktif dalam perkemahan & kepanduan sekolah',
        ]);

        StudentExtracurricular::create([
            'student_id' => $aditya->id,
            'extracurricular_id' => $pmr->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'grade' => 'Baik',
            'notes' => 'Aktif dalam pertolongan pertama dan tim UKS',
        ]);

        // Asesmen P5
        P5Assessment::create([
            'p5_project_id' => $p5Sem2->id,
            'student_id' => $aditya->id,
            'dimension' => 'Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia',
            'element' => 'Akhlak kepada alam',
            'sub_element' => 'Menciptakan solusi dari permasalahan lingkungan',
            'target_achievement' => 'Mulai Berkembang',
            'notes' => 'Mampu mempraktikkan pengolahan sampah dan penghijauan',
        ]);

        P5Assessment::create([
            'p5_project_id' => $p5Sem2->id,
            'student_id' => $aditya->id,
            'dimension' => 'Bergotong Royong',
            'element' => 'Kolaborasi',
            'sub_element' => 'Membangun tim dan kerjasama',
            'target_achievement' => 'Mulai Berkembang',
            'notes' => 'Berpartisipasi aktif dalam kelompok kerja',
        ]);

        P5Assessment::create([
            'p5_project_id' => $p5Sem2->id,
            'student_id' => $aditya->id,
            'dimension' => 'Bernalar Kritis & Kreatif',
            'element' => 'Keluwesan Berpikir',
            'sub_element' => 'Penyelesaian masalah secara mandiri dan efektif',
            'target_achievement' => 'Mulai Berkembang',
            'notes' => 'Menghasilkan ide-ide kreatif dalam tugas proyek',
        ]);

        // 10. SISWA 2: SITI NURHALIZA NASUTION (Teman Sekelas untuk simulasi kelas dan filter)
        $siti = Student::create([
            'nomor_urut' => '2',
            'nis' => '28.355',
            'nisn' => '0082156891',
            'nik' => '1207195409080002',
            'name' => 'SITI NURHALIZA NASUTION',
            'nickname' => 'SITI',
            'gender' => 'Perempuan',
            'birth_place' => 'MEDAN',
            'birth_date' => '2008-09-14',
            'religion' => 'ISLAM',
            'citizenship' => 'INDONESIA',
            'child_order' => '2 (DUA)',
            'siblings_count' => 3,
            'daily_language' => 'BAHASA INDONESIA',
            'blood_type' => 'B',
            'address' => 'JL. MERPATI NO. 14 DUSUN II',
            'village' => 'SIDODADI',
            'district' => 'BERINGIN',
            'regency' => 'DELI SERDANG',
            'province' => 'SUMATERA UTARA',
            'postal_code' => '20552',
            'phone' => '0812 6543 9821',
            'distance_to_school' => '3 KM',
            'status' => 'Aktif',
            'photo_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            'current_class_id' => $classXPplg2->id,
        ]);

        StudentParent::create([
            'student_id' => $siti->id,
            'father_name' => 'AHMAD NASUTION',
            'father_education' => 'S1 PENDIDIKAN',
            'father_job' => 'GURU SWASTA',
            'father_phone' => '0813 7789 2201',
            'mother_name' => 'RUKMINI',
            'mother_education' => 'SLTA / SEDERAJAT',
            'mother_job' => 'WIRASWASTA',
            'parent_address' => 'JL. MERPATI NO. 14 DUSUN II',
        ]);

        EducationHistory::create([
            'student_id' => $siti->id,
            'previous_school_type' => 'SMP NEGERI',
            'school_name' => 'SMP NEGERI 1 BERINGIN',
            'graduation_year' => '2023',
            'certificate_number' => 'DN-07/D-SMP/K13/23/0040711',
        ]);

        HealthRecord::create([
            'student_id' => $siti->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'height' => 155,
            'weight' => 44,
            'head_circumference' => 53,
        ]);

        StudentClassHistory::create([
            'student_id' => $siti->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'class_id' => $classXPplg2->id,
            'wali_kelas_id' => $waliTeacher->id,
            'status' => 'Promoted',
            'promotion_status' => 'Naik ke Kelas XI PPLG 2',
            'start_date' => '2024-01-08',
            'end_date' => '2024-06-22',
        ]);

        Attendance::create([
            'student_id' => $siti->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'class_id' => $classXPplg2->id,
            'sick_days' => 1,
            'permitted_days' => 1,
            'unexcused_days' => 0,
        ]);

        Achievement::create([
            'student_id' => $siti->id,
            'type' => 'Seni',
            'level' => 'Kabupaten/Kota',
            'title' => 'Juara 2 LKS UI/UX Design',
            'year' => '2024',
            'organizer' => 'MKKS SMK Deli Serdang',
            'rank' => 'Juara II',
        ]);

        // 11. SISWA 3: BUDI PRASETYO (Untuk demonstrasi siswa kelas X PPLG 1)
        $budi = Student::create([
            'nomor_urut' => '3',
            'nis' => '28.356',
            'nisn' => '0082299102',
            'name' => 'BUDI PRASETYO',
            'nickname' => 'BUDI',
            'gender' => 'Laki-laki',
            'birth_place' => 'LUBUK PAKAM',
            'birth_date' => '2008-05-10',
            'religion' => 'ISLAM',
            'citizenship' => 'INDONESIA',
            'address' => 'JL. PERINTIS KEMERDEKAAN NO. 22',
            'village' => 'PASAR VI',
            'district' => 'BERINGIN',
            'regency' => 'DELI SERDANG',
            'status' => 'Aktif',
            'current_class_id' => $classXPplg1->id,
        ]);

        StudentClassHistory::create([
            'student_id' => $budi->id,
            'academic_year_id' => $ay2023->id,
            'semester_id' => $sem2_2023->id,
            'class_id' => $classXPplg1->id,
            'wali_kelas_id' => $guruBudi->id,
            'status' => 'Active',
            'promotion_status' => 'Menunggu Keputusan',
            'start_date' => '2024-01-08',
        ]);
    }
}
