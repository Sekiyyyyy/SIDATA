import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { SchoolClass, SchoolProfile, Student } from '@/Types';
import { 
  FileText, 
  Printer, 
  Download, 
  BookOpen, 
  Award, 
  Search, 
  Users, 
  School,
  ExternalLink 
} from 'lucide-react';

interface Props {
  classes: SchoolClass[];
  students: Student[];
  school: SchoolProfile | null;
}

export default function ReportsIndex({ classes, students, school }: Props) {
  const [search, setSearch] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [reportType, setReportType] = useState<'buku_induk' | 'rapor'>('buku_induk');

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.nisn.includes(search);
    const matchClass = !selectedClassId || s.current_class_id === Number(selectedClassId);
    return matchSearch && matchClass;
  });

  return (
    <AppLayout>
      <Head title="Pusat Laporan & Cetak Rapor Resmi - SIDATA Siswa" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>Administrasi & Pelaporan</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Pusat Cetak Laporan</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Pusat Cetak Dokumen & Buku Induk Resmi
            </h1>
            <p className="text-sm text-slate-500">
              Format cetak resmi standar A4 sesuai standar buku induk fisik {school?.name || 'SMK Negeri 1 Beringin'}.
            </p>
          </div>
        </div>

        {/* Dossier Information Card */}
        <div className="neu-convex p-5 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl neu-inset-sm text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-500/10 text-blue-700 dark:text-blue-300 uppercase tracking-wider neu-inset-sm">
                  Standar Dokumen Fisik Resmi
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">• 15 Halaman Kertas A4 Utuh Tanpa Ringkasan</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                Buku Induk Siswa & Rapor 6 Semester Lengkap (Semester 1 s.d. 6 + Rekap Halaman Terakhir)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Satu berkas lengkap dan berurutan sesuai kertas buku induk fisik asli: <strong>Lembar 1 (Identitas Lengkap Siswa & Ortu)</strong>, <strong>Lembar 2 (Jasmani 6 Semester, Prestasi & Beasiswa)</strong>, <strong>Rapor Semester 1 s/d 6 (Lengkap Lembar Depan Mapel/P5/Ekskul & Lembar Belakang Prestasi/Absensi/Kenaikan/Kelulusan)</strong>, serta <strong>Halaman Terakhir (Rekapitulasi Nilai Kumulatif 6 Semester Transkrip Master)</strong>. Sekali klik langsung mencetak seluruh berkas 15 halaman secara utuh.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="neu-convex p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Filter Rombel:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="neu-field-slot w-full sm:w-auto px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="">Semua Rombel Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.major}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama / NIS / NISN siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="neu-field-slot w-full pl-10 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table of Students with Direct Print Buttons */}
        <div className="neu-convex rounded-2xl overflow-hidden p-4 sm:p-5">
          <div className="pb-4 mb-4 border-b border-[var(--neu-border)] flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg neu-inset-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="w-4 h-4" />
              </span>
              Pilih Siswa untuk Dicetak ({filteredStudents.length} Siswa)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              Standar Kertas A4 Siap Cetak
            </span>
          </div>

          {/* Mobile Card List View (block md:hidden) - Individual Neumorphic Cards */}
          <div className="md:hidden space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="neu-concave p-8 text-center text-slate-400 text-xs rounded-xl">
                Tidak ada data siswa ditemukan untuk kriteria pencarian ini.
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="neu-convex p-4 rounded-xl space-y-3 transition-transform active:scale-[0.99]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-md neu-inset-sm text-blue-600 dark:text-blue-400 truncate max-w-[150px]">
                        {student.current_class?.name || '-'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 neu-inset-sm shrink-0">
                        {student.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2 truncate">
                      {student.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      NIS: {student.nis} • NISN: {student.nisn}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/students/${student.id}`}
                      className="neu-btn-tactile inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>Buka Berkas</span>
                    </Link>
                    <a
                      href={`/reports/buku-induk/${student.id}?print=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn-primary-tactile inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white rounded-xl"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak 15 Hal</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-600 dark:text-slate-400 font-bold border-b border-[var(--neu-border)]">
                <tr>
                  <th className="px-3 py-3 w-12 text-center">No</th>
                  <th className="px-3 py-3 w-32">NIS / NISN</th>
                  <th className="px-3 py-3">Nama Lengkap Siswa</th>
                  <th className="px-3 py-3">Kelas & Jurusan</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-3 py-3 text-right">Aksi Cetak Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--neu-border)]">
                {filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-3 py-3 font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">{student.nis}</span>
                      <span className="block text-[11px] text-slate-400">{student.nisn}</span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-extrabold text-slate-900 dark:text-white">{student.name}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{student.current_class?.name || '-'}</span>
                      <span className="block text-[11px] text-slate-500 truncate max-w-xs">{student.current_class?.major}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 neu-inset-sm">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/students/${student.id}`}
                          className="neu-btn-tactile inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Buka Berkas</span>
                        </Link>
                        <a
                          href={`/reports/buku-induk/${student.id}?print=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neu-btn-primary-tactile inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak 15 Hal A4</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
