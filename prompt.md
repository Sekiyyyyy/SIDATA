# MASTER PROMPT — SIDATA SISWA

## 1. IDENTITAS PROJECT

Nama Aplikasi:
SIDATA Siswa

Kepanjangan:
Sistem Informasi Data Siswa

Deskripsi:
SIDATA Siswa adalah aplikasi web untuk mengelola data siswa secara terpusat, mulai dari biodata siswa, data orang tua/wali, riwayat pendidikan, kesehatan, kehadiran, prestasi, ekstrakurikuler, nilai, Projek Penguatan Profil Pelajar Pancasila (P5), hingga riwayat kenaikan kelas.

Aplikasi digunakan oleh 3 role utama:

1. Admin
2. Operator
3. Wali Kelas

Konsep utama sistem:

- Wali Kelas menjadi pihak utama yang menginput dan memperbarui data siswa yang berada di kelasnya.
- Operator bertanggung jawab terhadap pengelolaan data akademik/madrasah/sekolah, pembagian kelas, penetapan wali kelas, serta proses kenaikan kelas.
- Admin bertanggung jawab terhadap konfigurasi sistem, pengguna, hak akses, dan pengaturan aplikasi.
- Setiap perubahan penting harus tercatat dalam audit log.
- Data siswa harus memiliki riwayat sehingga data lama tidak hilang ketika siswa naik kelas.

Tujuan:
Mengubah proses pendataan siswa yang sebelumnya menggunakan formulir/buku fisik menjadi sistem digital yang terstruktur, mudah dicari, aman, dan dapat menghasilkan laporan.

---

# 2. TECH STACK

Gunakan stack modern, stabil, dan maintainable.

## Backend

- Laravel 12
- PHP 8.3+
- Laravel Fortify / Laravel authentication
- Laravel Policies & Gates
- Laravel Notifications
- Laravel Excel
- DomPDF / laravel-dompdf

## Frontend

- React 19
- Inertia.js
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- Framer Motion / Motion
- React Hook Form
- Zod
- TanStack Table
- Recharts

## Build Tool

- Vite

## Database

- MySQL 8+

## Development

- Laravel 

---

# 3. PRINSIP DESAIN

UI harus terlihat seperti aplikasi administrasi sekolah modern, bukan template dashboard lama.

Gunakan:

- clean modern dashboard
- responsive
- desktop-first tetapi tetap nyaman di tablet/mobile
- sidebar navigation
- topbar
- card statistik
- data table modern
- search
- filter
- pagination
- modal/dialog
- dropdown
- toast notification
- confirmation dialog
- skeleton loading
- empty state
- error state
- loading state
- breadcrumb
- badge status
- responsive form

Gunakan warna yang cocok untuk lingkungan pendidikan.

Style:

- modern
- profesional
- clean
- minimal
- sedikit rounded
- tidak berlebihan menggunakan gradient
- tidak menggunakan desain yang terlalu ramai
- icon menggunakan Lucide
- typography mudah dibaca

Gunakan dark mode jika memungkinkan.

---

# 4. ROLE DAN HAK AKSES

## ROLE 1 — ADMIN

Admin memiliki akses tertinggi terhadap sistem.

### Admin dapat:

- melihat dashboard
- mengelola akun pengguna
- membuat akun Operator
- membuat akun Wali Kelas
- mengubah role pengguna
- menonaktifkan akun
- reset password
- mengelola profil sekolah
- mengelola tahun ajaran
- mengelola semester
- mengelola konfigurasi sistem
- melihat audit log
- melihat seluruh data
- melakukan backup/maintenance jika diperlukan

Admin tidak menjadi pihak utama untuk menginput data siswa.

Admin berfungsi sebagai pengelola sistem.

---

# 5. ROLE 2 — OPERATOR

Operator adalah pengelola administrasi data sekolah.

Operator bertanggung jawab terhadap struktur akademik dan pembagian siswa.

### Operator dapat:

