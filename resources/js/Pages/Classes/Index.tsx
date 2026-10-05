import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AcademicYear, SchoolClass, Teacher } from '@/Types';
import { 
  School, 
  Plus, 
  Users, 
  UserCheck, 
  Search, 
  Edit2, 
  ArrowRight, 
  X,
  Info
} from 'lucide-react';
import { cn } from '@/Utils/cn';

interface Props {
  classes: (SchoolClass & { students?: any[] })[];
  teachers: Teacher[];
  academicYears: AcademicYear[];
}

export default function ClassesIndex({ classes, teachers, academicYears }: Props) {
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'ALL' | 'X' | 'XI' | 'XII'>('ALL');
  
  // Modal State for New Class
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Modal State for Assigning Wali Kelas
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  // Form for New Class
  const createForm = useForm({
    academic_year_id: academicYears[0]?.id?.toString() || '',
    name: '',
    grade_level: 'X',
    major: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
    current_wali_kelas_id: '',
  });

  // Form for Updating Wali Kelas
  const editForm = useForm({
    name: '',
    current_wali_kelas_id: '',
  });

  const handleOpenEdit = (c: SchoolClass) => {
    setEditingClass(c);
    editForm.setData({
      name: c.name,
      current_wali_kelas_id: c.current_wali_kelas_id ? String(c.current_wali_kelas_id) : '',
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createForm.post('/classes', {
      onSuccess: () => {
        setShowCreateModal(false);
        createForm.reset();
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    editForm.put(`/classes/${editingClass.id}`, {
      onSuccess: () => {
        setEditingClass(null);
      },
    });
  };

  const filteredClasses = classes.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.major.toLowerCase().includes(search.toLowerCase()) ||
      (c.wali_kelas?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchGrade = selectedGrade === 'ALL' || c.grade_level === selectedGrade;
    return matchSearch && matchGrade;
  });

  return (
    <AppLayout title="Manajemen Kelas & Wali Kelas - SIDATA Siswa">
      <Head title="Manajemen Kelas & Wali Kelas - SIDATA Siswa" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <span>Administrasi Sekolah</span>
              <span>/</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">Data Kelas & Rombel</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 font-display">
              <div className="neu-icon-pill p-2 rounded-xl text-blue-500">
                <School className="w-5 h-5" />
              </div>
              <span>Rombongan Belajar & Penetapan Wali Kelas</span>
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Kelola rombel kelas SMK Negeri 1 Beringin dan tetapkan guru sebagai wali kelas aktif.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="neu-btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rombel Kelas</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="neu-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto select-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Tingkat:</span>
            {(['ALL', 'X', 'XI', 'XII'] as const).map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setSelectedGrade(grade)}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer',
                  selectedGrade === grade
                    ? 'neu-btn-primary shadow-sm'
                    : 'neu-btn text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {grade === 'ALL' ? 'Semua Tingkat' : `Kelas ${grade}`}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama kelas / wali..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="neu-input w-full pl-10 pr-3 py-2 text-xs font-semibold rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((item) => {
            const studentCount = item.students?.length ?? item.students_count ?? 0;

            return (
              <div
                key={item.id}
                className="neu-card p-5 rounded-3xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="neu-badge px-2.5 py-0.5 text-[10px] font-extrabold rounded-lg text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Tingkat {item.grade_level}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display mt-1.5">
                        {item.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 line-clamp-1">
                        {item.major}
                      </p>
                    </div>
                    <div className="neu-icon-pill p-2 rounded-xl text-slate-500 dark:text-slate-400 shrink-0">
                      <School className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>

                  {/* Inner Details Container */}
                  <div className="neu-inset-sm p-3.5 rounded-2xl space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Total Siswa:
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {studentCount} Siswa
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        Wali Kelas:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] text-right">
                        {item.wali_kelas?.name || (
                          <span className="text-rose-500 font-normal italic text-[11px]">Belum Ditetapkan</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Tahun Ajaran:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {item.academic_year?.name || '2024/2025'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--neu-border)] flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="neu-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Atur Wali</span>
                  </button>

                  <Link
                    href={`/students?class_id=${item.id}`}
                    className="neu-btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    <span>Lihat Siswa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Tambah Kelas */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="neu-card rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--neu-border)]">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-500" />
                  Tambah Rombel Kelas Baru
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="neu-icon-pill p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tahun Ajaran <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={createForm.data.academic_year_id}
                    onChange={(e) => createForm.setData('academic_year_id', e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs font-bold rounded-xl"
                  >
                    {academicYears.map((ay) => (
                      <option key={ay.id} value={ay.id}>
                        {ay.name} {ay.is_active ? '(Aktif)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tingkat <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={createForm.data.grade_level}
                      onChange={(e) => createForm.setData('grade_level', e.target.value as any)}
                      className="neu-input w-full px-3 py-2 text-xs font-bold rounded-xl"
                    >
                      <option value="X">Kelas X</option>
                      <option value="XI">Kelas XI</option>
                      <option value="XII">Kelas XII</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Rombel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: X PPLG 1"
                      value={createForm.data.name}
                      onChange={(e) => createForm.setData('name', e.target.value.toUpperCase())}
                      className="neu-input w-full px-3 py-2 text-xs font-bold rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kompetensi / Jurusan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={createForm.data.major}
                    onChange={(e) => createForm.setData('major', e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs font-semibold rounded-xl"
                  >
                    <option value="Pengembangan Perangkat Lunak dan Gim (PPLG)">Pengembangan Perangkat Lunak dan Gim (PPLG)</option>
                    <option value="Manajemen Perkantoran dan Layanan Bisnis (MPLB)">Manajemen Perkantoran dan Layanan Bisnis (MPLB)</option>
                    <option value="Akuntansi dan Keuangan Lembaga (AKL)">Akuntansi dan Keuangan Lembaga (AKL)</option>
                    <option value="Teknik Otomotif (TO)">Teknik Otomotif (TO)</option>
                    <option value="Teknik Jaringan Komputer dan Telekomunikasi (TJKT)">Teknik Jaringan Komputer dan Telekomunikasi (TJKT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Wali Kelas Awal (Opsional)
                  </label>
                  <select
                    value={createForm.data.current_wali_kelas_id}
                    onChange={(e) => createForm.setData('current_wali_kelas_id', e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs font-semibold rounded-xl"
                  >
                    <option value="">-- Belum Ditugaskan --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (NIP: {t.nip})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--neu-border)]">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="neu-btn px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createForm.processing}
                    className="neu-btn-primary px-4 py-2 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {createForm.processing ? 'Menyimpan...' : 'Simpan Rombel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit / Penetapan Wali Kelas */}
        {editingClass && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="neu-card rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--neu-border)]">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-500" />
                  Penetapan Wali Kelas: {editingClass.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="neu-icon-pill p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Rombel / Kelas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.data.name}
                    onChange={(e) => editForm.setData('name', e.target.value.toUpperCase())}
                    className="neu-input w-full px-3 py-2 text-xs font-bold rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tetapkan Wali Kelas Baru
                  </label>
                  <select
                    value={editForm.data.current_wali_kelas_id}
                    onChange={(e) => editForm.setData('current_wali_kelas_id', e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs font-semibold rounded-xl"
                  >
                    <option value="">-- Kosongkan / Lepas Wali Kelas --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (NIP: {t.nip})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="neu-inset-sm p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                  <div>
                    <p className="font-bold mb-0.5">Catatan Audit Perubahan:</p>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                      Setiap pergantian wali kelas tercatat otomatis dalam Audit Log sistem. Wali kelas baru akan otomatis menerima hak akses untuk data siswa rombel ini.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--neu-border)]">
                  <button
                    type="button"
                    onClick={() => setEditingClass(null)}
                    className="neu-btn px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={editForm.processing}
                    className="neu-btn-primary px-4 py-2 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {editForm.processing ? 'Menyimpan...' : 'Perbarui Wali Kelas'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
