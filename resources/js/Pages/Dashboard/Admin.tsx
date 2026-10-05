import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Users, 
  GraduationCap, 
  Layers, 
  UserCheck, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight,
  FileSpreadsheet
} from 'lucide-react';
import { Student } from '@/Types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';

interface AdminDashboardProps {
  stats: {
    totalStudents: number;
    activeStudents: number;
    graduatedStudents: number;
    transferredStudents: number;
    totalTeachers: number;
    totalWaliKelas: number;
    totalClasses: number;
    male: number;
    female: number;
  };
  chartData: {
    studentsByClass: Array<{ name: string; count: number }>;
    gender: Array<{ name: string; value: number }>;
  };
  recentStudents: Student[];
}

const GENDER_COLORS = ['url(#blueGrad)', 'url(#pinkGrad)'];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="neu-card p-3 rounded-xl shadow-2xl border border-[var(--neu-border)] bg-[var(--neu-card)] text-xs backdrop-blur-md">
        <p className="font-extrabold text-slate-800 dark:text-white mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <span className="text-slate-500 dark:text-slate-400">Jumlah:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{payload[0].value} Siswa</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const isMale = String(payload[0].name).toLowerCase().includes('laki');
    return (
      <div className="neu-card p-3 rounded-xl shadow-2xl border border-[var(--neu-border)] bg-[var(--neu-card)] text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isMale
                ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                : 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]'
            }`}
          />
          <span className="font-bold text-slate-800 dark:text-white">{payload[0].name}:</span>
          <span className={`font-extrabold ${isMale ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}`}>
            {payload[0].value} Siswa
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard({ stats, chartData, recentStudents }: AdminDashboardProps) {
  return (
    <AppLayout title="Dashboard Administrator">
      {/* Page Title & Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Dashboard Sistem
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Pusat kendali konfigurasi, pengguna, dan ikhtisar data akademik sekolah
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/promotions"
            className="neu-btn-primary-tactile inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Kenaikan Kelas</span>
          </Link>
          <Link
            href="/classes"
            className="neu-btn-tactile inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kelola Kelas</span>
          </Link>
          <Link
            href="/audit-logs"
            className="neu-btn-tactile inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Audit Log</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="neu-convex p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Siswa</span>
            <div className="w-9 h-9 rounded-xl neu-inset-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {stats.totalStudents}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {stats.activeStudents} Aktif
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Lulus: {stats.graduatedStudents} • Pindah: {stats.transferredStudents}
          </div>
        </div>

        <div className="neu-convex p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Rombel / Kelas</span>
            <div className="w-9 h-9 rounded-xl neu-inset-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {stats.totalClasses}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kelas Aktif</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {stats.totalWaliKelas} dari {stats.totalClasses} memiliki Wali Kelas
          </div>
        </div>

        <div className="neu-convex p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tenaga Pengajar</span>
            <div className="w-9 h-9 rounded-xl neu-inset-sm flex items-center justify-center text-purple-600 dark:text-purple-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {stats.totalTeachers}
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Guru</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {stats.totalWaliKelas} bertugas sebagai Wali Kelas
          </div>
        </div>

        <div className="neu-convex p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Rasio Gender</span>
            <div className="w-9 h-9 rounded-xl neu-inset-sm flex items-center justify-center text-amber-500">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <div>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400">L:</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono ml-1">{stats.male}</span>
            </div>
            <div className="text-slate-300 dark:text-slate-600">/</div>
            <div>
              <span className="text-xs font-black text-pink-600 dark:text-pink-400">P:</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono ml-1">{stats.female}</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Proporsi siswa terdaftar
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Siswa per Kelas Bar Chart */}
        <div className="lg:col-span-2 neu-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                Distribusi Jumlah Siswa per Kelas
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Proporsi rombongan belajar aktif</p>
            </div>
            <span className="neu-badge px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-600 dark:text-blue-400">
              T.A. 2024/2025
            </span>
          </div>

          <div className="h-68 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.studentsByClass} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis 
                  dataKey="name" 
                  fontSize={11} 
                  stroke="#94a3b8" 
                  tickLine={false} 
                  axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }} 
                />
                <YAxis 
                  fontSize={11} 
                  stroke="#94a3b8" 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="url(#blueBarGrad)" 
                  radius={[8, 8, 0, 0]} 
                  name="Siswa" 
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Ratio Donut Chart */}
        <div className="neu-card p-6 rounded-3xl flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                Komposisi Gender
              </h3>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">Perbandingan Laki-laki & Perempuan</p>
          </div>

          <div className="relative h-48 w-full flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="pinkGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <Pie
                  data={chartData.gender}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="transparent"
                >
                  {chartData.gender.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Metric in Donut Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-display">
                {stats.totalStudents}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Siswa
              </span>
            </div>
          </div>

          <div className="neu-inset-sm p-3 rounded-2xl flex items-center justify-around text-xs mt-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Laki-laki</p>
                <p className="font-extrabold text-slate-900 dark:text-white">{stats.male} <span className="text-[10px] font-normal text-slate-400">({stats.totalStudents > 0 ? Math.round((stats.male / stats.totalStudents) * 100) : 0}%)</span></p>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700/60" />
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-linear-to-r from-pink-500 to-rose-400 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Perempuan</p>
                <p className="font-extrabold text-slate-900 dark:text-white">{stats.female} <span className="text-[10px] font-normal text-slate-400">({stats.totalStudents > 0 ? Math.round((stats.female / stats.totalStudents) * 100) : 0}%)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="neu-convex p-5 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--neu-border)]">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
            Siswa Terdaftar Terbaru
          </h3>
          <Link
            href="/students"
            className="neu-btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400"
          >
            <span>Semua Siswa</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile View: Clean list */}
        <div className="sm:hidden space-y-2.5">
          {recentStudents.map((s) => (
            <div 
              key={s.id} 
              className="neu-convex p-3.5 rounded-xl flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
            >
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {s.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {s.current_class?.name || '-'} • NIS: {s.nis}
                </p>
              </div>
              <Link
                href={`/students/${s.id}`}
                className="neu-btn-primary-tactile px-3 py-2 rounded-xl text-[11px] font-bold text-white shrink-0"
              >
                Buka
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800 uppercase font-semibold">
                <th className="pb-3 pl-1">NISN / NIS</th>
                <th className="pb-3">Nama Lengkap</th>
                <th className="pb-3">Kelas Saat Ini</th>
                <th className="pb-3">Kelengkapan Data</th>
                <th className="pb-3 text-right pr-1">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 pl-1 font-mono font-semibold">
                    <div>{s.nisn}</div>
                    <div className="text-[10px] text-slate-400">{s.nis}</div>
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="py-3">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[11px] dark:bg-blue-950 dark:text-blue-300">
                      {s.current_class?.name || 'Belum Terdaftar'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 dark:bg-slate-800">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${s.data_completion_percentage || 80}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        {s.data_completion_percentage || 80}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right pr-1">
                    <Link
                      href={`/students/${s.id}`}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition"
                    >
                      Buka Profil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