- melihat seluruh siswa
- melihat seluruh kelas
- melihat seluruh wali kelas
- mengelola data guru
- membuat tahun ajaran
- membuat semester
- membuat tingkat kelas
- membuat rombel
- menentukan wali kelas
- memindahkan siswa antar kelas
- melakukan kenaikan kelas
- melakukan kelulusan siswa
- melakukan mutasi siswa
- mengelola data master
- mengelola ekstrakurikuler
- mengelola jenis prestasi
- mengelola jenis ketidakhadiran
- mengelola mata pelajaran
- melihat laporan
- export Excel
- export PDF
- mencetak data siswa
- melihat riwayat siswa

## Tugas penting Operator:

### A. Pembagian Wali Kelas

Operator dapat menentukan:

Contoh:

Tahun Ajaran 2025/2026

Kelas:
- X PPLG 1 → Wali Kelas A
- X PPLG 2 → Wali Kelas B
- X MPLB 1 → Wali Kelas C

Setiap kelas hanya memiliki satu wali kelas aktif dalam satu periode.

---

# 6. SISTEM KENAIKAN KELAS

Ini merupakan salah satu fitur utama SIDATA Siswa.

Jangan menghapus data kelas lama ketika siswa naik kelas.

Sistem harus menggunakan konsep:

## Student Academic History

Contoh:

Siswa:
Andi

2025/2026
X PPLG 1
Wali Kelas: Guru A

Kemudian naik kelas.

2026/2027
XI PPLG 1
Wali Kelas: Guru B

Kemudian naik kelas.

2027/2028
XII PPLG 1
Wali Kelas: Guru C

Semua riwayat tetap tersimpan.

---

## Proses Kenaikan Kelas

Operator memilih:

Tahun Ajaran Asal:
2025/2026

Kelas Asal:
X PPLG 1

Kemudian:

[ Proses Kenaikan Kelas ]

Sistem menampilkan daftar siswa:

| No | Siswa | Kelas Asal | Status |
|----|-------|------------|--------|
| 1 | Andi | X PPLG 1 | Naik |
| 2 | Budi | X PPLG 1 | Naik |
| 3 | Citra | X PPLG 1 | Tidak Naik |

Operator dapat memilih status:

- Naik Kelas
- Tidak Naik
- Lulus
- Pindah
- Keluar

Untuk siswa yang naik:

X PPLG 1
↓
XI PPLG 1

Setelah itu Operator dapat menentukan wali kelas baru.

---

# 7. PERGANTIAN WALI KELAS

Pergantian wali kelas dilakukan oleh Operator.

Contoh:

Tahun 2025/2026:

X PPLG 1
Wali Kelas:
Bapak A

Ketika naik kelas:

XI PPLG 1
Wali Kelas:
Ibu B

Sistem tidak mengubah riwayat wali kelas sebelumnya.

Riwayat:

2025/2026
X PPLG 1
Wali Kelas: Bapak A

2026/2027
XI PPLG 1
Wali Kelas: Ibu B

---

# 8. ROLE 3 — WALI KELAS

Wali Kelas hanya dapat mengakses siswa yang sedang menjadi tanggung jawabnya.

Contoh:

Wali Kelas:
Budi Santoso

Kelas:
X PPLG 1

Maka dashboard hanya menampilkan siswa:

X PPLG 1

Wali kelas tidak boleh melihat atau mengubah data siswa kelas lain.

---

# 9. DATA SISWA

Buat modul:

## Data Siswa

Field:

- NIS
- NISN
- NIK
- Nama Lengkap
- Nama Panggilan
- Jenis Kelamin
- Tempat Lahir
- Tanggal Lahir
- Agama
- Kewarganegaraan
- Anak ke
- Jumlah Saudara Kandung
- Bahasa Sehari-hari di Rumah
- Golongan Darah
- Alamat
- Desa/Kelurahan
- Kecamatan
- Kabupaten/Kota
- Provinsi
- Kode Pos
- Nomor Telepon
- Jarak Rumah ke Sekolah
- Status Siswa
- Foto Siswa

Status siswa:

- Aktif
- Lulus
- Pindah
- Keluar
- Tidak Aktif

---

# 10. DATA ORANG TUA / WALI

Buat modul:

## Data Orang Tua / Wali

### Ayah

- Nama
- NIK
- Pendidikan Terakhir
- Pekerjaan
- Penghasilan
- Nomor Telepon

### Ibu

- Nama
- NIK
- Pendidikan Terakhir
- Pekerjaan
- Penghasilan
- Nomor Telepon

