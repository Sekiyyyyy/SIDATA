import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AcademicYear, SchoolClass, SchoolProfile, Semester, Student, Subject } from '@/Types';
import { 
  Printer, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  BookOpen, 
  UserCheck, 
  FileSpreadsheet,
  Check
} from 'lucide-react';

interface Props {
  classes: SchoolClass[];
  subjects: Subject[];
  selectedClassId: string | null;
  selectedClass: SchoolClass | null;
  students: Student[];
  selectedStudent: Student | null;
  selectedStudentId: string | null;
  activeYear: AcademicYear | null;
  activeSem: Semester | null;
  school: SchoolProfile | null;
}

export default function GradesIndex({
  classes,
  subjects,
  selectedClassId,
  selectedClass,
  students,
  selectedStudent,
  selectedStudentId,
  activeYear,
  activeSem,
  school,
}: Props) {
  const [classId, setClassId] = useState(selectedClassId || (classes[0]?.id ? String(classes[0].id) : ''));
  const [studentId, setStudentId] = useState(selectedStudentId || (students[0]?.id ? String(students[0].id) : ''));
  const [viewMode, setViewMode] = useState<'rapor' | 'matrix'>('rapor');
  const [matrixSubjectId, setMatrixSubjectId] = useState(subjects[0]?.id ? String(subjects[0].id) : '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Editable scores map by subject_id for the selected student
  const [scoresMap, setScoresMap] = useState<
    Record<number, { score: number; kktp: number; achievement: string }>
  >({});

  // Editable attendance for this student
  const [attendance, setAttendance] = useState({
    sick: 0,
    permitted: 0,
    unexcused: 0,
  });

  // Current student index in class
  const currentStudentIdx = useMemo(() => {
    return students.findIndex((s) => String(s.id) === String(studentId));
  }, [students, studentId]);

  // Active student object
  const currentStudent = selectedStudent || students.find((s) => String(s.id) === String(studentId)) || students[0];

  // Populate data when currentStudent or subjects change
  useEffect(() => {
    if (currentStudent && subjects.length > 0) {
      const initial: Record<number, { score: number; kktp: number; achievement: string }> = {};

      subjects.forEach((sub) => {
        const found = currentStudent.subject_scores?.find((sc) => sc.subject_id === sub.id);
        initial[sub.id] = {
          score: found ? Number(found.score) : sub.default_kktp + 5,
          kktp: found ? Number(found.kktp) : sub.default_kktp,
          achievement: found?.competency_achievement || 'Menunjukkan pemahaman yang baik dalam seluruh capaian kompetensi.',
        };
      });

      setScoresMap(initial);

      const att = currentStudent.attendances?.[0];
      setAttendance({
        sick: att ? Number(att.sick_days) : 0,
        permitted: att ? Number(att.permitted_days) : 0,
        unexcused: att ? Number(att.unexcused_days) : 0,
      });
    }
  }, [currentStudent, subjects]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setClassId(val);
    router.get('/grades', { class_id: val }, { preserveState: false });
  };

  const handleStudentChange = (newStudentId: string) => {
    setStudentId(newStudentId);
    router.get(
      '/grades',
      { class_id: classId, student_id: newStudentId },
      { preserveState: false, preserveScroll: true }
    );
  };

  const handlePrevStudent = () => {
    if (currentStudentIdx > 0) {
      const prev = students[currentStudentIdx - 1];
      handleStudentChange(String(prev.id));
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIdx < students.length - 1) {
      const next = students[currentStudentIdx + 1];
      handleStudentChange(String(next.id));
    }
  };

  const handleScoreChange = (subjectId: number, field: 'score' | 'kktp' | 'achievement', val: string | number) => {
    setScoresMap((prev) => {
      const cur = prev[subjectId] || { score: 75, kktp: 75, achievement: '' };
      return {
        ...prev,
        [subjectId]: {
          ...cur,
          [field]: field === 'achievement' ? val : Math.max(0, Math.min(100, parseFloat(val as string) || 0)),
        },
      };
    });
  };

  const handleSaveRapor = () => {
    if (!currentStudent || !activeYear || !activeSem || !classId) return;
    setIsSaving(true);

    const payloadScores = subjects.map((sub) => {
      const row = scoresMap[sub.id] || { score: sub.default_kktp, kktp: sub.default_kktp, achievement: '' };
      return {
        subject_id: sub.id,
        score: Number(row.score),
        kktp: Number(row.kktp),
        competency_achievement: row.achievement || null,
      };
    });

    router.post(
      '/grades',
      {
        student_id: currentStudent.id,
        academic_year_id: activeYear.id,
        semester_id: activeSem.id,
        class_id: Number(classId),
        scores: payloadScores,
        attendance: {
          sick_days: Number(attendance.sick),
          permitted_days: Number(attendance.permitted),
          unexcused_days: Number(attendance.unexcused),
        },
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2500);
        },
        onFinish: () => setIsSaving(false),
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Group subjects by category (Umum vs Kejuruan)
  const generalSubjects = useMemo(() => {
    return subjects.filter((s) => s.category === 'Umum' || s.category === 'Muatan Lokal');
  }, [subjects]);

  const vocationalSubjects = useMemo(() => {
    return subjects.filter((s) => s.category === 'Kejuruan' || s.category === 'Pilihan');
  }, [subjects]);

  // Calculations for total and average
  const { totalScore, avgScore } = useMemo(() => {
    let sum = 0;
    let count = 0;
    subjects.forEach((sub) => {
      const row = scoresMap[sub.id];
      if (row && typeof row.score === 'number' && !isNaN(row.score)) {
        sum += row.score;
        count++;
      }
    });

    return {
      totalScore: sum,
      avgScore: count > 0 ? (sum / count).toFixed(2) : '0.00',
    };
  }, [subjects, scoresMap]);

  const currentClassObj = selectedClass || classes.find((c) => String(c.id) === String(classId));
  const waliKelasName = currentClassObj?.wali_kelas?.name || 'Agusti Wardani, S.Pd.I';
  const waliKelasNip = currentClassObj?.wali_kelas?.nip || '19821214 201101 2005';
  const principalName = school?.principal_name || 'Hj. Hafrida Hanum, S.Pd, M.Pd';
  const principalNip = school?.principal_nip || '19680414 199403 2 009';

  return (
    <AppLayout>
      <Head title="Lembar Rapor Kurikulum Merdeka - SIDATA" />

      <div className="space-y-4">
        {/* Sticky Action Toolbar */}
        <div className="sticky top-2 z-20 p-3 sm:p-3.5 bg-[var(--neu-bg)]/95 backdrop-blur-md rounded-2xl neu-flat print:hidden border border-slate-300/40 dark:border-slate-700/40 shadow-sm space-y-2.5 md:space-y-0 md:flex md:items-center md:justify-between md:gap-3">
          {/* Controls: Class, Student, Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            {/* Row 1 on mobile: Rombel + Pagination */}
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Rombel:</span>
              </div>

              <select
                value={classId}
                onChange={handleClassChange}
                className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-xl neu-inset border-none focus:outline-none text-slate-800 dark:text-slate-200"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Prev / Next Student Pagination (visible in row 1 on mobile) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={currentStudentIdx <= 0}
                  onClick={handlePrevStudent}
                  title="Siswa Sebelumnya"
                  className="p-1.5 text-xs font-semibold rounded-lg neu-btn text-slate-700 dark:text-slate-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-500 px-1">
                  {currentStudentIdx + 1}/{students.length}
                </span>
                <button
                  type="button"
                  disabled={currentStudentIdx >= students.length - 1}
                  onClick={handleNextStudent}
                  title="Siswa Berikutnya"
                  className="p-1.5 text-xs font-semibold rounded-lg neu-btn text-slate-700 dark:text-slate-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Row 2 on mobile: Siswa dropdown */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 sm:ml-2">
                <UserCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Siswa:</span>
              </div>

              <select
                value={studentId}
                onChange={(e) => handleStudentChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold rounded-xl neu-inset border-none focus:outline-none text-slate-800 dark:text-slate-200 sm:max-w-[200px] truncate"
              >
                {students.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {idx + 1}. {s.name} ({s.nis})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 md:flex-none justify-center px-3.5 py-2 text-xs font-semibold rounded-xl neu-btn text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rapor A4</span>
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveRapor}
              className="flex-1 md:flex-none justify-center px-4 py-2 text-xs font-bold rounded-xl neu-btn-primary flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Menyimpan...' : isSaved ? 'Tersimpan!' : 'Simpan Nilai'}</span>
            </button>
          </div>
        </div>

        {/* Authentic Kurikulum Merdeka Rapor Paper Sheet */}
        {currentStudent ? (
          <div className="max-w-[210mm] mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm p-3.5 sm:p-8 md:p-10 text-slate-900 dark:text-slate-100 font-sans print:p-0 print:border-none print:shadow-none print:w-full space-y-4">
            {/* Header Document */}
            <div className="text-center border-b-2 border-double border-slate-900 dark:border-slate-200 pb-3">
              <h2 className="text-[10px] sm:text-xs uppercase font-semibold tracking-wider text-slate-700 dark:text-slate-300">
                PEMERINTAH PROVINSI SUMATERA UTARA • DINAS PENDIDIKAN
              </h2>
              <h1 className="text-sm sm:text-lg font-bold uppercase tracking-wide text-slate-900 dark:text-white mt-0.5">
                {school?.name || 'SMK NEGERI 1 BERINGIN'}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400">
                {school?.address || 'Jl. Pendidikan No. 3'}, Kec. {school?.district || 'Beringin'}, Kab. {school?.regency || 'Deli Serdang'} - Prov. {school?.province || 'Sumatera Utara'}
              </p>
              <div className="mt-2 inline-block px-2.5 sm:px-3 py-0.5 border border-slate-900 dark:border-slate-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR)
              </div>
            </div>

            {/* A. IDENTITAS PESERTA DIDIK */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-1">
                A. IDENTITAS PESERTA DIDIK
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-8 gap-y-1.5 text-xs py-1">
                {/* Kolom Kiri: Siswa & Sekolah */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-[120px_10px_1fr] sm:grid-cols-[130px_10px_1fr] items-baseline">
                    <span className="text-slate-600 dark:text-slate-400">Nama Peserta Didik</span>
                    <span>:</span>
                    <span className="font-bold uppercase text-slate-900 dark:text-white break-words">{currentStudent.name}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] sm:grid-cols-[130px_10px_1fr] items-baseline">
                    <span className="text-slate-600 dark:text-slate-400">Nomor Induk / NISN</span>
                    <span>:</span>
                    <span className="font-mono font-semibold break-words">{currentStudent.nis} / {currentStudent.nisn || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] sm:grid-cols-[130px_10px_1fr] items-baseline">
                    <span className="text-slate-600 dark:text-slate-400">Nama Sekolah</span>
                    <span>:</span>
                    <span className="break-words">{school?.name || 'SMKN 1 BERINGIN'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] sm:grid-cols-[130px_10px_1fr] items-baseline">
                    <span className="text-slate-600 dark:text-slate-400">Alamat Sekolah</span>
                    <span>:</span>
                    <span className="break-words">{school?.address || 'Jl. Pendidikan No. 3'}</span>
                  </div>
                </div>

                {/* Kolom Kanan: Rombel, Fase, Semester, T.A */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-[120px_10px_1fr] sm:grid-cols-[130px_10px_1fr] items-baseline">
                    <span className="text-slate-600 dark:text-slate-400">Kelas / Rombel</span>
                    <span>:</span>
                    <span className="font-bold text-slate-900 dark:text-white break-words">{currentClassObj?.name || 'X PPLG 2'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] sm:grid-cols-[130px_10px_1fr] items-baseline">
                    <span className="text-slate-600 dark:text-slate-400">Fase</span>
                    <span>:</span>
                    <span className="font-semibold">{currentClassObj?.grade_level === 'X' ? 'Fase E' : 'Fase F'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] sm:grid-cols-[130px_10px_1fr] items-baseline">
                    <span className="text-slate-600 dark:text-slate-400">Semester</span>
                    <span>:</span>
                    <span className="font-semibold">{activeSem?.type || 'Ganjil'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] sm:grid-cols-[130px_10px_1fr] items-baseline">
                    <span className="text-slate-600 dark:text-slate-400">Tahun Pelajaran</span>
                    <span>:</span>
                    <span>{activeYear?.name || '2024/2025'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* B. INTRAKURIKULER (NILAI AKHIR & CAPAIAN PEMBELAJARAN) */}
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                  B. INTRAKURIKULER (NILAI AKHIR & CAPAIAN PEMBELAJARAN)
                </h3>
                <span className="text-[11px] text-slate-500 italic print:hidden">
                  * Ketik nilai & capaian langsung pada tabel kertas.
                </span>
              </div>

              <div className="overflow-x-auto -mx-3.5 sm:mx-0 px-3.5 sm:px-0">
                <table className="w-full min-w-[620px] print:min-w-full border-collapse border border-slate-900 dark:border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-b border-slate-900 dark:border-slate-300 text-center">
                    <th className="border border-slate-900 dark:border-slate-300 px-2 py-2 w-10">No</th>
                    <th className="border border-slate-900 dark:border-slate-300 px-3 py-2 text-left">Mata Pelajaran</th>
                    <th className="border border-slate-900 dark:border-slate-300 px-2 py-2 w-16">KKTP</th>
                    <th className="border border-slate-900 dark:border-slate-300 px-2 py-2 w-20">Nilai Akhir</th>
                    <th className="border border-slate-900 dark:border-slate-300 px-3 py-2 text-left">
                      Capaian Kompetensi (Tujuan Pembelajaran)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Kelompok A: Mata Pelajaran Umum */}
                  <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold border-b border-slate-900 dark:border-slate-300">
                    <td colSpan={5} className="border border-slate-900 dark:border-slate-300 px-3 py-1.5 text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                      Kelompok A (Mata Pelajaran Umum)
                    </td>
                  </tr>
                  {generalSubjects.map((sub, idx) => {
                    const row = scoresMap[sub.id] || { score: sub.default_kktp, kktp: sub.default_kktp, achievement: '' };
                    const isBelowKktp = row.score < row.kktp;

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center font-medium">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 px-3 py-1 font-semibold text-slate-900 dark:text-white">
                          {sub.name}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-0 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.kktp}
                            onChange={(e) => handleScoreChange(sub.id, 'kktp', e.target.value)}
                            className="w-full h-8 text-center text-xs font-mono font-medium bg-transparent border-none focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800"
                          />
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-0 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.score}
                            onChange={(e) => handleScoreChange(sub.id, 'score', e.target.value)}
                            className={`w-full h-8 text-center text-xs font-mono font-bold bg-transparent border-none focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-950/30 ${
                              isBelowKktp ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-900 dark:text-white'
                            }`}
                          />
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-1">
                          <textarea
                            rows={1}
                            value={row.achievement}
                            onChange={(e) => handleScoreChange(sub.id, 'achievement', e.target.value)}
                            className="w-full px-2 py-1 text-[11px] leading-tight bg-transparent border-none resize-none focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800 rounded placeholder:italic placeholder:text-slate-400"
                            placeholder="Deskripsi capaian pembelajaran yang telah tercapai..."
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {/* Kelompok B: Kejuruan */}
                  <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold border-b border-slate-900 dark:border-slate-300">
                    <td colSpan={5} className="border border-slate-900 dark:border-slate-300 px-3 py-1.5 text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                      Kelompok B (Mata Pelajaran Kejuruan)
                    </td>
                  </tr>
                  {vocationalSubjects.map((sub, idx) => {
                    const row = scoresMap[sub.id] || { score: sub.default_kktp, kktp: sub.default_kktp, achievement: '' };
                    const isBelowKktp = row.score < row.kktp;

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center font-medium">
                          {generalSubjects.length + idx + 1}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 px-3 py-1 font-semibold text-slate-900 dark:text-white">
                          {sub.name}
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-0 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.kktp}
                            onChange={(e) => handleScoreChange(sub.id, 'kktp', e.target.value)}
                            className="w-full h-8 text-center text-xs font-mono font-medium bg-transparent border-none focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800"
                          />
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-0 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.score}
                            onChange={(e) => handleScoreChange(sub.id, 'score', e.target.value)}
                            className={`w-full h-8 text-center text-xs font-mono font-bold bg-transparent border-none focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-950/30 ${
                              isBelowKktp ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-900 dark:text-white'
                            }`}
                          />
                        </td>
                        <td className="border border-slate-900 dark:border-slate-300 p-1">
                          <textarea
                            rows={1}
                            value={row.achievement}
                            onChange={(e) => handleScoreChange(sub.id, 'achievement', e.target.value)}
                            className="w-full px-2 py-1 text-[11px] leading-tight bg-transparent border-none resize-none focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800 rounded placeholder:italic placeholder:text-slate-400"
                            placeholder="Deskripsi capaian pembelajaran..."
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Footer Sum & Average Rows (Faithful to Photo 2 & 4) */}
                <tfoot>
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-900 dark:border-slate-300">
                    <td colSpan={3} className="border border-slate-900 dark:border-slate-300 px-3 py-1.5 text-right uppercase">
                      Jumlah Nilai :
                    </td>
                    <td className="border border-slate-900 dark:border-slate-300 px-2 py-1.5 text-center font-mono text-sm font-extrabold">
                      {totalScore}
                    </td>
                    <td className="border border-slate-900 dark:border-slate-300 px-3 py-1.5 text-slate-500 text-[10px]">
                      Total akumulasi {subjects.length} mata pelajaran
                    </td>
                  </tr>
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                    <td colSpan={3} className="border border-slate-900 dark:border-slate-300 px-3 py-1.5 text-right uppercase">
                      Rata-rata Nilai :
                    </td>
                    <td className="border border-slate-900 dark:border-slate-300 px-2 py-1.5 text-center font-mono text-sm font-extrabold">
                      {avgScore}
                    </td>
                    <td className="border border-slate-900 dark:border-slate-300 px-3 py-1.5 text-slate-500 text-[10px]">
                      Rata-rata kompetensi Kurikulum Merdeka
                    </td>
                  </tr>
                </tfoot>
              </table>
              </div>
            </div>

            {/* C. EKSTRAKURIKULER & D. KETIDAKHADIRAN (Side by side on paper, stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 pt-2">
              {/* Ekstrakurikuler */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-1">
                  C. EKSTRAKURIKULER
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[320px] print:min-w-full border-collapse border border-slate-900 dark:border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-900 dark:border-slate-300">
                        <th className="border border-slate-900 dark:border-slate-300 px-2 py-1 w-8 text-center">No</th>
                        <th className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-left">Kegiatan</th>
                        <th className="border border-slate-900 dark:border-slate-300 px-2 py-1 w-16 text-center">Predikat</th>
                        <th className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-left">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center">1</td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 font-medium">Praja Muda Karana (Pramuka)</td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center font-bold">Baik</td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-[11px]">Aktif dan berdisiplin tinggi</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center">2</td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 font-medium">Palang Merah Remaja (PMR)</td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-center font-bold">Baik</td>
                        <td className="border border-slate-900 dark:border-slate-300 px-2 py-1 text-[11px]">Aktif dalam kegiatan UKS</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ketidakhadiran */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-1">
                  D. KETIDAKHADIRAN (PRESENSI)
                </h3>
                <table className="w-full border-collapse border border-slate-900 dark:border-slate-300 text-xs">
                  <tbody>
                    <tr>
                      <td className="border border-slate-900 dark:border-slate-300 px-3 py-1 font-medium">1. Sakit (S)</td>
                      <td className="border border-slate-900 dark:border-slate-300 p-0 w-24 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            value={attendance.sick}
                            onChange={(e) => setAttendance((prev) => ({ ...prev, sick: Math.max(0, parseInt(e.target.value) || 0) }))}
                            className="w-12 h-7 text-center font-bold bg-transparent border-none focus:outline-none"
                          />
                          <span className="text-[11px] text-slate-500 mr-2">hari</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-900 dark:border-slate-300 px-3 py-1 font-medium">2. Izin (I)</td>
                      <td className="border border-slate-900 dark:border-slate-300 p-0 w-24 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            value={attendance.permitted}
                            onChange={(e) => setAttendance((prev) => ({ ...prev, permitted: Math.max(0, parseInt(e.target.value) || 0) }))}
                            className="w-12 h-7 text-center font-bold bg-transparent border-none focus:outline-none"
                          />
                          <span className="text-[11px] text-slate-500 mr-2">hari</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-900 dark:border-slate-300 px-3 py-1 font-medium">3. Tanpa Keterangan (A)</td>
                      <td className="border border-slate-900 dark:border-slate-300 p-0 w-24 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            value={attendance.unexcused}
                            onChange={(e) => setAttendance((prev) => ({ ...prev, unexcused: Math.max(0, parseInt(e.target.value) || 0) }))}
                            className="w-12 h-7 text-center font-bold bg-transparent border-none focus:outline-none"
                          />
                          <span className="text-[11px] text-slate-500 mr-2">hari</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* E. KEPUTUSAN KENAIKAN KELAS / STATUS (Photo 5) */}
            <div className="p-3 border border-slate-900 dark:border-slate-300 text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider block">
                Keputusan Penetapan Hasil Belajar:
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                Berdasarkan hasil belajar dan pencapaian seluruh tujuan pembelajaran pada semester 1 dan semester 2, peserta didik ditetapkan:
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white uppercase pt-0.5">
                {activeSem?.type === 'Genap'
                  ? 'NAIK KE KELAS: XI PPLG 2 (SEBELAS)'
                  : 'DAPAT MELANJUTKAN KE SEMESTER GENAP TAHUN PELAJARAN ' + (activeYear?.name || '2024/2025')}
              </p>
            </div>

            {/* Tanda Tangan & Pengesahan (Paper Footer) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-6 sm:gap-4 pt-6 text-xs text-center break-inside-avoid">
              <div className="space-y-1">
                <p>Mengetahui,</p>
                <p className="font-semibold">Orang Tua / Wali Siswa</p>
                <div className="h-16 sm:h-20 flex items-center justify-center">
                  {/* Space for signature */}
                </div>
                <p className="font-bold underline uppercase">
                  {currentStudent.parents?.father_name || currentStudent.parents?.mother_name || '( ........................................ )'}
                </p>
              </div>

              <div className="space-y-1">
                <p>
                  Beringin,{' '}
                  {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="font-semibold">Wali Kelas</p>
                <div className="h-16 sm:h-20 flex items-center justify-center">
                  {/* Space for signature */}
                </div>
                <p className="font-bold underline uppercase">{waliKelasName}</p>
                <p className="font-mono text-[11px]">NIP. {waliKelasNip}</p>
              </div>

              <div className="space-y-1">
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala SMK Negeri 1 Beringin</p>
                <div className="h-16 sm:h-20 flex items-center justify-center">
                  {/* Space for stamp/signature */}
                </div>
                <p className="font-bold underline uppercase">{principalName}</p>
                <p className="font-mono text-[11px]">NIP. {principalNip}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-white">Tidak Ada Data Siswa</h3>
            <p className="text-xs text-slate-500 mt-1">
              Silakan pilih rombel lain untuk mengisi lembar nilai rapor siswa.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
