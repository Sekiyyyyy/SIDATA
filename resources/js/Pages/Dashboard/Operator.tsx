import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Users, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  UserCheck, 
  Calendar, 
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { SchoolClass } from '@/Types';

interface OperatorDashboardProps {
  stats: {
    totalStudents: number;
    totalClasses: number;
    totalTeachers: number;
    unassignedStudents: number;
    incompleteStudents: number;
    activeYear: string;
    activeSemester: string;
  };
  classes: SchoolClass[];
}

export default function OperatorDashboard({ stats, classes }: OperatorDashboardProps) {
  return (
    <AppLayout title="Dashboard Operator Akademik">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Dashboard Operator Akademik
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Pengelolaan struktur kelas, rombel, penetapan wali kelas, dan proses kenaikan kelas
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-sm"
          >
            <UserCheck className="h-4 w-4" />
            <span>🔄 Pergantian Wali Kelas</span>
          </Link>
          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Proses Kenaikan Kelas</span>
          </Link>
          <Link
            href="/students/create"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
          >
            <Users className="h-4 w-4" />
            <span>+ Tambah Siswa Baru</span>
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Laporan & Cetak</span>
          </Link>
        </div>
      </div>

      {/* Operator KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Siswa Terdata</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {stats.totalStudents}
            </span>
            <span className="text-xs font-medium text-slate-400">Siswa</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            T.A. {stats.activeYear} ({stats.activeSemester})
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rombel & Wali Kelas</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {stats.totalClasses}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Rombel Aktif</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {stats.totalTeachers} Guru Siap Bertugas
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Belum Ada Rombel</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {stats.unassignedStudents}
            </span>
            <span className="text-xs font-semibold text-amber-600">Perlu Penempatan</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Siswa baru belum ditentukan kelas
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Data Belum Lengkap</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {stats.incompleteStudents}
            </span>
            <span className="text-xs font-semibold text-rose-600">Siswa (&lt;100%)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Perlu dilengkapi Wali Kelas
          </div>
        </div>
      </div>

      {/* Banner Rekomendasi Kenaikan Kelas */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-blue-200" />
            Modul Utama: Kenaikan Kelas Berkelanjutan
          </div>
          <h2 className="text-2xl font-bold font-display tracking-tight mb-2">
            Pertahankan Student Academic History Saat Siswa Naik Kelas
          </h2>
          <p className="text-xs text-blue-100 leading-relaxed mb-4">
            Sesuai aturan sistem, data kelas lama dan wali kelas sebelumnya tidak boleh dihapus. Sistem akan menutup catatan akademik periode lampau dan mencatat entri riwayat baru secara otomatis.
          </p>
          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-800 text-xs font-extrabold hover:bg-blue-50 transition shadow-md"
          >
            <span>Buka Wizard Kenaikan Kelas</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
          Daftar Rombongan Belajar (Kelas)
        </h3>
        <Link
          href="/classes"
          className="text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          Kelola Struktur Kelas ➔
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-extrabold dark:bg-blue-950 dark:text-blue-300">
                {c.grade_level} • {c.major}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {c.students?.length || 0} Siswa
              </span>
            </div>

            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white font-display mb-1">
              {c.name}
            </h4>

            <div className="text-xs text-slate-500 mb-4">
              Wali Kelas: <strong className="text-slate-800 dark:text-slate-200">{c.wali_kelas?.name || 'Belum Ditetapkan'}</strong>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/students?class_id=${c.id}`}
                className="flex-1 text-center py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition dark:bg-slate-800 dark:text-slate-200"
              >
                Lihat Siswa
              </Link>
              <Link
                href="/classes"
                className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition dark:bg-blue-950 dark:text-blue-300"
              >
                Atur Wali
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