### Wali

- Nama
- Hubungan Keluarga
- Pendidikan Terakhir
- Pekerjaan
- Penghasilan
- Nomor Telepon
- Alamat

Data orang tua/wali dapat kosong jika memang tidak tersedia.

---

# 11. RIWAYAT PENDIDIKAN

Simpan:

- Asal Sekolah
- Jenjang
- Nama Sekolah
- NPSN
- Tahun Lulus
- Nomor Ijazah
- Nomor Peserta Didik jika diperlukan

Contoh:

SD:
SD Negeri 1 Beringin

SMP:
SMP Negeri 3 Lubuk Pakam

---

# 12. DATA KESEHATAN

Buat modul:

## Data Kesehatan

- Tinggi Badan
- Berat Badan
- Lingkar Kepala jika diperlukan
- Riwayat kesehatan
- Kondisi khusus
- Kelainan jasmani
- Kebutuhan khusus
- Keterangan

Data kesehatan harus memiliki riwayat berdasarkan tahun ajaran/semester.

Contoh:

2025/2026 Semester Ganjil:
Tinggi: 155 cm
Berat: 45 kg

2025/2026 Semester Genap:
Tinggi: 158 cm
Berat: 47 kg

Jangan menimpa data lama.

---

# 13. DATA KEHADIRAN

Buat modul:

## Kehadiran

Kategori:

- Sakit
- Izin
- Tanpa Keterangan

Field:

- Tahun Ajaran
- Semester
- Sakit
- Izin
- Alpa
- Total Kehadiran
- Keterangan

Wali kelas dapat menginput/memperbarui data kehadiran siswa kelasnya.

---

# 14. DATA PRESTASI

Buat modul:

## Prestasi Siswa

Field:

- Jenis Prestasi
- Tingkat Prestasi
- Nama Prestasi
- Tahun Prestasi
- Penyelenggara
- Peringkat
- Keterangan
- Bukti/Dokumen jika diperlukan

Jenis tingkat:

- Sekolah
- Kecamatan
- Kabupaten/Kota
- Provinsi
- Nasional
- Internasional

Jenis prestasi:

- Akademik
- Non-akademik
- Olahraga
- Seni
- Lainnya

---

# 15. DATA EKSTRAKURIKULER

Buat modul:

## Ekstrakurikuler

Field:

- Nama Ekstrakurikuler
- Pembina
- Keterangan

Pada data siswa:

- Nama Ekstrakurikuler
- Tahun Ajaran
- Semester
- Nilai
- Predikat
- Keterangan

---

# 16. DATA NILAI

Buat modul nilai.

Struktur:

Tahun Ajaran
↓
Semester
↓
Kelas
↓
Mata Pelajaran
↓
Siswa
↓
Nilai

Contoh:

Matematika
Nilai Akhir: 83
KKTP: 75

Simpan:

- Nilai
- KKTP
- Deskripsi capaian kompetensi
- Semester
- Tahun ajaran

Wali kelas dapat menginput nilai yang menjadi tanggung jawabnya jika sistem memang menggunakan wali kelas sebagai penginput.

Namun desain database harus tetap fleksibel agar nantinya dapat ditambahkan role Guru Mata Pelajaran.

---

# 17. DATA MATA PELAJARAN

Master Mata Pelajaran:

- Pendidikan Agama
- Pendidikan Pancasila
- Bahasa Indonesia
- Matematika
- Bahasa Inggris
- Sejarah
- PJOK
- Seni
- Muatan Lokal
- Informatika
- Mata pelajaran kejuruan
- Mata pelajaran lainnya

Admin/Operator dapat menambah mata pelajaran.

---

# 18. PROJEK PENGUATAN PROFIL PELAJAR PANCASILA

Buat modul:

## Projek P5

Data:

- Tema Projek
- Dimensi
- Elemen
- Sub-Elemen
- Target Fase Pencapaian
- Deskripsi
- Tahun Ajaran
- Semester

Contoh tema:

"Bangunlah Jiwa dan Raganya"

Dimensi:

Gotong Royong

Elemen:

Kolaborasi

Sub-elemen:

Kerja sama

Target:

Mulai berkembang

---

# 19. DATA KETIDAKHADIRAN

Selain kehadiran umum, sediakan kategori:

