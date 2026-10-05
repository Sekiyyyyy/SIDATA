import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Users, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Edit3, 
  Award, 
  Search, 
  Plus, 
  CalendarCheck
} from 'lucide-react';
import { SchoolClass, Student, SharedProps } from '@/Types';
import { cn } from '@/Utils/cn';

interface WaliKelasDashboardProps {
  managedClass: SchoolClass | null;
  students: Student[];
  stats: {
    total: number;
    male: number;
    female: number;
    incomplete: number;
    attendanceRate: string;
  };
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-';
  try {
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function WaliKelasDashboard({ managedClass, students, stats }: WaliKelasDashboardProps) {
  const { auth, school } = usePage<SharedProps>().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'complete' | 'incomplete'>('all');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn.includes(searchTerm) ||
        s.nis.includes(searchTerm);
      
      const completion = s.data_completion_percentage || 80;
      if (filterStatus === 'complete') return matchSearch && completion >= 100;
      if (filterStatus === 'incomplete') return matchSearch && completion < 100;
      return matchSearch;
    });
  }, [students, searchTerm, filterStatus]);

  const completedCount = stats.total - stats.incomplete;

  return (
    <AppLayout title={`Wali Kelas - ${managedClass?.name || 'Kelas Binaan'}`}>
      <Head title={`Wali Kelas - ${managedClass?.name || 'Kelas Binaan'}`} />

      <div className="space-y-6 pb-12">
        {/* Minimal Neumorphic Header Card */}
        <div className="neu-convex p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Ruang Kerja Wali Kelas
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black text-blue-600 dark:text-blue-400 neu-inset-sm">
                {managedClass?.name || 'Belum Ditugaskan'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {auth.user?.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {school?.name || 'SMK Negeri 1 Beringin'} • {managedClass?.major || 'PPLG'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/students/create"
              className="neu-btn-primary-tactile px-3.5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa</span>
            </Link>
            <Link
              href="/attendances"
              className="neu-btn-tactile px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Presensi</span>
            </Link>
            <Link
              href="/grades"
              className="neu-btn-tactile px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Nilai Rapor</span>
            </Link>
          </div>
        </div>

        {/* Minimal Neumorphic KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="neu-convex p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Total Siswa</span>
              <span className="w-7 h-7 rounded-lg neu-inset-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats.total}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">Siswa Aktif</span>
            </div>
          </div>

          <div className="neu-convex p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Komposisi Gender</span>
              <span className="w-7 h-7 rounded-lg neu-inset-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <UserCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats.male} <span className="text-xs text-slate-400 font-sans font-normal">L</span>
                <span className="text-slate-300 dark:text-slate-600 mx-1">/</span>
                {stats.female} <span className="text-xs text-slate-400 font-sans font-normal">P</span>
              </span>
            </div>
          </div>

          <div className="neu-convex p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Buku Induk Lengkap</span>
              <span className="w-7 h-7 rounded-lg neu-inset-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {completedCount}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">100% Siap Cetak</span>
            </div>
          </div>

          <div className="neu-convex p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Perlu Dilengkapi</span>
              <span className="w-7 h-7 rounded-lg neu-inset-sm flex items-center justify-center text-amber-500">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats.incomplete}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">&lt; 100% Data</span>
            </div>
          </div>
        </div>

        {/* Clean, Neat Student Ledger */}
        <div className="neu-convex p-4 sm:p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--neu-border)]">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Daftar Siswa Kelas {managedClass?.name || ''}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencatatan data Buku Induk dan cetak lembar arsip fisik A4.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama / NISN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="neu-field-slot pl-8 pr-3 py-2 text-xs w-full sm:w-52"
                />
              </div>

              <div className="neu-tab-track flex items-center p-1">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-bold transition",
                    filterStatus === 'all' 
                      ? "neu-tab-pill-active text-blue-600 dark:text-blue-400" 
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Semua ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('incomplete')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-bold transition",
                    filterStatus === 'incomplete' 
                      ? "neu-tab-pill-active text-amber-600 dark:text-amber-400" 
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Belum ({stats.incomplete})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('complete')}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-bold transition",
                    filterStatus === 'complete' 
                      ? "neu-tab-pill-active text-emerald-600 dark:text-emerald-400" 
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  Lengkap ({completedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Card List View (block md:hidden) */}
          <div className="md:hidden space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="neu-concave p-8 text-center text-slate-400 text-xs rounded-xl">
                Tidak ada data siswa ditemukan.
              </div>
            ) : (
              filteredStudents.map((s) => {
                const completion = s.data_completion_percentage || 80;
                const isComplete = completion >= 100;

                return (
                  <div 
                    key={s.id} 
                    className="neu-convex p-4 rounded-xl space-y-3 transition-transform active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded neu-inset-sm text-slate-700 dark:text-slate-300">
                            {s.gender === 'Laki-laki' ? 'L' : 'P'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            NISN: {s.nisn}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {s.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {s.birth_place ? `${s.birth_place}, ` : ''}{formatDate(s.birth_date)}
                        </p>
                      </div>

                      {/* Completion Badge */}
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider neu-inset-sm shrink-0",
                        isComplete 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        {isComplete ? '100% Lengkap' : `${completion}%`}
                      </span>
                    </div>

                    {/* Progress Bar Groove */}
                    <div className="space-y-1">
                      <div className="w-full h-2 neu-track overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            isComplete ? "bg-emerald-500" : "bg-amber-500"
                          )}
                          style={{ width: `${Math.min(100, completion)}%` }}
                        />
                      </div>
                    </div>

                    {/* Tactile Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={`/students/${s.id}`}
                        className="neu-btn-tactile inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Buka / Isi</span>
                      </Link>
                      <Link
                        href={`/reports/buku-induk/${s.id}?print=1`}
                        target="_blank"
                        className="neu-btn-primary-tactile inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white rounded-xl"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak A4</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--neu-border)] text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-3 py-3 w-10 text-center">No</th>
                  <th className="px-4 py-3 w-36">NISN / NIS</th>
                  <th className="px-4 py-3 min-w-[200px]">Nama Lengkap & TTL</th>
                  <th className="px-3 py-3 w-12 text-center">L/P</th>
                  <th className="px-4 py-3 w-40 text-center">Buku Induk</th>
                  <th className="px-4 py-3 w-44 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--neu-border)]">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                      Tidak ada data siswa ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => {
                    const completion = s.data_completion_percentage || 80;
                    const isComplete = completion >= 100;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                        <td className="px-3 py-3 text-center font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono">
                          <div className="font-bold text-slate-900 dark:text-white text-xs">{s.nisn}</div>
                          <div className="text-[11px] text-slate-400">{s.nis}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {s.birth_place ? `${s.birth_place}, ` : ''}{formatDate(s.birth_date)}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-slate-600 dark:text-slate-400">
                          {s.gender === 'Laki-laki' ? 'L' : 'P'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isComplete ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-600 dark:text-emerald-400 neu-inset-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              Lengkap (100%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-600 dark:text-amber-400 neu-inset-sm">
                              <AlertCircle className="w-3 h-3" />
                              {completion}% (Belum)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1-Click Print A4 */}
                            <Link
                              href={`/reports/buku-induk/${s.id}?print=1`}
                              target="_blank"
                              className="neu-btn-primary-tactile px-2.5 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1"
                              title="Cetak Lembar Buku Induk A4 (PDF)"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak A4</span>
                            </Link>

                            {/* Isi / Edit Lembar */}
                            <Link
                              href={`/students/${s.id}`}
                              className="neu-btn-tactile px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1"
                              title="Isi / Edit Lembar Buku Induk"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Isi</span>
                            </Link>

                            {/* Rapor */}
                            <Link
                              href={`/reports/rapor/${s.id}`}
                              className="neu-btn-tactile p-1.5 rounded-lg text-slate-500 hover:text-emerald-600"
                              title="Cetak Rapor"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
