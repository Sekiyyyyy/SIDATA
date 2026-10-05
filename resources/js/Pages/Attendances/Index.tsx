import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AcademicYear, SchoolClass, SchoolProfile, Semester, Student } from '@/Types';
import { 
  Printer, 
  Save, 
  Check, 
  Search, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface Props {
  classes: SchoolClass[];
  selectedClassId: string | null;
  selectedClass: SchoolClass | null;
  students: Student[];
  activeYear: AcademicYear | null;
  activeSem: Semester | null;
  school: SchoolProfile | null;
}

export default function AttendancesIndex({
  classes,
  selectedClassId,
  selectedClass,
  students,
  activeYear,
  activeSem,
  school,
}: Props) {
  const [classId, setClassId] = useState(selectedClassId || (classes[0]?.id ? String(classes[0].id) : ''));
  const [search, setSearch] = useState('');
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [savedRowId, setSavedRowId] = useState<number | null>(null);
  const [savingRowId, setSavingRowId] = useState<number | null>(null);

  // Editable attendance map
  const [attendanceData, setAttendanceData] = useState<
    Record<number, { sick: number; permitted: number; unexcused: number; notes: string }>
  >({});

  // Populate attendance data when students change
  useEffect(() => {
    if (students && students.length > 0) {
      const initial: Record<number, { sick: number; permitted: number; unexcused: number; notes: string }> = {};
      students.forEach((s) => {
        const att = s.attendances?.[0];
        initial[s.id] = {
          sick: att ? Number(att.sick_days) : 0,
          permitted: att ? Number(att.permitted_days) : 0,
          unexcused: att ? Number(att.unexcused_days) : 0,
          notes: att?.notes || '',
        };
      });
      setAttendanceData(initial);
    }
  }, [students]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setClassId(val);
    router.get('/attendances', { class_id: val }, { preserveState: false });
  };

  const handleInputChange = (
    studentId: number, 
    field: 'sick' | 'permitted' | 'unexcused' | 'notes', 
    value: string | number
  ) => {
    setAttendanceData((prev) => {
      const current = prev[studentId] || { sick: 0, permitted: 0, unexcused: 0, notes: '' };
      return {
        ...prev,
        [studentId]: {
          ...current,
          [field]: field === 'notes' ? value : Math.max(0, parseInt(value as string) || 0),
        },
      };
    });
  };

  const handleSaveSingleRow = (student: Student) => {
    if (!activeYear || !activeSem || !classId) return;
    setSavingRowId(student.id);

    const record = attendanceData[student.id] || { sick: 0, permitted: 0, unexcused: 0, notes: '' };

    router.post(
      '/attendances',
      {
        student_id: student.id,
        academic_year_id: activeYear.id,
        semester_id: activeSem.id,
        class_id: Number(classId),
        sick_days: Number(record.sick),
        permitted_days: Number(record.permitted),
        unexcused_days: Number(record.unexcused),
        notes: record.notes,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setSavedRowId(student.id);
          setTimeout(() => setSavedRowId(null), 2500);
        },
        onFinish: () => setSavingRowId(null),
      }
    );
  };

  const handleSaveAll = () => {
    if (!activeYear || !activeSem || !classId || students.length === 0) return;
    setIsSavingAll(true);

    const payload = students.map((s) => {
      const row = attendanceData[s.id] || { sick: 0, permitted: 0, unexcused: 0, notes: '' };
      return {
        student_id: s.id,
        sick_days: Number(row.sick),
        permitted_days: Number(row.permitted),
        unexcused_days: Number(row.unexcused),
        notes: row.notes || null,
      };
    });

    router.post(
      '/attendances',
      {
        academic_year_id: activeYear.id,
        semester_id: activeSem.id,
        class_id: Number(classId),
        attendances: payload,
      },
      {
        preserveScroll: true,
        onFinish: () => setIsSavingAll(false),
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.nis.includes(search) ||
        (s.nisn && s.nisn.includes(search))
    );
  }, [students, search]);

  // Totals for summary
  const totals = useMemo(() => {
    let totalSick = 0;
    let totalPermitted = 0;
    let totalUnexcused = 0;

    students.forEach((s) => {
      const row = attendanceData[s.id];
      if (row) {
        totalSick += Number(row.sick || 0);
        totalPermitted += Number(row.permitted || 0);
        totalUnexcused += Number(row.unexcused || 0);
      }
    });

    return {
      sick: totalSick,
      permitted: totalPermitted,
      unexcused: totalUnexcused,
      all: totalSick + totalPermitted + totalUnexcused,
    };
  }, [students, attendanceData]);

  const currentClassObj = selectedClass || classes.find((c) => String(c.id) === String(classId));
  const waliKelasName = currentClassObj?.wali_kelas?.name || 'Agusti Wardani, S.Pd.I';
  const waliKelasNip = currentClassObj?.wali_kelas?.nip || '19821214 201101 2005';
  const principalName = school?.principal_name || 'Hj. Hafrida Hanum, S.Pd, M.Pd';
  const principalNip = school?.principal_nip || '19680414 199403 2 009';

  return (
    <AppLayout>
      <Head title="Lembar Rekapitulasi Presensi & Kehadiran Siswa - SIDATA" />

      <div className="space-y-4">
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[var(--neu-bg)]/95 backdrop-blur-md rounded-2xl neu-flat print:hidden border border-slate-300/40 dark:border-slate-700/40">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <FileSpreadsheet className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Rombel:</span>
            </div>

            <select
              value={classId}
              onChange={handleClassChange}
              className="px-3 py-1.5 text-xs font-bold rounded-xl neu-inset border-none focus:outline-none text-slate-800 dark:text-slate-200"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.major})
                </option>
              ))}
            </select>

            <div className="relative w-40 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa di lembar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-xl neu-inset border-none focus:outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl neu-btn text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4</span>
            </button>

            <button
              type="button"
              disabled={isSavingAll}
              onClick={handleSaveAll}
              className="px-4 py-1.5 text-xs font-bold rounded-xl neu-btn-primary flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingAll ? 'Menyimpan Lembar...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </div>

        {/* Paper Sheet Ledger */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm p-6 sm:p-10 text-slate-900 dark:text-slate-100 font-sans print:p-0 print:border-none print:shadow-none print:max-w-full">
          {/* Authentic Document Header / Kop */}
          <div className="text-center border-b-2 border-double border-slate-900 dark:border-slate-200 pb-3 mb-4">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-700 dark:text-slate-300">
              PEMERINTAH PROVINSI SUMATERA UTARA • DINAS PENDIDIKAN
            </h3>
            <h4 className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
              CABANG DINAS PENDIDIKAN WILAYAH I
            </h4>
            <h1 className="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900 dark:text-white mt-0.5">
              {school?.name || 'SMK NEGERI 1 BERINGIN'}
            </h1>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {school?.address || 'Jl. Pendidikan No. 3'}, Kec. {school?.district || 'Beringin'}, Kab. {school?.regency || 'Deli Serdang'} - Prov. {school?.province || 'Sumatera Utara'}
            </p>
          </div>

          {/* Title of Document */}
          <div className="text-center my-3">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider underline">
              LEMBAR REKAPITULASI PRESENSI & KETIDAKHADIRAN SISWA
            </h2>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              Tahun Pelajaran: {activeYear?.name || '2024/2025'} • Semester: {activeSem?.type?.toUpperCase() || 'GANJIL'}
            </p>
          </div>

          {/* Metadata Block */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-4 py-2 border-y border-slate-300 dark:border-slate-700">
            <div className="space-y-1">
              <div className="grid grid-cols-[130px_10px_1fr]">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Rombongan Belajar</span>
                <span>:</span>
                <span className="font-bold uppercase text-slate-900 dark:text-white">{currentClassObj?.name || 'X PPLG 2'}</span>
              </div>
              <div className="grid grid-cols-[130px_10px_1fr]">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Program Keahlian</span>
                <span>:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentClassObj?.major || 'PPLG'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="grid grid-cols-[130px_10px_1fr]">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Wali Kelas</span>
                <span>:</span>
                <span className="font-bold text-slate-900 dark:text-white">{waliKelasName}</span>
              </div>
              <div className="grid grid-cols-[130px_10px_1fr]">
                <span className="text-slate-600 dark:text-slate-400 font-medium">NIP Wali Kelas</span>
                <span>:</span>
                <span className="font-mono text-slate-900 dark:text-white">{waliKelasNip}</span>
              </div>
            </div>
          </div>

          {/* Instructions note on sheet */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-2 print:hidden">
            * Isikan jumlah hari Sakit (S), Izin (I), dan Tanpa Keterangan / Alpa (A). Pengisian dapat dicicil per siswa atau disimpan sekaligus.
          </p>

          {/* Authentic Physical Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-900 dark:border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-b border-slate-900 dark:border-slate-300 text-center">
                  <th className="border border-slate-900 dark:border-slate-300 px-2 py-2 w-10">No</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-2 py-2 w-20">NIS</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-2 py-2 w-24">NISN</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-3 py-2 text-left">Nama Lengkap Murid</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-1 py-2 w-10">L/P</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-1 py-2 w-14 bg-amber-50/50 dark:bg-amber-950/20">S (Sakit)</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-1 py-2 w-14 bg-blue-50/50 dark:bg-blue-950/20">I (Izin)</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-1 py-2 w-14 bg-rose-50/50 dark:bg-rose-950/20">A (Alpa)</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-2 py-2 w-16">Total</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-3 py-2 text-left">Catatan Wali Kelas</th>
                  <th className="border border-slate-900 dark:border-slate-300 px-2 py-2 w-16 print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, idx) => {
                    const row = attendanceData[student.id] || { sick: 0, permitted: 0, unexcused: 0, notes: '' };
                    const totalStudent = Number(row.sick) + Number(row.permitted) + Number(row.unexcused);
                    const isRowSaved = savedRowId === student.id;
                    const isRowSaving = savingRowId === student.id;

                    return (
                      <tr 
                        key={student.id} 
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center font-medium">
                          {student.nomor_urut || idx + 1}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center font-mono font-semibold">
                          {student.nis}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {student.nisn || '-'}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 px-3 py-1 font-bold uppercase text-slate-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 px-1 py-1 text-center font-semibold">
                          {student.gender === 'Laki-laki' ? 'L' : 'P'}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-0 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.sick}
                            onChange={(e) => handleInputChange(student.id, 'sick', e.target.value)}
                            className="w-full h-8 text-center text-xs font-bold bg-transparent border-none focus:outline-none focus:bg-amber-100/50 dark:focus:bg-amber-900/30"
                          />
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-0 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.permitted}
                            onChange={(e) => handleInputChange(student.id, 'permitted', e.target.value)}
                            className="w-full h-8 text-center text-xs font-bold bg-transparent border-none focus:outline-none focus:bg-blue-100/50 dark:focus:bg-blue-900/30"
                          />
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-0 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.unexcused}
                            onChange={(e) => handleInputChange(student.id, 'unexcused', e.target.value)}
                            className="w-full h-8 text-center text-xs font-bold bg-transparent border-none focus:outline-none focus:bg-rose-100/50 dark:focus:bg-rose-900/30"
                          />
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center font-bold font-mono">
                          {totalStudent}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-1">
                          <input
                            type="text"
                            placeholder="Catatan..."
                            value={row.notes}
                            onChange={(e) => handleInputChange(student.id, 'notes', e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-transparent border-b border-dotted border-slate-400 dark:border-slate-600 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 placeholder:italic placeholder:text-slate-400"
                          />
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-1 text-center print:hidden">
                          <button
                            type="button"
                            disabled={isRowSaving}
                            onClick={() => handleSaveSingleRow(student)}
                            title="Simpan baris siswa ini"
                            className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                              isRowSaved
                                ? 'bg-emerald-700 text-white'
                                : 'bg-slate-800 text-white dark:bg-slate-700 hover:bg-slate-900'
                            }`}
                          >
                            {isRowSaving ? '...' : isRowSaved ? <Check className="w-3 h-3 inline" /> : 'Simpan'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-slate-500 italic">
                      Tidak ada data siswa ditemukan untuk kelas ini.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Summary Total Row */}
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-900 dark:border-slate-300">
                  <td colSpan={5} className="border border-slate-900 dark:border-slate-300 px-3 py-2 text-right uppercase">
                    Jumlah Total Ketidakhadiran Kelas ({students.length} Siswa):
                  </td>
                  <td className="border border-slate-900 dark:border-slate-300 px-1 py-2 text-center font-mono">
                    {totals.sick}
                  </td>
                  <td className="border border-slate-900 dark:border-slate-300 px-1 py-2 text-center font-mono">
                    {totals.permitted}
                  </td>
                  <td className="border border-slate-900 dark:border-slate-300 px-1 py-2 text-center font-mono">
                    {totals.unexcused}
                  </td>
                  <td className="border border-slate-900 dark:border-slate-300 px-1 py-2 text-center font-mono text-slate-900 dark:text-white">
                    {totals.all} Hari
                  </td>
                  <td className="border border-slate-900 dark:border-slate-300 px-3 py-2 text-slate-600 dark:text-slate-400 text-[11px]" colSpan={2}>
                    Rekapitulasi resmi kehadiran untuk buku induk dan rapor
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Signatures on Paper Sheet */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-center break-inside-avoid">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala SMK Negeri 1 Beringin</p>
              <div className="h-20 flex items-center justify-center">
                {/* Official Stamp space */}
              </div>
              <p className="font-bold underline uppercase">{principalName}</p>
              <p className="font-mono text-[11px]">NIP. {principalNip}</p>
            </div>

            <div>
              <p>
                Beringin,{' '}
                {new Date().toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="font-semibold">Wali Kelas {currentClassObj?.name || 'X PPLG 2'}</p>
              <div className="h-20 flex items-center justify-center">
                {/* Signature space */}
              </div>
              <p className="font-bold underline uppercase">{waliKelasName}</p>
              <p className="font-mono text-[11px]">NIP. {waliKelasNip}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