- Sakit
- Izin
- Alpa
- Dispensasi
- Kegiatan sekolah

Semua memiliki jumlah dan keterangan.

---

# 20. DATA KELULUSAN

Operator dapat memproses siswa kelas akhir.

Status:

- Lulus
- Tidak Lulus
- Mengulang
- Pindah
- Keluar

Simpan:

- Tahun Kelulusan
- Nomor Ijazah
- Tanggal Kelulusan
- Keterangan

Data siswa yang lulus tidak boleh dihapus.

---

# 21. DATA MUTASI SISWA

Buat modul:

## Mutasi Siswa

Jenis:

- Masuk
- Keluar
- Pindah Sekolah
- Pindah Kelas

Data:

- Tanggal
- Jenis Mutasi
- Asal/Tujuan
- Alasan
- Keterangan
- Dokumen pendukung

---

# 22. MASTER TAHUN AJARAN

Operator dapat membuat:

2025/2026
2026/2027
2027/2028

Field:

- Tahun Ajaran
- Status Aktif

Hanya boleh ada satu tahun ajaran aktif.

---

# 23. MASTER SEMESTER

- Ganjil
- Genap

Semester terhubung dengan tahun ajaran.

---

# 24. MASTER KELAS

Contoh:

X PPLG 1
X PPLG 2
XI PPLG 1
XI PPLG 2
XII PPLG 1
XII PPLG 2

Field:

- Tingkat
- Nama Kelas
- Program Keahlian
- Jurusan
- Wali Kelas
- Tahun Ajaran
- Status

---

# 25. DASHBOARD ADMIN

Tampilkan:

- Total Siswa
- Siswa Aktif
- Total Guru
- Total Wali Kelas
- Total Kelas
- Siswa Laki-laki
- Siswa Perempuan
- Siswa Lulus
- Siswa Pindah

Chart:

- Statistik siswa per kelas
- Statistik jenis kelamin
- Statistik siswa berdasarkan status
- Grafik perkembangan jumlah siswa

Quick Action:

- Tambah Pengguna
- Tambah Tahun Ajaran
- Kelola Kelas
- Kelola Wali Kelas
- Lihat Audit Log

---

# 26. DASHBOARD OPERATOR

Tampilkan:

- Total siswa
- Total kelas
- Total wali kelas
- Tahun ajaran aktif
- Semester aktif
- Siswa belum memiliki kelas
- Siswa belum memiliki data lengkap
- Siswa yang perlu diproses kenaikan kelas

Quick Action:

- Kenaikan Kelas
- Atur Wali Kelas
- Kelola Siswa
- Kelola Kelas
- Export Data

---

# 27. DASHBOARD WALI KELAS

Dashboard hanya menampilkan kelas yang ditugaskan.

Contoh:

Selamat datang,
Bapak/Ibu [Nama]

Wali Kelas:
XI PPLG 1

Statistik:

- Total Siswa
- Laki-laki
- Perempuan
- Data Belum Lengkap
- Rata-rata Kehadiran

Daftar siswa:

- Nomor
- NIS
- NISN
- Nama
- L/P
- Status
- Kelengkapan Data
- Action

---

# 28. PROFIL DETAIL SISWA

Ketika Wali Kelas membuka siswa:

Buat halaman detail dengan tab:

1. Biodata
2. Orang Tua/Wali
3. Pendidikan
4. Kesehatan
5. Kehadiran
6. Prestasi
7. Ekstrakurikuler
8. Nilai
9. P5
10. Riwayat Kelas
11. Riwayat Mutasi

Gunakan layout modern.

Header:

Foto siswa
Nama
NISN
NIS
Kelas
Status

---

# 29. INDIKATOR KELENGKAPAN DATA

Setiap siswa memiliki persentase kelengkapan.

Contoh:

Data Lengkap
██████████ 100%

atau:

Data Lengkap
████████░░ 80%

Kategori:

- Biodata
- Orang tua
- Pendidikan
- Kesehatan
- Kehadiran
- Prestasi
- Ekstrakurikuler
- Nilai

Tampilkan bagian yang belum lengkap.

---

# 30. SEARCH DAN FILTER

Semua tabel harus memiliki:

Search:

- Nama
- NIS
- NISN

