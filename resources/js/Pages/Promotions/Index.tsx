import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AcademicYear, SchoolClass, Student, Teacher } from '@/Types';
import { 
  TrendingUp, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  History,
  Info,
  UserCheck,
  Check,
  X
} from 'lucide-react';

interface Props {
  academicYears: AcademicYear[];
  classes: SchoolClass[];
  teachers: Teacher[];
  selectedClassId: string | null;
  students: Student[];
}

type PromotionStatus = 'Naik Kelas' | 'Tidak Naik' | 'Lulus' | 'Pindah' | 'Keluar';

export default function PromotionsIndex({
  academicYears,
  classes,
  teachers,
  selectedClassId,
  students,
}: Props) {
  // Source Class
  const [sourceClassId, setSourceClassId] = useState(selectedClassId || '');

  // Target Settings
  const [targetYearId, setTargetYearId] = useState(academicYears[0]?.id?.toString() || '');
  const [targetSemesterId, setTargetSemesterId] = useState('');
  const [targetClassId, setTargetClassId] = useState('');
  const [newWaliId, setNewWaliId] = useState('');

  // Per-student status mapping
  const [studentStatuses, setStudentStatuses] = useState<Record<number, PromotionStatus>>({});
  const [studentNotes, setStudentNotes] = useState<Record<number, string>>({});

  // Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize all students to 'Naik Kelas'
  React.useEffect(() => {
    if (students && students.length > 0) {
      const initial: Record<number, PromotionStatus> = {};
      students.forEach((s) => {
        initial[s.id] = 'Naik Kelas';
      });
      setStudentStatuses(initial);
    }
  }, [students]);

  // When source class changes, reload page with class_id query
  const handleSourceClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSourceClassId(val);
    if (val) {
      router.get('/promotions', { class_id: val }, { preserveState: false });
    }
  };

  const selectedSourceClass = useMemo(() => {
    return classes.find((c) => c.id === Number(sourceClassId));
  }, [classes, sourceClassId]);

  const selectedTargetClass = useMemo(() => {
    return classes.find((c) => c.id === Number(targetClassId));
  }, [classes, targetClassId]);

  const selectedTargetYear = useMemo(() => {
    return academicYears.find((y) => y.id === Number(targetYearId));
  }, [academicYears, targetYearId]);

  const selectedNewWali = useMemo(() => {
    return teachers.find((t) => t.id === Number(newWaliId));
  }, [teachers, newWaliId]);

  // Set default semester for target year
  React.useEffect(() => {
    if (selectedTargetYear && (selectedTargetYear as any).semesters?.length > 0) {
      setTargetSemesterId((selectedTargetYear as any).semesters[0].id.toString());
    }
  }, [selectedTargetYear]);

  // Bulk status toggler
  const setAllStatus = (status: PromotionStatus) => {
    const updated: Record<number, PromotionStatus> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setStudentStatuses(updated);
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceClassId || !targetClassId || !targetYearId || !targetSemesterId) {
      alert('Lengkapi pemilihan kelas asal, kelas tujuan, dan tahun ajaran baru.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecutePromotion = () => {
    setIsSubmitting(true);

    const payload = {
      source_class_id: Number(sourceClassId),
      target_academic_year_id: Number(targetYearId),
      target_semester_id: Number(targetSemesterId),
      target_class_id: Number(targetClassId),
      new_wali_kelas_id: newWaliId ? Number(newWaliId) : null,
      promotions: students.map((s) => ({
        student_id: s.id,
        status: studentStatuses[s.id] || 'Naik Kelas',
        notes: studentNotes[s.id] || '',
      })),
    };

    router.post('/promotions/process', payload, {
      onFinish: () => {
        setIsSubmitting(false);
        setShowConfirmModal(false);
      },
    });
  };

  const stats = useMemo(() => {
    const naik = Object.values(studentStatuses).filter((s) => s === 'Naik Kelas').length;
    const tinggal = Object.values(studentStatuses).filter((s) => s === 'Tidak Naik').length;
    const lulus = Object.values(studentStatuses).filter((s) => s === 'Lulus').length;
    const lainnya = Object.values(studentStatuses).filter(
      (s) => s === 'Pindah' || s === 'Keluar'
    ).length;
    return { naik, tinggal, lulus, lainnya };
  }, [studentStatuses]);

  return (
    <AppLayout>
      <Head title="Kenaikan Kelas & Riwayat Akademik - SIDATA Siswa" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>Administrasi Operator</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Kenaikan Kelas</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Sistem Kenaikan Kelas & Mutasi Akademik
            </h1>
            <p className="text-sm text-slate-500">
              Proses kenaikan kelas berkonsep <strong>Student Academic History</strong>.
              Histori kelas lama diarsipkan dan tidak akan terhapus.
            </p>
          </div>
        </div>

        {/* Informative Security Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 space-y-1">
            <p className="font-bold text-sm">Prinsip Integritas Riwayat Siswa:</p>
            <p>
              Ketika Anda memproses kenaikan kelas, sistem akan menutup status keanggotaan kelas aktif sebelumnya dan menerbitkan baris baru pada tabel <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">student_class_histories</code>. Seluruh nilai rapor, presensi, dan histori wali kelas periode sebelumnya tetap utuh selamanya.
            </p>
          </div>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleOpenConfirm} className="space-y-6">
          {/* Step 1: Select Source & Target */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box 1: Kelas Asal */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="font-bold text-slate-900 text-sm">Pilih Kelas Asal (Sumber Data)</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rombel / Kelas Asal <span className="text-red-500">*</span>
                </label>
                <select
                  value={sourceClassId}
                  onChange={handleSourceClassChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="">-- Pilih Kelas Asal Siswa --</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.major} (Wali: {c.wali_kelas?.name || 'Belum Ada'})
                    </option>
                  ))}
                </select>
              </div>

              {selectedSourceClass && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-600">
                  <p><span className="font-semibold text-slate-800">Tingkat:</span> Kelas {selectedSourceClass.grade_level}</p>
                  <p><span className="font-semibold text-slate-800">Kompetensi Keahlian:</span> {selectedSourceClass.major}</p>
                  <p><span className="font-semibold text-slate-800">Wali Kelas Lama:</span> {selectedSourceClass.wali_kelas?.name || '-'}</p>
                  <p><span className="font-semibold text-slate-800">Total Siswa Aktif:</span> {students.length} Siswa</p>
                </div>
              )}
            </div>

            {/* Box 2: Target Kelas & Wali Kelas Baru */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="font-bold text-slate-900 text-sm">Tentukan Periode & Rombel Tujuan</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Ajaran Baru <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={targetYearId}
                    onChange={(e) => setTargetYearId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    {academicYears.map((ay) => (
                      <option key={ay.id} value={ay.id}>
                        {ay.name} {ay.is_active ? '(Aktif)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={targetSemesterId}
                    onChange={(e) => setTargetSemesterId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    {((selectedTargetYear as any)?.semesters || []).map((sem: any) => (
                      <option key={sem.id} value={sem.id}>
                        Semester {sem.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rombel / Kelas Tujuan <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="">-- Pilih Rombel Tujuan --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.major}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wali Kelas Baru (Opsional)
                  </label>
                  <select
                    value={newWaliId}
                    onChange={(e) => setNewWaliId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Pertahankan Wali Kelas --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (NIP: {t.nip})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedTargetClass && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1 text-blue-900">
                  <p><span className="font-semibold">Kelas Tujuan:</span> {selectedTargetClass.name} ({selectedTargetClass.major})</p>
                  <p><span className="font-semibold">Wali Kelas Terdaftar:</span> {selectedNewWali ? selectedNewWali.name : (selectedTargetClass.wali_kelas?.name || 'Belum Ada')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Student List Table */}
          {students.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Daftar Siswa Kelas {selectedSourceClass?.name} ({students.length} Siswa)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih status kelayakan untuk masing-masing siswa secara individual atau gunakan tombol cepat.
                  </p>
                </div>

                {/* Quick Toggle Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Terapkan Semua:</span>
                  <button
                    type="button"
                    onClick={() => setAllStatus('Naik Kelas')}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors"
                  >
                    Semua Naik
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllStatus('Tidak Naik')}
                    className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors"
                  >
                    Semua Tinggal
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllStatus('Lulus')}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    Semua Lulus
                  </button>
                </div>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                  <p className="text-xs font-medium text-emerald-700">Naik Kelas</p>
                  <p className="text-xl font-bold text-emerald-900 mt-0.5">{stats.naik}</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <p className="text-xs font-medium text-amber-700">Tidak Naik</p>
                  <p className="text-xl font-bold text-amber-900 mt-0.5">{stats.tinggal}</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-xs font-medium text-blue-700">Lulus</p>
                  <p className="text-xl font-bold text-blue-900 mt-0.5">{stats.lulus}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <p className="text-xs font-medium text-slate-700">Pindah / Keluar</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.lainnya}</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5 w-12 text-center">No</th>
                      <th className="px-3 py-2.5">NIS / NISN</th>
                      <th className="px-3 py-2.5">Nama Lengkap Siswa</th>
                      <th className="px-3 py-2.5 text-center">L/P</th>
                      <th className="px-3 py-2.5">Status Kenaikan</th>
                      <th className="px-3 py-2.5">Catatan Khusus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student, idx) => {
                      const currentStatus = studentStatuses[student.id] || 'Naik Kelas';

                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-3 text-center text-slate-500 font-medium">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-3 font-mono">
                            <span className="font-semibold text-slate-900">{student.nis}</span>
                            <span className="block text-[11px] text-slate-400">{student.nisn}</span>
                          </td>
                          <td className="px-3 py-3">
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{student.name}</p>
                              <p className="text-[10px] text-slate-500">{student.birth_place}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                student.gender === 'Laki-laki'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-pink-50 text-pink-700'
                              }`}
                            >
                              {student.gender === 'Laki-laki' ? 'L' : 'P'}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <select
                              value={currentStatus}
                              onChange={(e) => {
                                const val = e.target.value as PromotionStatus;
                                setStudentStatuses((prev) => ({
                                  ...prev,
                                  [student.id]: val,
                                }));
                              }}
                              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border focus:outline-none focus:ring-2 ${
                                currentStatus === 'Naik Kelas'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 focus:ring-emerald-500'
                                  : currentStatus === 'Tidak Naik'
                                  ? 'bg-amber-50 border-amber-300 text-amber-800 focus:ring-amber-500'
                                  : currentStatus === 'Lulus'
                                  ? 'bg-blue-50 border-blue-300 text-blue-800 focus:ring-blue-500'
                                  : 'bg-rose-50 border-rose-300 text-rose-800 focus:ring-rose-500'
                              }`}
                            >
                              <option value="Naik Kelas">Naik Kelas</option>
                              <option value="Tidak Naik">Tidak Naik (Tinggal)</option>
                              <option value="Lulus">Lulus</option>
                              <option value="Pindah">Pindah Sekolah</option>
                              <option value="Keluar">Keluar / Putus Sekolah</option>
                            </select>
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="text"
                              placeholder="Catatan rapat dewan guru..."
                              value={studentNotes[student.id] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStudentNotes((prev) => ({
                                  ...prev,
                                  [student.id]: val,
                                }));
                              }}
                              className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Submit Trigger */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Pastikan verifikasi dewan guru sudah tervalidasi sebelum melakukan eksekusi kenaikan kelas.</span>
                </div>

                <button
                  type="submit"
                  disabled={!targetClassId}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  <TrendingUp className="w-4 h-4" />
                  Lanjut ke Konfirmasi Kenaikan
                </button>
              </div>
            </div>
          ) : sourceClassId ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-700">Tidak ada siswa aktif di kelas ini</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Silakan pilih rombel lain atau periksa data siswa aktif pada menu Data Siswa.
              </p>
            </div>
          ) : null}
        </form>

        {/* MODAL KONFIRMASI KENAIKAN */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Konfirmasi Eksekusi Kenaikan Kelas</h3>
                  <p className="text-xs text-slate-500">Tindakan ini akan membuat riwayat akademik baru secara transaksional.</p>
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Kelas Asal:</span>
                    <span className="font-bold text-slate-900">{selectedSourceClass?.name} ({selectedSourceClass?.major})</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Wali Kelas Lama:</span>
                    <span className="font-semibold text-slate-800">{selectedSourceClass?.wali_kelas?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Kelas Tujuan Baru:</span>
                    <span className="font-bold text-blue-700">{selectedTargetClass?.name} ({selectedTargetClass?.major})</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Wali Kelas Baru:</span>
                    <span className="font-semibold text-slate-800">{selectedNewWali ? selectedNewWali.name : (selectedTargetClass?.wali_kelas?.name || '-')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">Total Siswa Diproses:</span>
                    <span className="font-bold text-slate-900">{students.length} Siswa</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-900 border border-emerald-200">
                    <p className="font-semibold text-[10px]">Naik Kelas</p>
                    <p className="font-bold text-base">{stats.naik}</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-900 border border-amber-200">
                    <p className="font-semibold text-[10px]">Tinggal Kelas</p>
                    <p className="font-bold text-base">{stats.tinggal}</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-900 border border-blue-200">
                    <p className="font-semibold text-[10px]">Lulus / Lainnya</p>
                    <p className="font-bold text-base">{stats.lulus + stats.lainnya}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic text-center">
                  Sistem menjamin data kelas lama tetap tersimpan sebagai arsip histori akademik siswa.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleExecutePromotion}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {isSubmitting ? 'Memproses Transaksi...' : 'Konfirmasi & Eksekusi Kenaikan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
