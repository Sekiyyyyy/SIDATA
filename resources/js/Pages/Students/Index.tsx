import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Edit3, 
  Printer, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  School,
  BookOpen,
  Download,
  FileSpreadsheet,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { Student, SchoolClass, PaginatedResponse, SharedProps } from '@/Types';

interface StudentIndexProps {
  students: PaginatedResponse<Student>;
  classes: SchoolClass[];
  filters: {
    search?: string;
    class_id?: string;
    gender?: string;
    status?: string;
  };
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  try {
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function StudentIndex({ students, classes, filters }: StudentIndexProps) {
  const { auth } = usePage<SharedProps>().props;
  const [search, setSearch] = useState(filters.search || '');
  const [selectedClass, setSelectedClass] = useState(filters.class_id || '');
  const [selectedGender, setSelectedGender] = useState(filters.gender || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

  // Delete Confirmation Modal State
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Import Modal State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [targetClassId, setTargetClassId] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.get('/students', {
      search: search || undefined,
      class_id: selectedClass || undefined,
      gender: selectedGender || undefined,
      status: selectedStatus || undefined,
    }, { preserveState: true });
  };

  const handleReset = () => {
    setSearch('');
    setSelectedClass('');
    setSelectedGender('');
    setSelectedStatus('');
    router.get('/students');
  };

  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    router.delete(`/students/${studentToDelete.id}`, {
      onFinish: () => {
        setIsDeleting(false);
        setStudentToDelete(null);
      },
    });
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', importFile);
    if (targetClassId) {
      formData.append('target_class_id', targetClassId);
    }

    router.post('/students/import', formData, {
      forceFormData: true,
      onFinish: () => {
        setIsImporting(false);
        setIsImportOpen(false);
        setImportFile(null);
        setTargetClassId('');
      },
    });
  };

  return (
    <AppLayout title="Data Peserta Didik">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Data Peserta Didik
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Daftar lengkap buku induk dan arsip siswa SMKN 1 Beringin
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Unduh Template Excel */}
          <a
            href="/students/template"
            className="neu-btn-tactile inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
            title="Unduh format template Excel (.xlsx) resmi untuk import siswa"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Unduh Template</span>
            <span className="sm:hidden">Template</span>
          </a>

          {/* Export Excel (.xlsx) */}
          <a
            href={`/students/export?${new URLSearchParams(filters as any).toString()}`}
            className="neu-btn-tactile inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
            title="Ekspor seluruh data siswa aktif ke Microsoft Excel (.xlsx)"
          >
            <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Export</span>
          </a>

          {/* Import Siswa Excel */}
          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="neu-btn-tactile inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 cursor-pointer"
            title="Import data siswa secara massal dari berkas Excel (.xlsx)"
          >
            <UploadCloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Import Siswa</span>
          </button>

          {auth.user?.role !== 'wali_kelas' && (
            <Link
              href="/promotions"
              className="neu-btn-tactile inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Kenaikan Kelas</span>
            </Link>
          )}

          <Link
            href="/students/create"
            className="neu-btn-primary-tactile inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Siswa</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar (Fully Responsive Neumorphic Card) */}
      <div className="mb-6 p-3.5 sm:p-5 rounded-3xl neu-convex">
        <form onSubmit={handleFilter} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Nama, NISN, atau NIS..."
              className="neu-field-slot w-full pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Filters & Reset Action */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Filter Class */}
            <div className="col-span-1 lg:w-44 min-w-0">
              {auth.user?.role === 'wali_kelas' && classes.length > 0 ? (
                <div className="neu-field-slot w-full px-3 py-2.5 text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between gap-1 min-w-0">
                  <span className="truncate">{classes[0].name}</span>
                  <span className="text-[10px] neu-badge px-1.5 py-0.5 rounded-full shrink-0 font-extrabold text-blue-700 dark:text-blue-300">Kelas Anda</span>
                </div>
              ) : (
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    router.get('/students', { ...filters, class_id: e.target.value || undefined }, { preserveState: true });
                  }}
                  className="neu-field-slot w-full px-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white truncate"
                >
                  <option value="">Semua Rombel</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Filter Gender */}
            <div className="col-span-1 lg:w-36 min-w-0">
              <select
                value={selectedGender}
                onChange={(e) => {
                  setSelectedGender(e.target.value);
                  router.get('/students', { ...filters, gender: e.target.value || undefined }, { preserveState: true });
                }}
                className="neu-field-slot w-full px-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white truncate"
              >
                <option value="">Semua Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="col-span-1 lg:w-36 min-w-0">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  router.get('/students', { ...filters, status: e.target.value || undefined }, { preserveState: true });
                }}
                className="neu-field-slot w-full px-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white truncate"
              >
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Lulus">Lulus</option>
                <option value="Pindah">Pindah</option>
                <option value="Keluar">Keluar</option>
              </select>
            </div>

            {/* Reset Button (Guaranteed to NEVER overflow on any viewport) */}
            <div className="col-span-1 lg:w-auto shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="neu-btn-tactile w-full lg:w-auto h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer whitespace-nowrap"
                title="Reset Semua Filter"
              >
                <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Main Student Data Container (Card View on Mobile, Table on Desktop) */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
        {/* ============================================================== */}
        {/* MOBILE VIEW: RESPONSIVE NEUMORPHIC CARDS                       */}
        {/* ============================================================== */}
        <div className="md:hidden space-y-3.5 p-1">
          {students.data.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs px-4 neu-convex rounded-3xl">
              Tidak ada data siswa ditemukan untuk kriteria pencarian ini.
            </div>
          ) : (
            students.data.map((student) => (
              <div key={student.id} className="neu-convex p-4 sm:p-5 rounded-3xl space-y-3">
                {/* Header: Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="neu-badge text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-blue-700 dark:text-blue-300 truncate max-w-[140px]">
                      {student.current_class?.name || 'Belum Terdaftar'}
                    </span>
                    <span className="neu-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {student.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5 truncate">
                    {student.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    NISN: {student.nisn} • NIS: {student.nis}
                  </p>
                </div>

                {/* Progress bar in sunken groove */}
                <div className="flex items-center justify-between text-xs gap-3 pt-2 border-t border-[var(--neu-border)]">
                  <span className="text-[11px] text-slate-400 font-medium">Kelengkapan Data:</span>
                  <div className="flex items-center gap-2 flex-1 max-w-[130px]">
                    <div className="neu-track flex-1 rounded-full h-2 p-0.5">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${student.data_completion_percentage || 80}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 font-mono">
                      {student.data_completion_percentage || 80}%
                    </span>
                  </div>
                </div>

                {/* Mobile Action Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href={`/students/${student.id}`}
                    className="neu-btn-tactile inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span>Buku Induk</span>
                  </Link>

                  <a
                    href={`/reports/buku-induk/${student.id}?print=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neu-btn-tactile inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Cetak A4</span>
                  </a>

                  <Link
                    href={`/students/${student.id}/edit`}
                    className="neu-btn-tactile inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Biodata</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setStudentToDelete(student)}
                    className="neu-btn-danger-tactile inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus Siswa</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ============================================================== */}
        {/* DESKTOP VIEW: FULL 9-COLUMN DATA TABLE                         */}
        {/* ============================================================== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 dark:border-slate-800 dark:bg-slate-800/40 uppercase font-bold text-[11px]">
                <th className="py-3.5 px-3 pl-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 w-36">NISN / NIS</th>
                <th className="py-3.5 px-4 min-w-[200px]">Nama Lengkap</th>
                <th className="py-3.5 px-3 w-12 text-center">L/P</th>
                <th className="py-3.5 px-4 w-36">Rombel / Kelas</th>
                <th className="py-3.5 px-3 w-28 text-center">Status</th>
                <th className="py-3.5 px-4 w-36 text-center">Kelengkapan</th>
                <th className="py-3.5 px-4 text-right pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada data siswa ditemukan untuk kriteria pencarian ini.
                  </td>
                </tr>
              ) : (
                students.data.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-3 pl-4 text-center font-bold text-slate-400">
                      {students.from + idx}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{student.nisn}</div>
                      <div className="text-[11px] text-slate-400">{student.nis}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {student.birth_place ? `${student.birth_place}, ` : ''}{formatDate(student.birth_date)}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-600 dark:text-slate-300">
                      {student.gender === 'Laki-laki' ? 'L' : 'P'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-xs dark:bg-blue-950 dark:text-blue-300">
                        {student.current_class?.name || 'Belum Terdaftar'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 dark:bg-slate-800">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${student.data_completion_percentage || 80}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {student.data_completion_percentage || 80}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/students/${student.id}`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Lihat Detail Profil & Buku Induk"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/students/${student.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition"
                          title="Edit Biodata Siswa"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <a
                          href={`/reports/buku-induk/${student.id}?print=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
                          title="1-Klik Cetak / Unduh Lembar Buku Induk A4 (PDF)"
                        >
                          <BookOpen className="h-4 w-4" />
                        </a>
                        <Link
                          href={`/reports/rapor/${student.id}`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition"
                          title="Cetak Rapor Kurikulum Merdeka"
                        >
                          <Printer className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setStudentToDelete(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Responsive) */}
        {students.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <span className="text-xs text-slate-500 text-center sm:text-left">
              Menampilkan {students.from} sampai {students.to} dari {students.total} siswa
            </span>
            <div className="flex items-center gap-1">
              {students.current_page > 1 && (
                <Link
                  href={`/students?page=${students.current_page - 1}`}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              )}
              <span className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                {students.current_page} / {students.last_page}
              </span>
              {students.current_page < students.last_page && (
                <Link
                  href={`/students?page=${students.current_page + 1}`}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Siswa */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => !isDeleting && setStudentToDelete(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150 font-sans">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Hapus Data Peserta Didik?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data siswa ini? Seluruh data biodata, nilai rapor, dan buku induk akan diarsipkan (soft-delete).
                </p>

                <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
                  <p className="font-extrabold text-slate-900 dark:text-white uppercase truncate">
                    {studentToDelete.name}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    NISN: {studentToDelete.nisn} • NIS: {studentToDelete.nis}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Kelas: {studentToDelete.current_class?.name || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Data Siswa'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => !isImporting && setIsImportOpen(false)}
          />
          <div className="relative neu-convex rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150 font-sans border border-[var(--neu-border)] bg-[var(--neu-card)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--neu-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl neu-inset-sm text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Import Data Siswa (Excel)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Format berkas: .xlsx, .xls, atau .csv (Maks. 10MB)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isImporting && setIsImportOpen(false)}
                className="w-8 h-8 rounded-lg neu-inset-sm flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="mt-4 space-y-4">
              {/* Petunjuk & Unduh Template Banner */}
              <div className="neu-concave p-3.5 rounded-xl space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Pastikan kolom nama, NIS, dan NISN terisi. Jika siswa sudah ada, sistem akan <strong>memperbarui datanya</strong> secara otomatis tanpa menduplikasi.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-[var(--neu-border)]">
                  <span className="text-[11px] text-slate-400 font-medium">Belum punya template?</span>
                  <a
                    href="/students/template"
                    className="neu-btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Unduh Template .XLSX</span>
                  </a>
                </div>
              </div>

              {/* Target Class (optional for admin, fixed for wali kelas) */}
              {auth.user?.role !== 'wali_kelas' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Kelas / Rombel (Opsional)
                  </label>
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="neu-field-slot w-full px-3 py-2 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="">Sesuai Kolom Kelas di File Excel (Otomatis)</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.major}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Berkas Excel (*.xlsx)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImportFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="excel-file-input"
                  />
                  <label
                    htmlFor="excel-file-input"
                    className="neu-convex p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition"
                  >
                    {importFile ? (
                      <div className="flex items-center gap-3 text-left w-full">
                        <div className="w-10 h-10 rounded-xl neu-inset-sm text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {importFile.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {(importFile.size / 1024).toFixed(1)} KB • Klik untuk ganti berkas
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Klik untuk memilih berkas Excel (.xlsx)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Mendukung format Microsoft Excel .xlsx, .xls, atau .csv
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportOpen(false)}
                  disabled={isImporting}
                  className="neu-btn-tactile px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!importFile || isImporting}
                  className="neu-btn-primary-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isImporting ? 'Mengimpor Data...' : 'Mulai Proses Import'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
