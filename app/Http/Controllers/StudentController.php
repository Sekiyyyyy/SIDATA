<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Achievement;
use App\Models\Attendance;
use App\Models\AuditLog;
use App\Models\EducationHistory;
use App\Models\Extracurricular;
use App\Models\Graduation;
use App\Models\HealthRecord;
use App\Models\SchoolClass;
use App\Models\SchoolProfile;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentClassHistory;
use App\Models\StudentExtracurricular;
use App\Models\StudentParent;
use App\Models\StudentSubjectScore;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Cell\DataType;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = Student::query()->with(['currentClass', 'parents']);

        // Scope jika Wali Kelas: HANYA tampilkan kelas yang diampu (Section 8, 36 prompt.md)
        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            $managedClass = SchoolClass::where('current_wali_kelas_id', $teacherId)->first();
            if ($managedClass) {
                $query->where('current_class_id', $managedClass->id);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        // Filter Class
        if ($classId = $request->input('class_id')) {
            $query->where('current_class_id', $classId);
        }

        // Filter Gender
        if ($gender = $request->input('gender')) {
            $query->where('gender', $gender);
        }

        // Filter Status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = (int) $request->input('per_page', 10);
        $students = $query->orderBy('name', 'asc')->paginate($perPage)->withQueryString();

        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            $managedClass = SchoolClass::where('current_wali_kelas_id', $teacherId)->first();
            $classes = $managedClass ? SchoolClass::where('id', $managedClass->id)->get() : collect();
        } else {
            $classes = SchoolClass::where('is_active', true)->get();
        }

        return Inertia::render('Students/Index', [
            'students' => $students,
            'classes' => $classes,
            'filters' => $request->only(['search', 'class_id', 'gender', 'status', 'per_page']),
        ]);
    }

    public function export(Request $request)
    {
        $user = Auth::user();
        $query = Student::with(['currentClass', 'parents']);

        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            $managedClass = SchoolClass::where('current_wali_kelas_id', $teacherId)->first();
            if ($managedClass) {
                $query->where('current_class_id', $managedClass->id);
            }
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }
        if ($classId = $request->input('class_id')) {
            $query->where('current_class_id', $classId);
        }

        $students = $query->orderBy('name', 'asc')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data Siswa');

        // Header Title Banner
        $school = SchoolProfile::first();
        $schoolName = $school ? $school->name : 'SMK NEGERI 1 BERINGIN';

        $sheet->setCellValue('A1', 'DATA BUKU INDUK PESERTA DIDIK');
        $sheet->setCellValue('A2', strtoupper($schoolName) . ' - TANGGAL EKSPOR: ' . date('d/m/Y H:i'));
        $sheet->mergeCells('A1:O1');
        $sheet->mergeCells('A2:O2');

        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A1:O1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF1E3A8A');

        $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(10)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A2:O2')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF2563EB');

        // Column Headers (Row 4)
        $columns = [
            'No',
            'NISN',
            'NIS',
            'Nama Lengkap Siswa',
            'Jenis Kelamin',
            'Kelas / Rombel',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Agama',
            'Status',
            'Alamat Siswa',
            'Nama Ayah',
            'Nama Ibu',
            'Pekerjaan Ayah/Ibu',
            'No. HP / Kontak',
        ];

        $headerRow = 4;
        foreach ($columns as $idx => $colName) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($idx + 1);
            $sheet->setCellValue("{$colLetter}{$headerRow}", $colName);
        }

        $headerRange = "A{$headerRow}:O{$headerRow}";
        $sheet->getStyle($headerRange)->getFont()->setBold(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
        $sheet->getStyle($headerRange)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF1E40AF');
        $sheet->getStyle($headerRange)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->getRowDimension($headerRow)->setRowHeight(28);

        // Data Rows
        $currentRow = 5;
        foreach ($students as $index => $s) {
            $parent = $s->parents;
            $birthDate = $s->birth_date ? (is_string($s->birth_date) ? substr($s->birth_date, 0, 10) : $s->birth_date->format('Y-m-d')) : '';
            $jobs = trim(($parent?->father_job ?? '') . ' / ' . ($parent?->mother_job ?? ''), ' /');

            $sheet->setCellValue("A{$currentRow}", $index + 1);
            $sheet->setCellValueExplicit("B{$currentRow}", (string) $s->nisn, DataType::TYPE_STRING);
            $sheet->setCellValueExplicit("C{$currentRow}", (string) $s->nis, DataType::TYPE_STRING);
            $sheet->setCellValue("D{$currentRow}", $s->name);
            $sheet->setCellValue("E{$currentRow}", $s->gender);
            $sheet->setCellValue("F{$currentRow}", $s->currentClass?->name ?? 'Belum Terdaftar');
            $sheet->setCellValue("G{$currentRow}", $s->birth_place);
            $sheet->setCellValue("H{$currentRow}", $birthDate);
            $sheet->setCellValue("I{$currentRow}", $s->religion);
            $sheet->setCellValue("J{$currentRow}", $s->status);
            $sheet->setCellValue("K{$currentRow}", $s->address);
            $sheet->setCellValue("L{$currentRow}", $parent?->father_name ?? '');
            $sheet->setCellValue("M{$currentRow}", $parent?->mother_name ?? '');
            $sheet->setCellValue("N{$currentRow}", $jobs);
            $sheet->setCellValueExplicit("O{$currentRow}", (string) ($s->phone ?? $parent?->father_phone ?? ''), DataType::TYPE_STRING);

            if ($currentRow % 2 === 0) {
                $sheet->getStyle("A{$currentRow}:O{$currentRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFF8FAFC');
            }

            $currentRow++;
        }

        // Borders
        $lastRow = max(5, $currentRow - 1);
        $sheet->getStyle("A4:O{$lastRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('FFCBD5E1');
        $sheet->getStyle("A5:A{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("B5:C{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("E5:F{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("H5:J{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Auto-fit column widths
        foreach (range(1, 15) as $colIdx) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIdx);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        $filename = 'data_siswa_sidata_' . date('Ymd_His') . '.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    public function downloadTemplate()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import Siswa');

        // Instructions banner
        $sheet->setCellValue('A1', 'PETUNJUK PENGISIAN TEMPLATE IMPORT DATA SISWA - SIDATA');
        $sheet->setCellValue('A2', '1. Baris 4 adalah kunci kolom teknis (JANGAN DIUBAH). Baris 5 adalah petunjuk judul kolom.');
        $sheet->setCellValue('A3', '2. Kolom bertanda (*) WAJIB diisi. Format tanggal_lahir: YYYY-MM-DD. NIS & NISN disimpan sebagai TEKS tanpa spasi.');
        $sheet->mergeCells('A1:P1');
        $sheet->mergeCells('A2:P2');
        $sheet->mergeCells('A3:P3');

        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(12)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
        $sheet->getStyle('A1:P1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF1E3A8A');

        $sheet->getStyle('A2:A3')->getFont()->setSize(9)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('334155'));
        $sheet->getStyle('A2:P3')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFF1F5F9');

        // Header Row (Row 4 & 5)
        $headers = [
            'nis' => 'NIS (*)',
            'nisn' => 'NISN (*)',
            'nama_lengkap' => 'Nama Lengkap (*)',
            'jenis_kelamin' => 'Jenis Kelamin (Laki-laki/Perempuan) (*)',
            'kelas' => 'Kelas / Rombel (*)',
            'tempat_lahir' => 'Tempat Lahir (*)',
            'tanggal_lahir' => 'Tanggal Lahir (YYYY-MM-DD) (*)',
            'agama' => 'Agama (Islam/Kristen/dll)',
            'alamat' => 'Alamat Lengkap',
            'nomor_hp' => 'Nomor HP Siswa',
            'nama_ayah' => 'Nama Ayah',
            'pekerjaan_ayah' => 'Pekerjaan Ayah',
            'nama_ibu' => 'Nama Ibu',
            'pekerjaan_ibu' => 'Pekerjaan Ibu',
            'no_hp_orang_tua' => 'No HP Orang Tua',
            'alamat_orang_tua' => 'Alamat Orang Tua',
        ];

        $colIdx = 1;
        foreach ($headers as $key => $label) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIdx);
            $sheet->setCellValue("{$colLetter}4", $key);
            $sheet->setCellValue("{$colLetter}5", $label);
            $colIdx++;
        }

        // Row 4: technical keys
        $sheet->getStyle('A4:P4')->getFont()->setBold(true)->setSize(9)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('64748B'));
        $sheet->getStyle('A4:P4')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2E8F0');
        
        // Row 5: human labels
        $sheet->getStyle('A5:P5')->getFont()->setBold(true)->setSize(10)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
        $sheet->getStyle('A5:P5')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF2563EB');
        $sheet->getStyle('A5:P5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->getRowDimension(5)->setRowHeight(26);

        // Example Rows (Row 6 & 7)
        $exampleData = [
            [
                'nis' => '230101',
                'nisn' => '0081234561',
                'nama_lengkap' => 'ADITYA PRATAMA',
                'jenis_kelamin' => 'Laki-laki',
                'kelas' => 'X PPLG 1',
                'tempat_lahir' => 'Beringin',
                'tanggal_lahir' => '2008-04-12',
                'agama' => 'Islam',
                'alamat' => 'Jl. Pendidikan No. 12, Beringin, Deli Serdang',
                'nomor_hp' => '081234567890',
                'nama_ayah' => 'Bambang Sudarmono',
                'pekerjaan_ayah' => 'Wiraswasta',
                'nama_ibu' => 'Siti Aminah',
                'pekerjaan_ibu' => 'Ibu Rumah Tangga',
                'no_hp_orang_tua' => '081298765432',
                'alamat_orang_tua' => 'Jl. Pendidikan No. 12, Beringin, Deli Serdang',
            ],
            [
                'nis' => '230102',
                'nisn' => '0089876542',
                'nama_lengkap' => 'CITRA LESTARI',
                'jenis_kelamin' => 'Perempuan',
                'kelas' => 'X PPLG 1',
                'tempat_lahir' => 'Medan',
                'tanggal_lahir' => '2008-09-25',
                'agama' => 'Islam',
                'alamat' => 'Jl. Pahlawan No. 45, Lubuk Pakam',
                'nomor_hp' => '082198765431',
                'nama_ayah' => 'Surya Wijaya',
                'pekerjaan_ayah' => 'Karyawan Swasta',
                'nama_ibu' => 'Dewi Rahayu',
                'pekerjaan_ibu' => 'Guru',
                'no_hp_orang_tua' => '082111223344',
                'alamat_orang_tua' => 'Jl. Pahlawan No. 45, Lubuk Pakam',
            ],
        ];

        foreach ($exampleData as $rIdx => $row) {
            $rowNum = 6 + $rIdx;
            $c = 1;
            foreach ($row as $val) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($c);
                $sheet->setCellValueExplicit("{$colLetter}{$rowNum}", (string) $val, DataType::TYPE_STRING);
                $c++;
            }
            $sheet->getStyle("A{$rowNum}:P{$rowNum}")->getFont()->setItalic(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('475569'));
        }

        // Borders
        $sheet->getStyle('A4:P7')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('FFCBD5E1');

        // Auto-fit column widths
        foreach (range(1, 16) as $colIdx) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIdx);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        $filename = 'template_import_siswa_sidata.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
            'target_class_id' => 'nullable|exists:classes,id',
        ]);

        $user = Auth::user();
        $targetClassId = $request->input('target_class_id');

        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            $managedClass = SchoolClass::where('current_wali_kelas_id', $teacherId)->first();
            if ($managedClass) {
                $targetClassId = $managedClass->id;
            }
        }

        $file = $request->file('file');

        try {
            $spreadsheet = IOFactory::load($file->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membaca berkas Excel: ' . $e->getMessage());
        }

        if (empty($rows)) {
            return redirect()->back()->with('error', 'Berkas Excel kosong.');
        }

        // Find header row: look for row containing 'nis' or 'nisn' or 'nama'
        $headerRowIndex = null;
        $columnMap = [];

        foreach ($rows as $rowIndex => $row) {
            $normalized = array_map(function ($val) {
                return strtolower(trim((string) $val));
            }, $row);

            if (in_array('nis', $normalized) && in_array('nisn', $normalized)) {
                $headerRowIndex = $rowIndex;
                foreach ($normalized as $colKey => $colName) {
                    if ($colName !== '') {
                        $columnMap[$colName] = $colKey;
                    }
                }
                break;
            }
        }

        // Fallback: If not found by keyword 'nis'/'nisn', check row 4 or 5 or 1
        if (!$headerRowIndex) {
            foreach ([4, 5, 1, 2, 3] as $candidateRow) {
                if (isset($rows[$candidateRow])) {
                    $rowVals = array_values(array_filter($rows[$candidateRow]));
                    if (count($rowVals) >= 3) {
                        $headerRowIndex = $candidateRow;
                        $columnMap = [
                            'nis' => 'A',
                            'nisn' => 'B',
                            'nama_lengkap' => 'C',
                            'jenis_kelamin' => 'D',
                            'kelas' => 'E',
                            'tempat_lahir' => 'F',
                            'tanggal_lahir' => 'G',
                            'agama' => 'H',
                            'alamat' => 'I',
                            'nomor_hp' => 'J',
                            'nama_ayah' => 'K',
                            'pekerjaan_ayah' => 'L',
                            'nama_ibu' => 'M',
                            'pekerjaan_ibu' => 'N',
                            'no_hp_orang_tua' => 'O',
                            'alamat_orang_tua' => 'P',
                        ];
                        break;
                    }
                }
            }
        }

        if (!$headerRowIndex) {
            return redirect()->back()->with('error', 'Format template Excel tidak dikenali. Silakan unduh template resmi.');
        }

        $allClasses = SchoolClass::all();
        $inserted = 0;
        $updated = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($rows as $rowIndex => $row) {
                if ($rowIndex <= $headerRowIndex) {
                    continue;
                }
                if ($headerRowIndex === 4 && $rowIndex === 5) {
                    continue;
                }

                $getVal = function ($key) use ($columnMap, $row) {
                    $col = $columnMap[$key] ?? null;
                    return $col && isset($row[$col]) ? trim((string) $row[$col]) : null;
                };

                $nis = $getVal('nis');
                $nisn = $getVal('nisn');
                $name = $getVal('nama_lengkap') ?: $getVal('nama');

                if (!$nis && !$nisn && !$name) {
                    continue;
                }
                if ($name === 'ADITYA PRATAMA' && $nis === '230101') {
                    continue;
                }
                if ($name === 'CITRA LESTARI' && $nis === '230102') {
                    continue;
                }

                if (!$nis || !$nisn || !$name) {
                    $errors[] = "Baris {$rowIndex}: NIS, NISN, dan Nama Siswa wajib diisi.";
                    continue;
                }

                // Determine class
                $classId = $targetClassId;
                if (!$classId) {
                    $className = $getVal('kelas') ?: $getVal('kelas / rombel');
                    if ($className) {
                        $matchedClass = $allClasses->first(function ($c) use ($className) {
                            return strcasecmp($c->name, $className) === 0 || stripos($c->name, $className) !== false;
                        });
                        $classId = $matchedClass?->id;
                    }
                }

                // Determine gender
                $rawGender = strtolower($getVal('jenis_kelamin') ?? 'l');
                $gender = (str_starts_with($rawGender, 'p') || str_contains($rawGender, 'perempuan')) ? 'Perempuan' : 'Laki-laki';

                // Determine birth date
                $birthDateStr = $getVal('tanggal_lahir');
                $birthDate = '2008-01-01';
                if ($birthDateStr) {
                    try {
                        if (is_numeric($birthDateStr)) {
                            $dateTime = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float) $birthDateStr);
                            $birthDate = $dateTime->format('Y-m-d');
                        } else {
                            $parsed = strtotime($birthDateStr);
                            if ($parsed) {
                                $birthDate = date('Y-m-d', $parsed);
                            }
                        }
                    } catch (\Exception $e) {
                        $birthDate = '2008-01-01';
                    }
                }

                $student = Student::where('nis', $nis)->orWhere('nisn', $nisn)->first();

                if ($student) {
                    $student->update([
                        'name' => strtoupper($name),
                        'gender' => $gender,
                        'birth_place' => $getVal('tempat_lahir') ?: ($student->birth_place ?: 'Beringin'),
                        'birth_date' => $birthDate ?: $student->birth_date,
                        'religion' => strtoupper($getVal('agama') ?: ($student->religion ?: 'ISLAM')),
                        'address' => $getVal('alamat') ?: $student->address,
                        'phone' => $getVal('nomor_hp') ?: $student->phone,
                        'current_class_id' => $classId ?: $student->current_class_id,
                    ]);
                    $updated++;
                } else {
                    $student = Student::create([
                        'nis' => $nis,
                        'nisn' => $nisn,
                        'name' => strtoupper($name),
                        'gender' => $gender,
                        'birth_place' => $getVal('tempat_lahir') ?: 'Beringin',
                        'birth_date' => $birthDate,
                        'religion' => strtoupper($getVal('agama') ?: 'ISLAM'),
                        'citizenship' => 'INDONESIA',
                        'address' => $getVal('alamat') ?: 'Beringin',
                        'phone' => $getVal('nomor_hp'),
                        'status' => 'Aktif',
                        'current_class_id' => $classId,
                    ]);
                    $inserted++;
                }

                // Parent records
                $fatherName = $getVal('nama_ayah');
                $fatherJob = $getVal('pekerjaan_ayah');
                $motherName = $getVal('nama_ibu');
                $motherJob = $getVal('pekerjaan_ibu');
                $parentPhone = $getVal('no_hp_orang_tua');
                $parentAddress = $getVal('alamat_orang_tua') ?: $getVal('alamat');

                if ($fatherName || $motherName || $parentAddress || $parentPhone) {
                    $student->parents()->updateOrCreate(
                        ['student_id' => $student->id],
                        [
                            'father_name' => $fatherName ?: ($student->parents?->father_name ?? ''),
                            'father_job' => $fatherJob ?: ($student->parents?->father_job ?? ''),
                            'father_phone' => $parentPhone ?: ($student->parents?->father_phone ?? ''),
                            'mother_name' => $motherName ?: ($student->parents?->mother_name ?? ''),
                            'mother_job' => $motherJob ?: ($student->parents?->mother_job ?? ''),
                            'mother_phone' => $parentPhone ?: ($student->parents?->mother_phone ?? ''),
                            'parent_address' => $parentAddress ?: ($student->parents?->parent_address ?? ''),
                        ]
                    );
                }
            }

            DB::commit();

            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'IMPORT_EXCEL',
                'description' => "Mengimpor data siswa via Excel: {$inserted} baru, {$updated} diperbarui.",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memproses data: ' . $e->getMessage());
        }

        $msg = "Proses import Excel selesai! Berhasil menambahkan {$inserted} siswa baru dan memperbarui {$updated} data siswa.";
        if (!empty($errors)) {
            $msg .= ' Catatan: ' . implode(' ', array_slice($errors, 0, 3));
        }

        return redirect()->route('students.index')->with('success', $msg);
    }

    public function show(Student $student): Response
    {
        $user = Auth::user();

        // Policy Check: Isolasi ketat wali kelas
        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            if (!$student->currentClass || $student->currentClass->current_wali_kelas_id !== $teacherId) {
                abort(403, 'Akses ditolak. Anda hanya memiliki hak akses untuk siswa kelas binaan Anda.');
            }
            $classes = SchoolClass::where('current_wali_kelas_id', $teacherId)->get();
        } else {
            $classes = SchoolClass::where('is_active', true)->get();
        }

        $student->load([
            'currentClass.waliKelas',
            'parents',
            'guardian',
            'educationHistory',
            'healthRecords.academicYear',
            'healthRecords.semester',
            'classHistories.academicYear',
            'classHistories.semester',
            'classHistories.schoolClass',
            'classHistories.waliKelas',
            'subjectScores.subject',
            'subjectScores.academicYear',
            'subjectScores.semester',
            'attendances.academicYear',
            'attendances.semester',
            'achievements',
            'studentExtracurriculars.extracurricular',
            'p5Assessments.project',
            'mutations',
            'graduation',
        ]);

        $subjects = Subject::orderBy('order_num')->get();
        $activeYear = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        return Inertia::render('Students/Show', [
            'student' => $student,
            'classes' => $classes,
            'subjects' => $subjects,
            'activeYear' => $activeYear,
            'activeSem' => $activeSem,
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();
        $managedClass = null;
        $defaultClassId = null;

        if ($user->isWaliKelas() && $user->teacher) {
            $managed = SchoolClass::where('current_wali_kelas_id', $user->teacher->id)->first();
            $defaultClassId = $managed?->id;
            $managedClass = $managed;
            $classes = $managed ? SchoolClass::where('id', $managed->id)->get() : collect();
        } else {
            $classes = SchoolClass::where('is_active', true)->with('academicYear')->get();
        }

        return Inertia::render('Students/Create', [
            'classes' => $classes,
            'defaultClassId' => $defaultClassId,
            'managedClass' => $managedClass,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => ['required', 'string', 'unique:students,nis'],
            'nisn' => ['required', 'string', 'size:10', 'unique:students,nisn'],
            'nik' => ['nullable', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['nullable', 'string'],
            'gender' => ['required', 'in:Laki-laki,Perempuan'],
            'birth_place' => ['nullable', 'string'],
            'birth_date' => ['nullable', 'date'],
            'religion' => ['nullable', 'string'],
            'citizenship' => ['nullable', 'string'],
            'child_order' => ['nullable', 'string'],
            'siblings_count' => ['nullable', 'integer'],
            'blood_type' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'village' => ['nullable', 'string'],
            'district' => ['nullable', 'string'],
            'regency' => ['nullable', 'string'],
            'province' => ['nullable', 'string'],
            'postal_code' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'distance_to_school' => ['nullable', 'string'],
            'residence_type' => ['nullable', 'string'],
            'current_class_id' => ['nullable', 'exists:classes,id'],

            // Parents & Guardian
            'parent_name' => ['nullable', 'string'],
            'parent_phone' => ['nullable', 'string'],
            'father_name' => ['nullable', 'string'],
            'father_nik' => ['nullable', 'string'],
            'father_education' => ['nullable', 'string'],
            'father_job' => ['nullable', 'string'],
            'father_phone' => ['nullable', 'string'],
            'mother_name' => ['nullable', 'string'],
            'mother_nik' => ['nullable', 'string'],
            'mother_education' => ['nullable', 'string'],
            'mother_job' => ['nullable', 'string'],
            'mother_phone' => ['nullable', 'string'],

            // Guardian
            'guardian_name' => ['nullable', 'string'],
            'guardian_relation' => ['nullable', 'string'],
            'guardian_job' => ['nullable', 'string'],
            'guardian_phone' => ['nullable', 'string'],

            // School previous
            'previous_school_name' => ['nullable', 'string'],
            'previous_school_certificate' => ['nullable', 'string'],

            // Health & Physical
            'height' => ['nullable', 'integer'],
            'weight' => ['nullable', 'integer'],
            'medical_history' => ['nullable', 'string'],
            'special_condition' => ['nullable', 'string'],
        ]);

        $action = $request->input('action', 'save');
        $user = Auth::user();

        // Isolasi ketat: Jika wali kelas, kelas otomatis terkunci ke rombel binaan sendiri
        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            $managed = SchoolClass::where('current_wali_kelas_id', $teacherId)->first();
            if ($managed) {
                $validated['current_class_id'] = $managed->id;
            } else {
                abort(403, 'Akses ditolak. Anda tidak terdaftar sebagai wali kelas dari rombel aktif.');
            }
        }

        DB::beginTransaction();
        try {
            $student = Student::create([
                'nomor_urut' => $request->input('nomor_urut') ?: null,
                'nis' => $validated['nis'],
                'nisn' => $validated['nisn'],
                'nik' => $validated['nik'] ?? null,
                'name' => strtoupper($validated['name']),
                'nickname' => !empty($validated['nickname']) ? strtoupper($validated['nickname']) : null,
                'gender' => $validated['gender'],
                'birth_place' => !empty($validated['birth_place']) ? strtoupper($validated['birth_place']) : null,
                'birth_date' => !empty($validated['birth_date']) ? $validated['birth_date'] : null,
                'religion' => !empty($validated['religion']) ? $validated['religion'] : null,
                'citizenship' => !empty($validated['citizenship']) ? strtoupper($validated['citizenship']) : 'INDONESIA',
                'child_order' => $validated['child_order'] ?? null,
                'siblings_count' => isset($validated['siblings_count']) && $validated['siblings_count'] !== '' ? (int) $validated['siblings_count'] : 0,
                'step_siblings_count' => $request->filled('step_siblings_count') ? (int) $request->input('step_siblings_count') : 0,
                'foster_siblings_count' => $request->filled('foster_siblings_count') ? (int) $request->input('foster_siblings_count') : 0,
                'daily_language' => $request->filled('daily_language') ? strtoupper($request->input('daily_language')) : 'BAHASA INDONESIA',
                'blood_type' => $validated['blood_type'] ?? null,
                'address' => !empty($validated['address']) ? strtoupper($validated['address']) : null,
                'rt_rw' => $request->input('rt_rw') ?: null,
                'village' => !empty($validated['village']) ? strtoupper($validated['village']) : null,
                'district' => !empty($validated['district']) ? strtoupper($validated['district']) : null,
                'regency' => !empty($validated['regency']) ? strtoupper($validated['regency']) : null,
                'province' => !empty($validated['province']) ? strtoupper($validated['province']) : null,
                'postal_code' => $validated['postal_code'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'distance_to_school' => $validated['distance_to_school'] ?? null,
                'residence_type' => $validated['residence_type'] ?? null,
                'current_class_id' => $validated['current_class_id'] ?? null,
                'photo_url' => $request->input('photo_url') ?: null,
                'status' => 'Aktif',
            ]);

            // Orang Tua (Hanya dicatat jika ada data yang diinput)
            $fatherName = $validated['father_name'] ?? ($request->input('parent_name') ?? '');
            $motherName = $validated['mother_name'] ?? '';
            $parentPhone = $validated['father_phone'] ?? ($request->input('parent_phone') ?? ($validated['phone'] ?? ''));

            if (!empty($fatherName) || !empty($motherName) || !empty($parentPhone)) {
                StudentParent::create([
                    'student_id' => $student->id,
                    'father_name' => !empty($fatherName) ? strtoupper($fatherName) : null,
                    'father_nik' => $validated['father_nik'] ?? null,
                    'father_education' => $validated['father_education'] ?? null,
                    'father_job' => !empty($validated['father_job']) ? strtoupper($validated['father_job']) : null,
                    'father_phone' => $parentPhone ?: null,
                    'mother_name' => !empty($motherName) ? strtoupper($motherName) : null,
                    'mother_nik' => $validated['mother_nik'] ?? null,
                    'mother_education' => $validated['mother_education'] ?? null,
                    'mother_job' => !empty($validated['mother_job']) ? strtoupper($validated['mother_job']) : null,
                    'mother_phone' => $validated['mother_phone'] ?? null,
                    'parent_address' => !empty($validated['address']) ? strtoupper($validated['address']) : null,
                ]);
            }

            // Wali jika diisi
            if (!empty($validated['guardian_name'])) {
                $student->guardian()->create([
                    'name' => strtoupper($validated['guardian_name']),
                    'relation' => $validated['guardian_relation'] ?? 'Wali',
                    'education' => $request->input('guardian_education', 'SLTA / SEDERAJAT'),
                    'job' => strtoupper($validated['guardian_job'] ?? ''),
                    'phone' => $validated['guardian_phone'] ?? '',
                    'address' => strtoupper($validated['address']),
                ]);
            }

            // Riwayat SMP
            if (!empty($validated['previous_school_name'])) {
                EducationHistory::create([
                    'student_id' => $student->id,
                    'previous_school_type' => $request->input('previous_school_type', 'SMP NEGERI'),
                    'school_name' => strtoupper($validated['previous_school_name']),
                    'certificate_number' => $validated['previous_school_certificate'] ?? null,
                    'certificate_date' => $request->input('previous_school_certificate_date', null),
                ]);
            }

            // Data Kesehatan & Fisik
            $activeYear = AcademicYear::where('is_active', true)->first();
            $activeSem = Semester::where('is_active', true)->first();

            if ($activeYear && $activeSem && (!empty($validated['height']) || !empty($validated['weight']) || !empty($validated['medical_history']))) {
                HealthRecord::create([
                    'student_id' => $student->id,
                    'academic_year_id' => $activeYear->id,
                    'semester_id' => $activeSem->id,
                    'height' => (int) ($validated['height'] ?? 0),
                    'weight' => (int) ($validated['weight'] ?? 0),
                    'medical_history' => $validated['medical_history'] ?? '-',
                    'special_condition' => $validated['special_condition'] ?? '-',
                ]);
            }

            // Catat Class History Pertama jika ada kelas
            if ($student->current_class_id) {
                $class = SchoolClass::find($student->current_class_id);
                if ($class && $activeYear && $activeSem) {
                    StudentClassHistory::create([
                        'student_id' => $student->id,
                        'academic_year_id' => $activeYear->id,
                        'semester_id' => $activeSem->id,
                        'class_id' => $class->id,
                        'wali_kelas_id' => $class->current_wali_kelas_id,
                        'status' => 'Active',
                        'promotion_status' => 'Siswa Baru Diterima',
                        'start_date' => now(),
                    ]);
                }
            }

            AuditLog::record('Menambah Data Siswa Baru (Buku Induk)', $student, null, $student->toArray());

            DB::commit();

            if ($action === 'save_and_new') {
                return redirect()->route('students.create')
                    ->with('success', "Data siswa {$student->name} berhasil disimpan! Silakan input data siswa baru selanjutnya.");
            }

            if ($action === 'save_and_print') {
                return redirect()->to('/reports/buku-induk/' . $student->id . '?print=1')
                    ->with('success', 'Data siswa berhasil dicatat! Menyiapkan Lembar Buku Induk A4 untuk dicetak...');
            }

            return redirect()->route('students.show', $student->id)->with('success', "Data {$student->name} berhasil ditambahkan! Anda dapat langsung melengkapi lembar buku induk lainnya atau mencicilnya nanti.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'Gagal menyimpan siswa: ' . $e->getMessage());
        }
    }

    public function edit(Student $student): Response
    {
        $user = Auth::user();

        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            if (!$student->currentClass || $student->currentClass->current_wali_kelas_id !== $teacherId) {
                abort(403, 'Akses ditolak. Anda hanya berhak mengedit data siswa kelas binaan Anda.');
            }
            $classes = SchoolClass::where('current_wali_kelas_id', $teacherId)->get();
        } else {
            $classes = SchoolClass::where('is_active', true)->get();
        }

        $student->load([
            'currentClass.waliKelas',
            'parents', 
            'guardian', 
            'educationHistory', 
            'healthRecords.academicYear',
            'healthRecords.semester',
            'classHistories.academicYear',
            'classHistories.semester',
            'classHistories.schoolClass',
            'classHistories.waliKelas',
            'achievements', 
            'mutations', 
            'graduation',
            'attendances.academicYear',
            'attendances.semester',
            'subjectScores.subject',
            'subjectScores.academicYear',
            'subjectScores.semester',
            'studentExtracurriculars.extracurricular',
            'p5Assessments.project',
        ]);
        $subjects = Subject::orderBy('order_num')->get();
        $activeYear = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        return Inertia::render('Students/Edit', [
            'student' => $student,
            'classes' => $classes,
            'subjects' => $subjects,
            'activeYear' => $activeYear,
            'activeSem' => $activeSem,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $user = Auth::user();

        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            if (!$student->currentClass || $student->currentClass->current_wali_kelas_id !== $teacherId) {
                abort(403, 'Akses ditolak. Anda hanya berhak mengubah siswa kelas binaan Anda.');
            }
        }

        $validated = $request->validate([
            'nis' => ['required', 'string', 'unique:students,nis,' . $student->id],
            'nisn' => ['required', 'string', 'size:10', 'unique:students,nisn,' . $student->id],
            'nik' => ['nullable', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['nullable', 'string'],
            'gender' => ['required', 'in:Laki-laki,Perempuan'],
            'birth_place' => ['nullable', 'string'],
            'birth_date' => ['nullable', 'date'],
            'religion' => ['nullable', 'string'],
            'citizenship' => ['nullable', 'string'],
            'child_order' => ['nullable', 'string'],
            'siblings_count' => ['nullable', 'integer'],
            'blood_type' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'village' => ['nullable', 'string'],
            'district' => ['nullable', 'string'],
            'regency' => ['nullable', 'string'],
            'province' => ['nullable', 'string'],
            'postal_code' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'distance_to_school' => ['nullable', 'string'],
            'residence_type' => ['nullable', 'string'],
            'status' => ['required', 'in:Aktif,Lulus,Pindah,Keluar,Tidak Aktif'],
            'current_class_id' => ['nullable', 'exists:classes,id'],

            // Parents
            'father_name' => ['nullable', 'string'],
            'father_nik' => ['nullable', 'string'],
            'father_education' => ['nullable', 'string'],
            'father_job' => ['nullable', 'string'],
            'father_phone' => ['nullable', 'string'],
            'mother_name' => ['nullable', 'string'],
            'mother_nik' => ['nullable', 'string'],
            'mother_education' => ['nullable', 'string'],
            'mother_job' => ['nullable', 'string'],
            'mother_phone' => ['nullable', 'string'],

            // Guardian
            'guardian_name' => ['nullable', 'string'],
            'guardian_relation' => ['nullable', 'string'],
            'guardian_job' => ['nullable', 'string'],
            'guardian_phone' => ['nullable', 'string'],

            // Education
            'previous_school_name' => ['nullable', 'string'],
            'previous_school_certificate' => ['nullable', 'string'],

            // Health & Physical
            'height' => ['nullable', 'integer'],
            'weight' => ['nullable', 'integer'],
            'medical_history' => ['nullable', 'string'],
            'special_condition' => ['nullable', 'string'],
        ]);

        $action = $request->input('action', 'save');
        if ($user->isWaliKelas()) {
            $validated['current_class_id'] = $student->current_class_id;
        }
        $oldData = $student->toArray();

        DB::beginTransaction();
        try {
            $student->update([
                'nomor_urut' => $request->input('nomor_urut', $student->nomor_urut ?? '1'),
                'nis' => $validated['nis'],
                'nisn' => $validated['nisn'],
                'nik' => $validated['nik'] ?? null,
                'name' => strtoupper($validated['name']),
                'nickname' => strtoupper($validated['nickname'] ?? ''),
                'gender' => $validated['gender'],
                'birth_place' => !empty($validated['birth_place']) ? strtoupper($validated['birth_place']) : null,
                'birth_date' => !empty($validated['birth_date']) ? $validated['birth_date'] : null,
                'religion' => !empty($validated['religion']) ? $validated['religion'] : null,
                'citizenship' => !empty($validated['citizenship']) ? strtoupper($validated['citizenship']) : 'INDONESIA',
                'child_order' => $validated['child_order'] ?? null,
                'siblings_count' => isset($validated['siblings_count']) && $validated['siblings_count'] !== '' ? (int) $validated['siblings_count'] : 0,
                'step_siblings_count' => (int) $request->input('step_siblings_count', $student->step_siblings_count ?? 0),
                'foster_siblings_count' => (int) $request->input('foster_siblings_count', $student->foster_siblings_count ?? 0),
                'daily_language' => !empty($request->input('daily_language')) ? strtoupper($request->input('daily_language')) : ($student->daily_language ?? 'BAHASA INDONESIA'),
                'blood_type' => $validated['blood_type'] ?? null,
                'address' => !empty($validated['address']) ? strtoupper($validated['address']) : null,
                'rt_rw' => $request->input('rt_rw', $student->rt_rw ?? null),
                'village' => !empty($validated['village']) ? strtoupper($validated['village']) : null,
                'district' => !empty($validated['district']) ? strtoupper($validated['district']) : null,
                'regency' => !empty($validated['regency']) ? strtoupper($validated['regency']) : null,
                'province' => !empty($validated['province']) ? strtoupper($validated['province']) : null,
                'postal_code' => $validated['postal_code'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'distance_to_school' => $validated['distance_to_school'] ?? null,
                'residence_type' => $validated['residence_type'] ?? 'Bersama Orang Tua',
                'photo_url' => $request->input('photo_url', $student->photo_url ?? '/assets/aditya.jpg'),
                'status' => $validated['status'],
                'current_class_id' => $validated['current_class_id'] ?? $student->current_class_id,
            ]);

            // Update or Create Parents
            $student->parents()->updateOrCreate(
                ['student_id' => $student->id],
                [
                    'father_name' => strtoupper($validated['father_name'] ?? ''),
                    'father_nik' => $validated['father_nik'] ?? '',
                    'father_education' => $validated['father_education'] ?? '',
                    'father_job' => strtoupper($validated['father_job'] ?? ''),
                    'father_phone' => $validated['father_phone'] ?? '',
                    'mother_name' => strtoupper($validated['mother_name'] ?? ''),
                    'mother_nik' => $validated['mother_nik'] ?? '',
                    'mother_education' => $validated['mother_education'] ?? '',
                    'mother_job' => strtoupper($validated['mother_job'] ?? ''),
                    'mother_phone' => $validated['mother_phone'] ?? '',
                    'parent_address' => !empty($validated['address']) ? strtoupper($validated['address']) : null,
                ]
            );

            // Update Guardian if provided
            if (!empty($validated['guardian_name'])) {
                $student->guardian()->updateOrCreate(
                    ['student_id' => $student->id],
                    [
                        'name' => strtoupper($validated['guardian_name']),
                        'relation' => $validated['guardian_relation'] ?? 'Wali',
                        'education' => $request->input('guardian_education', 'SLTA / SEDERAJAT'),
                        'job' => strtoupper($validated['guardian_job'] ?? ''),
                        'phone' => $validated['guardian_phone'] ?? '',
                        'address' => !empty($validated['address']) ? strtoupper($validated['address']) : null,
                    ]
                );
            }

            // Update Education History
            if (!empty($validated['previous_school_name'])) {
                $student->educationHistory()->updateOrCreate(
                    ['student_id' => $student->id],
                    [
                        'previous_school_type' => $request->input('previous_school_type', 'SMP NEGERI'),
                        'school_name' => strtoupper($validated['previous_school_name']),
                        'certificate_number' => $validated['previous_school_certificate'] ?? null,
                        'certificate_date' => $request->input('previous_school_certificate_date', null),
                    ]
                );
            }

            // Update Health Record
            $activeYear = AcademicYear::where('is_active', true)->first();
            $activeSem = Semester::where('is_active', true)->first();

            // Update Health Records across semesters
            $activeYear = AcademicYear::where('is_active', true)->first();
            $activeSem = Semester::where('is_active', true)->first();

            if ($activeYear && $activeSem) {
                HealthRecord::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'academic_year_id' => $activeYear->id,
                        'semester_id' => $activeSem->id,
                    ],
                    [
                        'height' => (int) ($validated['height'] ?? $request->input('height_sem1', 155)),
                        'weight' => (int) ($validated['weight'] ?? $request->input('weight_sem1', 35)),
                        'medical_history' => $validated['medical_history'] ?? '-',
                        'special_condition' => $validated['special_condition'] ?? '-',
                    ]
                );
            }

            // Update Presensi & Kehadiran Siswa
            if ($activeYear && $activeSem && $student->current_class_id) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'academic_year_id' => $activeYear->id,
                        'semester_id' => $activeSem->id,
                    ],
                    [
                        'class_id' => $student->current_class_id,
                        'sick_days' => (int) $request->input('sick_days', 0),
                        'permitted_days' => (int) $request->input('permitted_days', 0),
                        'unexcused_days' => (int) $request->input('unexcused_days', 0),
                        'notes' => $request->input('attendance_notes', null),
                    ]
                );
            }

            // Update Nilai & Rapor Kurikulum Merdeka
            if ($activeYear && $activeSem && $student->current_class_id && $request->has('scores') && is_array($request->input('scores'))) {
                foreach ($request->input('scores') as $sc) {
                    if (!empty($sc['subject_id'])) {
                        StudentSubjectScore::updateOrCreate(
                            [
                                'student_id' => $student->id,
                                'subject_id' => $sc['subject_id'],
                                'academic_year_id' => $sc['academic_year_id'] ?? $activeYear->id,
                                'semester_id' => $sc['semester_id'] ?? $activeSem->id,
                            ],
                            [
                                'class_id' => $student->current_class_id,
                                'score' => (float) ($sc['score'] ?? 0),
                                'kktp' => (float) ($sc['kktp'] ?? 75),
                                'competency_achievement' => $sc['competency_achievement'] ?? null,
                            ]
                        );
                    }
                }
            }

            // Update Pejabat Sekolah & Wali Kelas
            if ($request->filled('principal_name')) {
                $school = SchoolProfile::first();
                if ($school) {
                    $school->update([
                        'principal_name' => $request->input('principal_name'),
                        'principal_nip' => $request->input('principal_nip', $school->principal_nip),
                    ]);
                }
            }

            if ($request->filled('wali_kelas_name') && $student->currentClass && $student->currentClass->waliKelas) {
                $student->currentClass->waliKelas->update([
                    'name' => $request->input('wali_kelas_name'),
                    'nip' => $request->input('wali_kelas_nip', $student->currentClass->waliKelas->nip),
                ]);
            }

            // Update Prestasi Tunggal
            if ($request->filled('achievement_name')) {
                Achievement::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'title' => $request->input('achievement_name'),
                    ],
                    [
                        'type' => $request->input('achievement_type', 'Akademik'),
                        'level' => $request->input('achievement_level', 'Sekolah'),
                        'year' => $request->input('achievement_year', date('Y')),
                        'organizer' => $request->input('achievement_organizer', 'Sekolah'),
                        'rank' => $request->input('achievement_rank', 'Juara I'),
                    ]
                );
            }

            // Update Ekstrakurikuler & Prestasi 6 Semester (Aspek D & E Rapor)
            $semKeys = ['x1', 'x2', 'xi1', 'xi2', 'xii1', 'xii2'];
            foreach ($semKeys as $sem) {
                if ($request->has("extras_{$sem}") && is_array($request->input("extras_{$sem}"))) {
                    foreach ($request->input("extras_{$sem}") as $extraItem) {
                        if (!empty($extraItem['name']) && $extraItem['name'] !== '-') {
                            $ext = Extracurricular::firstOrCreate(['name' => trim($extraItem['name'])]);
                            if ($activeYear && $activeSem) {
                                StudentExtracurricular::updateOrCreate(
                                    [
                                        'student_id' => $student->id,
                                        'extracurricular_id' => $ext->id,
                                        'academic_year_id' => $activeYear->id,
                                        'semester_id' => $activeSem->id,
                                    ],
                                    [
                                        'notes' => $extraItem['notes'] ?? '-',
                                        'score' => 'A',
                                    ]
                                );
                            }
                        }
                    }
                }

                if ($request->has("achievements_{$sem}") && is_array($request->input("achievements_{$sem}"))) {
                    foreach ($request->input("achievements_{$sem}") as $achItem) {
                        if (!empty($achItem['name']) && $achItem['name'] !== '-') {
                            Achievement::updateOrCreate(
                                [
                                    'student_id' => $student->id,
                                    'title' => trim($achItem['name']),
                                ],
                                [
                                    'type' => !empty($achItem['type']) && $achItem['type'] !== '-' ? $achItem['type'] : 'Akademik',
                                    'level' => !empty($achItem['level']) && $achItem['level'] !== '-' ? $achItem['level'] : 'Sekolah',
                                    'year' => !empty($achItem['year']) && $achItem['year'] !== '-' ? $achItem['year'] : date('Y'),
                                    'organizer' => !empty($achItem['organizer']) && $achItem['organizer'] !== '-' ? $achItem['organizer'] : 'Sekolah',
                                    'rank' => !empty($achItem['rank']) && $achItem['rank'] !== '-' ? $achItem['rank'] : 'Peserta',
                                ]
                            );
                        }
                    }
                }
            }

            // Update Kenaikan Kelas (Semester Genap Kelas X/XI)
            if ($request->filled('promotion_class') || $request->filled('promotion_status')) {
                if ($activeYear && $activeSem && $student->current_class_id) {
                    StudentClassHistory::updateOrCreate(
                        [
                            'student_id' => $student->id,
                            'academic_year_id' => $activeYear->id,
                            'semester_id' => $activeSem->id,
                            'class_id' => $student->current_class_id,
                        ],
                        [
                            'status' => $request->input('promotion_status') === 'Tidak Naik' ? 'Retained' : 'Promoted',
                            'promotion_status' => $request->input('promotion_status', 'Naik') . ' ke ' . $request->input('promotion_class', 'Kelas Berikutnya'),
                            'notes' => $request->input('promotion_date', null),
                        ]
                    );
                }
            }

            // Update Kelulusan Siswa (Semester Genap Kelas XII)
            if ($request->filled('graduation_cert_no') || $request->input('graduation_status') === 'LULUS') {
                Graduation::updateOrCreate(
                    [
                        'student_id' => $student->id,
                    ],
                    [
                        'graduation_year' => $request->input('graduation_year', date('Y')),
                        'certificate_number' => $request->input('graduation_cert_no'),
                        'notes' => $request->input('graduation_skhus_no'),
                    ]
                );
            }

            AuditLog::record('Memperbarui Lembar Buku Induk Siswa', $student, $oldData, $student->fresh()->toArray());

            DB::commit();

            if ($action === 'save_and_print') {
                return redirect()->to('/reports/buku-induk/' . $student->id . '?print=1')
                    ->with('success', 'Buku Induk berhasil diperbarui! Menyiapkan dokumen cetak A4...');
            }

            return redirect()->route('students.show', $student->id)->with('success', 'Data lembar buku induk berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }

    public function destroy(Student $student)
    {
        $user = Auth::user();
        if ($user->isWaliKelas() && $user->teacher) {
            $managed = SchoolClass::where('current_wali_kelas_id', $user->teacher->id)->first();
            if ($managed && $student->current_class_id && $student->current_class_id !== $managed->id) {
                return back()->with('error', 'Wali kelas hanya dapat menghapus data siswa di rombel kelas binaannya.');
            }
        }

        $old = $student->toArray();
        $student->delete();

        AuditLog::record('Menghapus Data Siswa (Soft Delete)', $student, $old, null);

        return redirect()->route('students.index')->with('success', 'Data siswa berhasil dihapus.');
    }
}