Filter:

- Tahun Ajaran
- Semester
- Kelas
- Jurusan
- Jenis Kelamin
- Status

Sorting:

- Nama
- NIS
- NISN
- Kelas

Pagination:

10
25
50
100 data per halaman.

---

# 31. IMPORT DATA

Operator dapat melakukan import siswa menggunakan Excel.

Format Excel:

NIS
NISN
NIK
Nama
Jenis Kelamin
Tempat Lahir
Tanggal Lahir
Agama
Alamat
Nomor Telepon
dan field lainnya.

Sediakan:

[ Download Template Excel ]

Setelah upload:

1. Validasi data
2. Tampilkan preview
3. Tampilkan error
4. Konfirmasi import
5. Simpan data

Jangan langsung memasukkan data tanpa preview.

---

# 32. EXPORT DATA

Sediakan:

- Export Excel
- Export PDF
- Cetak

Filter export harus mengikuti filter yang dipilih.

Contoh:

Export seluruh siswa kelas X PPLG 1.

Atau:

Export seluruh siswa aktif.

---

# 33. CETAK PROFIL SISWA

Buat format cetak yang menyerupai dokumen administrasi sekolah.

Isi:

- Identitas siswa
- Foto
- Data orang tua
- Riwayat pendidikan
- Kesehatan
- Kehadiran
- Prestasi
- Ekstrakurikuler
- Nilai
- Riwayat kelas

Optimalkan untuk kertas A4.

---

# 34. AUDIT LOG

Semua tindakan penting dicatat.

Contoh:

Operator:
Budi

Melakukan:
Memindahkan siswa

Siswa:
Andi

Dari:
X PPLG 1

Ke:
XI PPLG 1

Waktu:
01 Oktober 2026 10:32

Audit log mencatat:

- User
- Role
- Action
- Model
- Record ID
- Old Data
- New Data
- IP Address
- User Agent
- Timestamp

---

# 35. KEAMANAN

Gunakan:

- Authentication
- Authorization
- Policy
- Role-based access control
- CSRF protection
- XSS protection
- SQL injection protection
- Form Request Validation
- Rate limiting
- Password hashing
- Session security
- Audit log

Jangan mempercayai role dari frontend.

Semua authorization wajib divalidasi kembali di backend.

---

# 36. ATURAN AKSES DATA

WAJIB.

### Admin

Dapat melihat seluruh data.

### Operator

Dapat melihat seluruh data administrasi siswa.

### Wali Kelas

Hanya dapat mengakses siswa yang:

student.class_id

berada pada kelas yang:

class.wali_kelas_id

sama dengan user yang sedang login.

Wali kelas tidak boleh mengakses URL siswa kelas lain secara langsung.

Contoh:

/students/100

tetap harus dicek menggunakan Policy.

---

# 37. DATABASE DESIGN

Minimal tabel:

users
roles
teachers
students
parents
guardians
academic_years
semesters
grades
classes
class_teacher_assignments
student_class_histories
subjects
student_subject_scores
attendances
achievements
achievement_types
extracurriculars
student_extracurriculars
health_records
education_histories
mutations
graduations
p5_projects
p5_assessments
school_profiles
audit_logs

Tambahkan timestamps:

created_at
updated_at

Untuk data yang membutuhkan histori gunakan:

deleted_at

dengan Soft Deletes jika sesuai.

---

# 38. STUDENT CLASS HISTORY

Ini WAJIB.

Tabel:

student_class_histories

Field minimal:

- id
- student_id
- academic_year_id
- semester_id
- class_id
- wali_kelas_id
- status
- promotion_status
- start_date
- end_date
- notes

Contoh:

Student:
Andi

Academic Year:
2025/2026

Class:
X PPLG 1

Wali:
Guru A

Status:
Completed

Kemudian:

2026/2027
XI PPLG 1
Guru B

Data sebelumnya tidak boleh dihapus.

---

# 39. FLOW KENAIKAN KELAS

Operator:

Dashboard
→ Kenaikan Kelas
→ Pilih Tahun Ajaran
→ Pilih Kelas
→ Sistem menampilkan siswa
→ Tentukan status siswa
→ Pilih kelas tujuan
→ Pilih wali kelas baru
→ Preview perubahan
→ Konfirmasi
→ Sistem membuat riwayat kelas baru
→ Sistem mempertahankan riwayat lama
→ Audit log dibuat

Gunakan transaction database.

Jika proses gagal, semua perubahan harus rollback.

---

# 40. FLOW WALI KELAS

Login
→ Dashboard
→ Kelas Saya
→ Daftar Siswa
→ Pilih Siswa
→ Edit Data
→ Validasi
→ Simpan
→ Audit Log

Wali kelas dapat mengubah data siswa yang menjadi tanggung jawabnya.

---

# 41. VALIDASI DATA

Contoh:

NISN harus 10 digit.

NIK harus 16 digit.

Nomor telepon menggunakan format yang valid.

Tanggal lahir tidak boleh melebihi tanggal sekarang.

Nilai harus berada pada range yang ditentukan.

Data wajib harus ditandai dengan *.

Tampilkan pesan error yang jelas dalam Bahasa Indonesia.

---

# 42. NOTIFICATION

Gunakan toast notification.

Contoh:

"Data siswa berhasil disimpan."

"Data siswa berhasil diperbarui."

"Proses kenaikan kelas berhasil."

"Wali kelas berhasil ditetapkan."

"Data belum lengkap."

"Import berhasil: 125 siswa."

"Import gagal: 3 data memiliki kesalahan."

---

# 43. EMPTY STATE

Jangan tampilkan tabel kosong tanpa informasi.

Contoh:

"Belum ada siswa pada kelas ini."

"Belum ada data prestasi."

"Belum ada data ekstrakurikuler."

Berikan tombol action jika diperlukan.

---

# 44. ERROR HANDLING

Gunakan halaman:

404
403
419
422
429
500

Buat desain error page yang tetap konsisten dengan aplikasi.

---

# 45. SIDEBAR NAVIGATION

## ADMIN

Dashboard

Data Master
- Tahun Ajaran
- Semester
- Kelas
- Mata Pelajaran
- Ekstrakurikuler
- Jenis Prestasi

Data Pengguna
- Admin
- Operator
- Wali Kelas

Laporan

Audit Log

Pengaturan

---

## OPERATOR

Dashboard

Data Siswa

Data Guru/Wali Kelas

Kelas

Tahun Ajaran

Kenaikan Kelas

Mutasi Siswa

Kelulusan

Data Master

Laporan

Import / Export

---

## WALI KELAS

Dashboard

Kelas Saya

Data Siswa

Kehadiran

Prestasi

Ekstrakurikuler

Nilai

P5

Laporan

---

# 46. HALAMAN DATA SISWA

Gunakan tabel modern.

Kolom:

No
Foto
NIS
NISN
Nama
L/P
Kelas
Status
Kelengkapan
Action

Action:

- Detail
- Edit
- Riwayat

Gunakan dropdown action agar tabel tetap bersih.

---

# 47. HALAMAN KELAS

Card:

X PPLG 1

Total Siswa:
32

Wali Kelas:
Budi Santoso

Tahun Ajaran:
2026/2027

Button:

Lihat Siswa
Atur Wali
Riwayat

---

# 48. HALAMAN RIWAYAT SISWA

Timeline:

2025/2026
X PPLG 1
Wali: Guru A

↓

2026/2027
XI PPLG 1
Wali: Guru B

↓

2027/2028
XII PPLG 1
Wali: Guru C

Tampilkan timeline secara visual.

---

# 49. UX RULES

Jangan membuat user mengisi terlalu banyak field dalam satu halaman.

Gunakan:

Stepper / Tabs / Accordion.

Contoh form siswa:

Step 1:
Identitas

Step 2:
Alamat

Step 3:
Orang Tua/Wali

Step 4:
Pendidikan

Step 5:
Kesehatan

Step 6:
Data Tambahan

Sediakan:

Simpan Draft
Simpan

---

# 50. RESPONSIVE

Desktop:
Sidebar permanen.

Tablet:
Sidebar dapat collapse.

Mobile:
Sidebar menjadi drawer.

Table mobile menggunakan:

- horizontal scroll
- responsive card
- atau column prioritization

Form harus nyaman digunakan melalui touchscreen.

---

# 51. PERFORMANCE

Gunakan:

- pagination server-side
- eager loading
- query optimization
- database indexing
- lazy loading
- debounce search
- caching untuk master data
- queue untuk export/import besar
- chunk processing untuk Excel

Jangan mengambil seluruh data siswa sekaligus.

---

# 52. DATABASE INDEX

Berikan index pada:

students.nis
students.nisn
students.nik
students.name
students.status
student_class_histories.student_id
student_class_histories.class_id
student_class_histories.academic_year_id
users.email

Gunakan unique constraint untuk:

NIS
NISN
NIK

sesuai kebutuhan dan aturan sekolah.

---

# 53. SEEDER

Buat seeder:

Admin:

email:
admin@sidata.test

Operator:

email:
operator@sidata.test

Wali Kelas:

email:
walikelas@sidata.test

Password default hanya untuk development.

Jangan menampilkan password default pada production.

Buat sample:

- tahun ajaran
- semester
- kelas
- guru
- siswa
- mata pelajaran
- ekstrakurikuler
- prestasi

---

# 54. API / ROUTE STRUCTURE

Gunakan route yang RESTful.

Contoh:

/dashboard

/students
/students/{student}

/classes
/classes/{class}

/teachers

/academic-years

/semesters

/promotions

/mutations

/graduations

/achievements

/extracurriculars

/attendances

/grades

/p5

/reports

/audit-logs

---

# 55. FORM PERMISSION

Pastikan frontend mengikuti permission.

Contoh:

Jika Wali Kelas:

Boleh:
View student kelas sendiri
Create data siswa
Update data siswa
Input kehadiran
Input prestasi
Input ekstrakurikuler
Input nilai
Input P5

Tidak boleh:
Mengubah role user
Mengubah tahun ajaran
Mengubah wali kelas
Memindahkan siswa
Menghapus histori kelas
Mengakses siswa kelas lain

Operator:

Boleh melakukan administrasi dan proses kenaikan kelas.

Admin:

Boleh mengelola sistem dan pengguna.

---

# 56. FITUR TAMBAHAN YANG DIREKOMENDASIKAN

Tambahkan:

## Dashboard Data Lengkap

Menampilkan siswa yang belum lengkap datanya.

Contoh:

12 siswa belum memiliki data orang tua.

7 siswa belum memiliki foto.

4 siswa belum memiliki data kesehatan.

---

## Bulk Action

Operator/Wali Kelas dapat memilih beberapa siswa.

Contoh:

☑ Andi
☑ Budi
☑ Citra

Action:

- Export
- Pindahkan kelas
- Cetak
- Update status

Tetap gunakan permission.

---

# 57. SISTEM SEARCH GLOBAL

Topbar memiliki global search.

User dapat mencari:

- siswa
- NIS
- NISN
- kelas
- guru

Contoh:

ketik:
"0094750842"

hasil:

Andi
XI PPLG 1
NISN: 0094750842

---

# 58. LAPORAN

Buat modul laporan.

Laporan:

1. Daftar seluruh siswa
2. Daftar siswa per kelas
3. Daftar siswa berdasarkan jenis kelamin
4. Daftar siswa berdasarkan status
5. Data orang tua
6. Data kesehatan
7. Data kehadiran
8. Data prestasi
9. Data ekstrakurikuler
10. Data nilai
11. Data siswa naik kelas
12. Data siswa lulus
13. Data siswa mutasi
14. Riwayat wali kelas
15. Profil lengkap siswa

Semua laporan dapat:

- Preview
- Print
- PDF
- Excel

---

# 59. AUDIT DAN HISTORI

Jangan menghapus informasi historis yang penting.

Contoh ketika siswa naik kelas:

JANGAN:

UPDATE student.class_id = new_class

saja.

Gunakan:

1. Tutup histori kelas lama.
2. Buat histori kelas baru.
3. Tetapkan wali kelas baru.
4. Simpan tahun ajaran baru.
5. Audit perubahan.

Dengan demikian sistem dapat mengetahui posisi siswa pada setiap tahun ajaran.

---

# 60. ARSITEKTUR PROJECT

Gunakan struktur Laravel yang bersih.

Backend:

app/
├── Models/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Policies/
├── Services/
├── Actions/
├── Exports/
├── Imports/
└── Notifications/

Frontend:

resources/js/
├── Components/
├── Layouts/
├── Pages/
│   ├── Dashboard/
│   ├── Students/
│   ├── Classes/
│   ├── Teachers/
│   ├── AcademicYears/
│   ├── Promotions/
│   ├── Attendances/
│   ├── Achievements/
│   ├── Extracurriculars/
│   ├── Grades/
│   ├── P5/
│   ├── Reports/
│   └── Users/
├── Hooks/
├── Types/
└── Utils/

---

# 61. CODING STANDARD

Gunakan:

- TypeScript strict mode
- Laravel Form Request
- Service/Action untuk proses bisnis kompleks
- Policy untuk authorization
- Eloquent relationship
- Database transaction
- DTO jika diperlukan
- reusable React component
- reusable table component
- reusable form component

Hindari:

- controller terlalu besar
- query database di frontend
- authorization hanya di frontend
- hardcoded role
- hardcoded tahun ajaran
- hardcoded kelas
- duplicate component
- duplicate logic

---

# 62. KENAIKAN KELAS HARUS AMAN

Proses kenaikan kelas adalah proses kritis.

Sebelum eksekusi tampilkan:

"Anda akan memproses kenaikan 32 siswa dari X PPLG 1 ke XI PPLG 1."

Tampilkan:

- jumlah siswa
- kelas asal
- kelas tujuan
- wali kelas lama
- wali kelas baru

Kemudian:

[ Batal ]
[ Konfirmasi Kenaikan ]

Setelah berhasil:

"32 siswa berhasil diproses."

---

# 63. DESIGN SYSTEM

Buat reusable:

Button
Input
Select
Combobox
DatePicker
Dialog
Modal
Table
Badge
Card
Tabs
Accordion
Dropdown
Breadcrumb
Pagination
Toast
Alert
Skeleton
EmptyState
ConfirmDialog
FileUpload
StatCard

---

# 64. OUTPUT YANG DIHARAPKAN

Bangun SIDATA Siswa sebagai aplikasi production-ready.

Prioritas:

1. Authentication
2. Role & permission
3. Master data
4. Data siswa
5. Data orang tua
6. Kelas
7. Wali kelas
8. Histori kelas
9. Kenaikan kelas
10. Kehadiran
11. Prestasi
12. Ekstrakurikuler
13. Nilai
14. P5
15. Laporan
16. Import/export
17. Audit log
18. Dashboard
19. Security
20. Responsive UI

Jangan membuat fitur hanya sebagai dummy UI.

Setiap halaman harus memiliki:

- database
- migration
- model
- relationship
- controller
- request validation
- authorization
- frontend page
- loading state
- empty state
- error handling

---

# 65. PRINSIP UTAMA PROJECT

SIDATA Siswa bukan sekadar aplikasi CRUD siswa.

Sistem harus berorientasi pada:

DATA SISWA
↓
KELAS
↓
WALI KELAS
↓
TAHUN AJARAN
↓
SEMESTER
↓
PERKEMBANGAN SISWA
↓
RIWAYAT AKADEMIK

Setiap data yang berubah dari tahun ke tahun harus memiliki histori.

Khusus pergantian wali kelas dan kenaikan kelas:

DATA LAMA TIDAK BOLEH HILANG.

Contoh final:

2025/2026
X PPLG 1
Wali: Guru A

↓ Kenaikan Kelas

2026/2027
XI PPLG 1
Wali: Guru B

↓ Kenaikan Kelas

2027/2028
XII PPLG 1
Wali: Guru C

SIDATA Siswa harus dapat menampilkan seluruh perjalanan tersebut dalam halaman "Riwayat Siswa".

---

# 66. HASIL AKHIR

Hasil akhir aplikasi harus terasa seperti sistem administrasi sekolah profesional yang:

- cepat
- aman
- modern
- mudah digunakan
- mudah dipelihara
- scalable
- responsive
- memiliki histori data
- memiliki role yang jelas
- memiliki audit trail
- mendukung laporan sekolah

Jangan membuat desain seperti template admin generik.

Gunakan pendekatan UI modern seperti aplikasi SaaS pendidikan profesional, tetapi tetap sederhana sehingga operator dan wali kelas yang tidak terlalu teknis dapat menggunakannya dengan mudah.