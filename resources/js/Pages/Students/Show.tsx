import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AcademicYear, SchoolClass, Semester, SharedProps, Student, Subject } from '@/Types';
import { cn } from '@/Utils/cn';
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  CheckCircle2, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
  X,
  User,
  Activity,
  Award,
  FileSpreadsheet,
  Home,
  Heart,
  GraduationCap,
  Calendar,
  Building2,
  Sparkles,
  Trophy
} from 'lucide-react';

interface StudentExtended extends Student {
  nomor_urut?: string;
  daily_language?: string;
  rt_rw?: string;
  step_siblings_count?: number;
  foster_siblings_count?: number;
  parents?: any;
  guardian?: any;
  education_history?: any;
  educationHistory?: any;
  health_records?: any[];
  healthRecords?: any[];
  class_histories?: any[];
  classHistories?: any[];
  subject_scores?: any[];
  subjectScores?: any[];
  attendances?: any[];
  student_extracurriculars?: any[];
  studentExtracurriculars?: any[];
  achievements?: any[];
  graduation?: any;
}

interface Props {
  student: StudentExtended;
  classes?: SchoolClass[];
  subjects?: Subject[];
  activeYear?: AcademicYear | null;
  activeSem?: Semester | null;
}

function formatIndoDate(dateStr?: string | null) {
  if (!dateStr) return '-';
  try {
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.substring(0, 10);
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr.toUpperCase();
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  } catch {
    return (dateStr || '-').toUpperCase();
  }
}

// Paper-styled editable dotted line row
function PaperDottedRow({
  label,
  value,
  onChange,
  sub = false,
  className = '',
  placeholder = '',
  disabled = false,
  labelWidth,
}: {
  label: string;
  value: string | number;
  onChange?: (val: string) => void;
  sub?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  labelWidth?: string;
}) {
  const widthClass = labelWidth || (sub ? 'pl-2 sm:pl-4 w-36 sm:w-52 shrink-0' : 'w-40 sm:w-56 shrink-0');
  return (
    <div className={`flex items-baseline text-[10.5px] leading-tight py-[2px] min-w-0 ${className}`}>
      <span className={`${widthClass} text-slate-900 font-serif`}>
        {label}
      </span>
      <span className="mx-1 shrink-0 font-serif">:</span>
      <input
        type="text"
        disabled={disabled}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="flex-1 min-w-0 font-semibold text-slate-950 uppercase font-mono text-[10.5px] border-b border-dotted border-slate-400 focus:border-black focus:bg-amber-50/40 px-1 py-0.5 outline-hidden transition bg-transparent"
      />
    </div>
  );
}

// Mobile-specific touch-friendly form components (Not restricted to paper layout)
function MobileInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  className = '',
}: {
  label: string;
  value: any;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        type={type}
        disabled={disabled}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="neu-field-slot w-full px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-50 transition"
      />
    </div>
  );
}

function MobileSelect({
  label,
  value,
  onChange,
  options,
  className = '',
}: {
  label: string;
  value: any;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="neu-field-slot w-full px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MobileCard({
  title,
  icon: Icon,
  children,
  badge,
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="neu-convex p-4 sm:p-5 space-y-3.5 transition-all">
      <div className="flex items-center justify-between border-b border-[var(--neu-border)] pb-2.5">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="neu-inset-sm p-1.5 rounded-xl text-blue-600 dark:text-blue-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wide">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="neu-badge text-[10px] font-black px-2.5 py-0.5 rounded-full text-blue-700 dark:text-blue-300">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// ==============================================================
// EDITABLE PAPER SECTIONS (ASPEK C, D, E)
// ==============================================================

function PaperP5Section({
  theme1,
  theme2,
  theme3,
  onTheme1Change,
  onTheme2Change,
  onTheme3Change,
  dimensions,
  onDimChange,
}: {
  theme1: string;
  theme2: string;
  theme3: string;
  onTheme1Change: (val: string) => void;
  onTheme2Change: (val: string) => void;
  onTheme3Change: (val: string) => void;
  dimensions: Array<{ no: string; dimensi: string; elemen: string; sub_elemen: string; target: string }>;
  onDimChange: (idx: number, field: 'elemen' | 'sub_elemen' | 'target', val: string) => void;
}) {
  return (
    <div className="mb-2">
      <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5 flex items-center justify-between">
        <span>C. PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5)</span>
        <span className="text-[8px] font-normal text-slate-500 italic print:hidden">(Dapat diedit langsung)</span>
      </div>
      <div className="text-[8.5px] mb-1 text-slate-800 flex flex-wrap gap-x-3 gap-y-1 items-center bg-slate-50/70 p-1 rounded border border-slate-200">
        <span className="flex items-center gap-1">
          <strong>Tema 1:</strong>
          <input
            type="text"
            value={theme1}
            onChange={(e) => onTheme1Change(e.target.value)}
            placeholder="Judul Tema 1..."
            className="border-b border-dotted px-1 py-0 text-[8.5px] w-48 font-medium bg-transparent focus:bg-amber-50"
          />
        </span>
        <span className="flex items-center gap-1">
          <strong>Tema 2:</strong>
          <input
            type="text"
            value={theme2}
            onChange={(e) => onTheme2Change(e.target.value)}
            placeholder="Judul Tema 2..."
            className="border-b border-dotted px-1 py-0 text-[8.5px] w-48 font-medium bg-transparent focus:bg-amber-50"
          />
        </span>
        <span className="flex items-center gap-1">
          <strong>Tema 3:</strong>
          <input
            type="text"
            value={theme3}
            onChange={(e) => onTheme3Change(e.target.value)}
            placeholder="Judul Tema 3..."
            className="border-b border-dotted px-1 py-0 text-[8.5px] w-48 font-medium bg-transparent focus:bg-amber-50"
          />
        </span>
      </div>
      <table className="w-full border border-slate-900 text-[8.5px] border-collapse">
        <thead>
          <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
            <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
            <th className="border-r border-slate-900 p-0.5 w-44 text-left">Dimensi</th>
            <th className="border-r border-slate-900 p-0.5 w-32 text-left">Elemen</th>
            <th className="border-r border-slate-900 p-0.5 text-left">Sub-Elemen</th>
            <th className="p-0.5 w-36">Target Fase/Pencapaian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900">
          {dimensions.map((dim, dIdx) => (
            <tr key={dIdx}>
              <td className="border-r border-slate-900 p-0.5 text-center">{dIdx + 1}.</td>
              <td className="border-r border-slate-900 p-0.5 font-medium">{dim.dimensi}</td>
              <td className="border-r border-slate-900 p-0.5">
                <input
                  type="text"
                  value={dim.elemen}
                  onChange={(e) => onDimChange(dIdx, 'elemen', e.target.value)}
                  placeholder="Elemen..."
                  className="w-full border-b border-dotted text-[8.5px] px-1 bg-transparent focus:bg-amber-50"
                />
              </td>
              <td className="border-r border-slate-900 p-0.5">
                <input
                  type="text"
                  value={dim.sub_elemen}
                  onChange={(e) => onDimChange(dIdx, 'sub_elemen', e.target.value)}
                  placeholder="Sub-elemen..."
                  className="w-full border-b border-dotted text-[8.5px] px-1 bg-transparent focus:bg-amber-50"
                />
              </td>
              <td className="p-0.5 text-center">
                <select
                  value={dim.target}
                  onChange={(e) => onDimChange(dIdx, 'target', e.target.value)}
                  className="w-full text-center text-[8.5px] font-semibold bg-transparent border-none cursor-pointer focus:bg-amber-50"
                >
                  <option value="-">-</option>
                  <option value="Mulai berkembang">Mulai berkembang</option>
                  <option value="Sedang berkembang">Sedang berkembang</option>
                  <option value="Berkembang Sesuai Harapan">Berkembang Sesuai Harapan</option>
                  <option value="Sangat Berkembang">Sangat Berkembang</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaperExtraSection({
  extras,
  onExtraChange,
}: {
  extras: Array<{ no: string; name: string; notes: string }>;
  onExtraChange: (idx: number, field: 'name' | 'notes', val: string) => void;
}) {
  return (
    <div className="mb-2">
      <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5 flex items-center justify-between">
        <span>D. EKSTRAKURIKULER</span>
        <span className="text-[8px] font-normal text-slate-500 italic print:hidden">(Dapat diedit langsung)</span>
      </div>
      <table className="w-full border border-slate-900 text-[9px] border-collapse">
        <thead>
          <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
            <th className="border-r border-slate-900 p-0.5 w-8">No.</th>
            <th className="border-r border-slate-900 p-0.5 w-64 text-left">Ekstrakurikuler</th>
            <th className="p-0.5 text-left">Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900">
          {extras.map((ext, eIdx) => (
            <tr key={eIdx}>
              <td className="border-r border-slate-900 p-0.5 text-center">{eIdx + 1}.</td>
              <td className="border-r border-slate-900 p-0.5">
                <input
                  type="text"
                  value={ext.name}
                  onChange={(e) => onExtraChange(eIdx, 'name', e.target.value)}
                  placeholder="Nama Ekstrakurikuler..."
                  className="w-full border-b border-dotted px-1 font-medium bg-transparent text-[9px] focus:bg-amber-50"
                />
              </td>
              <td className="p-0.5">
                <input
                  type="text"
                  value={ext.notes}
                  onChange={(e) => onExtraChange(eIdx, 'notes', e.target.value)}
                  placeholder="Keterangan capaian / predikat..."
                  className="w-full border-b border-dotted px-1 bg-transparent text-[9px] focus:bg-amber-50"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaperAchievementSection({
  achievements,
  onAchChange,
}: {
  achievements: Array<{ type: string; level: string; name: string; year: string; organizer: string; rank: string }>;
  onAchChange: (idx: number, field: string, val: string) => void;
}) {
  return (
    <div className="mb-3">
      <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1 flex items-center justify-between">
        <span>E. PRESTASI</span>
        <span className="text-[8.5px] font-normal text-slate-500 italic print:hidden">(Dapat diedit langsung)</span>
      </div>
      <table className="w-full border border-slate-900 text-[9.5px] border-collapse text-center">
        <thead>
          <tr className="border-b border-slate-900 bg-slate-100 font-bold">
            <th className="border-r border-slate-900 p-1 w-28">Jenis Prestasi</th>
            <th className="border-r border-slate-900 p-1 w-28">Tingkat Prestasi</th>
            <th className="border-r border-slate-900 p-1">Nama Prestasi</th>
            <th className="border-r border-slate-900 p-1 w-20">Tahun Prestasi</th>
            <th className="border-r border-slate-900 p-1 w-32">Penyelenggara</th>
            <th className="p-1 w-24">Peringkat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900">
          {achievements.map((ach, aIdx) => (
            <tr key={aIdx}>
              <td className="border-r border-slate-900 p-1">
                <input
                  type="text"
                  value={ach.type}
                  onChange={(e) => onAchChange(aIdx, 'type', e.target.value)}
                  placeholder="Akademik / Seni..."
                  className="w-full text-center border-b border-dotted px-1 bg-transparent text-[9px] focus:bg-amber-50"
                />
              </td>
              <td className="border-r border-slate-900 p-1">
                <input
                  type="text"
                  value={ach.level}
                  onChange={(e) => onAchChange(aIdx, 'level', e.target.value)}
                  placeholder="Sekolah / Kota..."
                  className="w-full text-center border-b border-dotted px-1 bg-transparent text-[9px] focus:bg-amber-50"
                />
              </td>
              <td className="border-r border-slate-900 p-1">
                <input
                  type="text"
                  value={ach.name}
                  onChange={(e) => onAchChange(aIdx, 'name', e.target.value)}
                  placeholder="Nama Prestasi..."
                  className="w-full text-center border-b border-dotted px-1 font-medium bg-transparent text-[9px] focus:bg-amber-50"
                />
              </td>
              <td className="border-r border-slate-900 p-1">
                <input
                  type="text"
                  value={ach.year}
                  onChange={(e) => onAchChange(aIdx, 'year', e.target.value)}
                  placeholder="Tahun..."
                  className="w-full text-center border-b border-dotted px-1 font-mono bg-transparent text-[9px] focus:bg-amber-50"
                />
              </td>
              <td className="border-r border-slate-900 p-1">
                <input
                  type="text"
                  value={ach.organizer}
                  onChange={(e) => onAchChange(aIdx, 'organizer', e.target.value)}
                  placeholder="Penyelenggara..."
                  className="w-full text-center border-b border-dotted px-1 bg-transparent text-[9px] focus:bg-amber-50"
                />
              </td>
              <td className="p-1">
                <input
                  type="text"
                  value={ach.rank}
                  onChange={(e) => onAchChange(aIdx, 'rank', e.target.value)}
                  placeholder="Peringkat..."
                  className="w-full text-center border-b border-dotted px-1 font-bold bg-transparent text-[9px] focus:bg-amber-50"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StudentShow({ 
  student, 
  classes = [],
  subjects = [],
  activeYear,
  activeSem,
}: Props) {
  const { auth, school } = usePage<SharedProps>().props;
  // Sesuai urutan foto asli: Rekap 6 Semester adalah HALAMAN TERAKHIR
  const sheetOrder: Array<{
    id: 'lembar1' | 'lembar2' | 'raporX1' | 'raporX2' | 'raporXI1' | 'raporXI2' | 'raporXII1' | 'raporXII2' | 'lembar3';
    label: string;
    shortLabel: string;
    num: number;
  }> = [
    { id: 'lembar1', label: '1. Biodata Siswa & Ortu (Lbr 1)', shortLabel: 'Lembar 1', num: 1 },
    { id: 'lembar2', label: '2. Jasmani 6 Smt & Beasiswa (Lbr 2)', shortLabel: 'Lembar 2', num: 2 },
    { id: 'raporX1', label: '3. Rapor X Smt 1 (Ganjil)', shortLabel: 'Rapor X1', num: 3 },
    { id: 'raporX2', label: '4. Rapor X Smt 2 (Naik XI)', shortLabel: 'Rapor X2', num: 4 },
    { id: 'raporXI1', label: '5. Rapor XI Smt 3 (Ganjil)', shortLabel: 'Rapor XI1', num: 5 },
    { id: 'raporXI2', label: '6. Rapor XI Smt 4 (Naik XII)', shortLabel: 'Rapor XI2', num: 6 },
    { id: 'raporXII1', label: '7. Rapor XII Smt 5 (PKL Industri)', shortLabel: 'Rapor XII1', num: 7 },
    { id: 'raporXII2', label: '8. Rapor XII Smt 6 (Kelulusan & Ijazah)', shortLabel: 'Rapor XII2', num: 8 },
    { id: 'lembar3', label: '9. Rekap Nilai 6 Smt (Halaman Terakhir)', shortLabel: 'Rekap 6 Smt', num: 9 },
  ];

  const [activeSheetTab, setActiveSheetTab] = useState<
    'all' | 'lembar1' | 'lembar2' | 'raporX1' | 'raporX2' | 'raporXI1' | 'raporXI2' | 'raporXII1' | 'raporXII2' | 'lembar3'
  >('lembar1');
  const [mobileTab, setMobileTab] = useState<'biodata' | 'jasmani' | 'rapor' | 'rekap'>('biodata');
  const [mobileRaporSem, setMobileRaporSem] = useState<'scores_x1' | 'scores_x2' | 'scores_xi1' | 'scores_xi2' | 'scores_xii1' | 'scores_xii2'>('scores_x1');
  const [parentSubTab, setParentSubTab] = useState<'ayah' | 'ibu'>('ayah');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Metadata mapping untuk setiap semester rapor pada tampilan mobile
  const semMetaMap: Record<
    'scores_x1' | 'scores_x2' | 'scores_xi1' | 'scores_xi2' | 'scores_xii1' | 'scores_xii2',
    {
      title: string;
      classKey: string;
      faseKey: string;
      tpKey: string;
      semKey: string;
      waliNameKey: string;
      waliNipKey: string;
      waliLabel: string;
    }
  > = {
    scores_x1: {
      title: 'Kelas X — Semester 1 (Ganjil)',
      classKey: 'class_x1',
      faseKey: 'fase_x1',
      tpKey: 'tahun_pelajaran_x1',
      semKey: 'semester_x1',
      waliNameKey: 'wali_x_name',
      waliNipKey: 'wali_x_nip',
      waliLabel: 'Wali Kelas X PPLG 2',
    },
    scores_x2: {
      title: 'Kelas X — Semester 2 (Genap & Kenaikan XI)',
      classKey: 'class_x2',
      faseKey: 'fase_x2',
      tpKey: 'tahun_pelajaran_x2',
      semKey: 'semester_x2',
      waliNameKey: 'wali_x_name',
      waliNipKey: 'wali_x_nip',
      waliLabel: 'Wali Kelas X PPLG 2',
    },
    scores_xi1: {
      title: 'Kelas XI — Semester 3 (Ganjil)',
      classKey: 'class_xi1',
      faseKey: 'fase_xi1',
      tpKey: 'tahun_pelajaran_xi1',
      semKey: 'semester_xi1',
      waliNameKey: 'wali_xi_name',
      waliNipKey: 'wali_xi_nip',
      waliLabel: 'Wali Kelas XI PPLG 2',
    },
    scores_xi2: {
      title: 'Kelas XI — Semester 4 (Genap & Kenaikan XII)',
      classKey: 'class_xi2',
      faseKey: 'fase_xi2',
      tpKey: 'tahun_pelajaran_xi2',
      semKey: 'semester_xi2',
      waliNameKey: 'wali_xi_name',
      waliNipKey: 'wali_xi_nip',
      waliLabel: 'Wali Kelas XI PPLG 2',
    },
    scores_xii1: {
      title: 'Kelas XII — Semester 5 (Ganjil - PKL Industri)',
      classKey: 'class_xii1',
      faseKey: 'fase_xii1',
      tpKey: 'tahun_pelajaran_xii1',
      semKey: 'semester_xii1',
      waliNameKey: 'wali_xii_name',
      waliNipKey: 'wali_xii_nip',
      waliLabel: 'Wali Kelas XII PPLG 2',
    },
    scores_xii2: {
      title: 'Kelas XII — Semester 6 (Genap & Kelulusan Akhir)',
      classKey: 'class_xii2',
      faseKey: 'fase_xii2',
      tpKey: 'tahun_pelajaran_xii2',
      semKey: 'semester_xii2',
      waliNameKey: 'wali_xii_name',
      waliNipKey: 'wali_xii_nip',
      waliLabel: 'Wali Kelas XII PPLG 2',
    },
  };

  const currentSemMeta = semMetaMap[mobileRaporSem];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteStudent = () => {
    setIsDeleting(true);
    router.delete(`/students/${student.id}`, {
      onFinish: () => setIsDeleting(false),
    });
  };

  const currentIndex = sheetOrder.findIndex((s) => s.id === activeSheetTab);

  const handlePrevSheet = () => {
    if (activeSheetTab === 'all') {
      setActiveSheetTab('lembar3');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentIndex > 0) {
      setActiveSheetTab(sheetOrder[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextSheet = () => {
    if (activeSheetTab === 'all') {
      setActiveSheetTab('lembar1');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentIndex < sheetOrder.length - 1) {
      setActiveSheetTab(sheetOrder[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Normalize relations
  const parentData = Array.isArray(student.parents) ? student.parents[0] : (student.parents || {});
  const guardianData = student.guardian || {};
  const eduData = student.education_history || student.educationHistory || {};
  const healthList = student.health_records || student.healthRecords || [];
  const healthData = Array.isArray(healthList) && healthList.length > 0 ? healthList[0] : {};
  const classHistories = student.class_histories || student.classHistories || [];

  // Wali kelas per grade level dari riwayat atau default foto asli
  const historyX = classHistories.find((h: any) => h.school_class?.grade_level === 'X' || h.promotion_status?.includes('XI') || h.academic_year?.name?.includes('2023'));
  const historyXI = classHistories.find((h: any) => h.school_class?.grade_level === 'XI' || h.promotion_status?.includes('XII') || h.academic_year?.name?.includes('2024'));
  const historyXII = classHistories.find((h: any) => h.school_class?.grade_level === 'XII' || h.academic_year?.name?.includes('2025'));

  const cleanBirthDate = student.birth_date 
    ? (student.birth_date.includes('T') ? student.birth_date.split('T')[0] : student.birth_date.substring(0, 10)) 
    : '';

  const isSampleStudent = Boolean(
    student.id === 1 && (student.nis === '28354' || (student.name && student.name.toUpperCase().includes('ADITYA')))
  );

  const rawScoresX1 = [
    { no: '1.', name: 'Pendidikan Agama dan Budi Pekerti*', score: isSampleStudent ? 83 : '', comp: isSampleStudent ? "Syu'abul iman, implementasi fikih muamalah" : '', kktp: isSampleStudent ? 75 : '' },
    { no: '2.', name: 'Pendidikan Pancasila', score: isSampleStudent ? 82 : '', comp: isSampleStudent ? 'Penerapan nilai-nilai pancasila dalam masyarakat' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '3.', name: 'Bahasa Indonesia', score: isSampleStudent ? 80 : '', comp: isSampleStudent ? 'Teks laporan, teks anekdot, dan hikayat' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '4.', name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', score: isSampleStudent ? 73 : '', comp: isSampleStudent ? 'Bola voli, bulu tangkis, sepak bola, basket, dan atletik' : '', kktp: isSampleStudent ? 70 : '' },
    { no: '5.', name: 'Sejarah', score: isSampleStudent ? 78 : '', comp: isSampleStudent ? 'Ilmu Sejarah dan Kerajaan Hindu Budha' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '6.', name: 'Seni Budaya**: a. Seni Musik', score: isSampleStudent ? 85 : '', comp: isSampleStudent ? 'Tehnik permainan alat musik dan karya musik' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '7.', name: 'Muatan Lokal**: a. Conversation', score: isSampleStudent ? 85 : '', comp: isSampleStudent ? 'Berkomunikasi dengan menggunakan teks naratif' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '1.', name: 'Matematika', score: isSampleStudent ? 80 : '', comp: isSampleStudent ? 'Barisan aritmatika, persamaan linear dan bentuk akar' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '2.', name: 'Bahasa Inggris', score: isSampleStudent ? 83 : '', comp: isSampleStudent ? 'Teks deskriptif, recount, dan procedure' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '3.', name: 'Informatika', score: isSampleStudent ? 89 : '', comp: isSampleStudent ? 'Algoritma dan penggunaan aplikasi perkantoran' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '4.', name: 'Projek Ilmu Pengetahuan Alam dan Sosial****', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Perubahan fisika, kimia, dan biologi dan dinamika sosial' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '5.', name: 'Dasar-dasar Program Keahlian: a. Dasar-dasar PPLG', score: isSampleStudent ? 87 : '', comp: isSampleStudent ? 'Konsep dasar perangkat lunak dan gim serta budaya kerja' : '', kktp: isSampleStudent ? 75 : '' },
  ];

  const rawScoresX2 = [
    { no: '1.', name: 'Pendidikan Agama dan Budi Pekerti*', score: isSampleStudent ? 87 : '', comp: isSampleStudent ? 'Menganalisis cabang iman dan tawakal kepadanya dengan pengamalan baik' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '2.', name: 'Pendidikan Pancasila', score: isSampleStudent ? 86 : '', comp: isSampleStudent ? 'Memahami kolaborasi budaya yang ada di Indonesia dalam persatuan bangsa' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '3.', name: 'Bahasa Indonesia', score: isSampleStudent ? 82 : '', comp: isSampleStudent ? 'Menulis teks negosiasi, biografi, dan teks puisi dengan kaidah bahasa tepat' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '4.', name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', score: isSampleStudent ? 80 : '', comp: isSampleStudent ? 'Mempraktikkan aktivitas jasmani untuk kesehatan dan kebugaran tubuh' : '', kktp: isSampleStudent ? 70 : '' },
    { no: '5.', name: 'Sejarah', score: isSampleStudent ? 81 : '', comp: isSampleStudent ? 'Menganalisis kerajaan Islam dalam ruang lingkup global dan pengaruhnya' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '6.', name: 'Seni Budaya**: a. Seni Musik', score: isSampleStudent ? 95 : '', comp: isSampleStudent ? 'Mengorganisasi pementasan seni dalam kepanitiaan secara bertanggung jawab' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '7.', name: 'Muatan Lokal**: a. Conversation', score: isSampleStudent ? 81 : '', comp: isSampleStudent ? 'Berinteraksi dengan lancar dan memahami pantun serta majas sastra daerah' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '1.', name: 'Matematika', score: isSampleStudent ? 81 : '', comp: isSampleStudent ? 'Menentukan mean, median, dan modus pada data serta peluang kejadian' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '2.', name: 'Bahasa Inggris', score: isSampleStudent ? 86 : '', comp: isSampleStudent ? 'Mempresentasikan teks prosedur dan teks narasi dengan pelafalan jelas' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '3.', name: 'Informatika', score: isSampleStudent ? 92 : '', comp: isSampleStudent ? 'Merancang program komputer sederhana sebagai solusi persoalan sehari-hari' : '', kktp: isSampleStudent ? 75 : '' },
    { no: '4.', name: 'Projek Ilmu Pengetahuan Alam dan Sosial****', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Mempresentasikan fenomena tata surya dan interaksi sosial dengan media' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '5.', name: 'Dasar-dasar Program Keahlian: a. Dasar-dasar PPLG', score: isSampleStudent ? 90 : '', comp: isSampleStudent ? 'Melakukan pemrograman terstruktur perangkat lunak dan gim secara mandiri' : '', kktp: isSampleStudent ? 75 : '' },
  ];

  const rawScoresXi1 = [
    { no: '1.', name: 'Pendidikan Agama dan Budi Pekerti*', score: isSampleStudent ? 88 : '', comp: isSampleStudent ? 'Menjelaskan hukum rukun ilmu kalam, khusur makna dakwah/khutbah/tablig' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '2.', name: 'Pendidikan Pancasila', score: isSampleStudent ? 85 : '', comp: isSampleStudent ? 'Menjelaskan tentang akar sejarah konstitusi RI dan penerapan nilai-nilai Pancasila' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '3.', name: 'Bahasa Indonesia', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Memahami teks argumentasi, teks berita dan teks cerpen' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '4.', name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', score: isSampleStudent ? 85 : '', comp: isSampleStudent ? 'Mempraktikkan latihan kebugaran jasmani dan keterampilan gerak' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '5.', name: 'Sejarah', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Menganalisis teks proklamasi dan tokoh-tokoh proklamasi' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '6.', name: 'Muatan Lokal**: a. Conversation', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Berkomunikasi bahasa asing terapan industri dengan percaya diri' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '1.', name: 'Matematika', score: isSampleStudent ? 81 : '', comp: isSampleStudent ? 'Menjelaskan konsep notasi dan elemen matriks, fungsi komposisi fungsi invers' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '2.', name: 'Bahasa Inggris', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Mempresentasikan teks deskriptif, teks analytical exposition dan teks prosedur' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '3.', name: 'Mata Pelajaran (Konsentrasi Keahlian)***', score: isSampleStudent ? 83 : '', comp: isSampleStudent ? 'Membuat website dan pemahaman konsep dasar CSS' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '4.', name: 'Projek Kreatif dan Kewirausahaan', score: isSampleStudent ? 85 : '', comp: isSampleStudent ? 'Mengembangkan multimedia analog dan digital, memahami konsep peluang dan risiko usaha' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '5.', name: 'Mata Pelajaran Pilihan****: a. Desain UI/UX', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Memahami alur kerja perancangan UI/UX, prototyping visual, user testing dan literasi digital' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '6.', name: 'Mata Pelajaran Pilihan****: b. Pemrograman Gim', score: isSampleStudent ? 79 : '', comp: isSampleStudent ? 'Memahami dasar pemrograman berbasis teks dan grafis' : '', kktp: isSampleStudent ? 78 : '' },
  ];

  const rawScoresXi2 = [
    { no: '1.', name: 'Pendidikan Agama dan Budi Pekerti*', score: isSampleStudent ? 89 : '', comp: isSampleStudent ? 'Membaca dan menganalisis QS Yunus/10:40-41 dan QS Al Maidah/5:32' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '2.', name: 'Pendidikan Pancasila', score: isSampleStudent ? 88 : '', comp: isSampleStudent ? 'Menganalisis penanganan konflik di tengah keragaman masyarakat Indonesia' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '3.', name: 'Bahasa Indonesia', score: isSampleStudent ? 90 : '', comp: isSampleStudent ? 'Menemukan tema dan pesan yang menginspirasi dalam karya sastra' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '4.', name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', score: isSampleStudent ? 95 : '', comp: isSampleStudent ? 'Mempraktikkan berbagai keterampilan gerak dan kebugaran jasmani pribadi' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '5.', name: 'Sejarah', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Menganalisis secara kritis dan kreatif mengenai dinamika perlawanan bangsa' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '6.', name: 'Muatan Lokal**: a. Conversation', score: isSampleStudent ? 87 : '', comp: isSampleStudent ? 'Mampu melakukan interview kerja teknis dalam percakapan Bahasa Inggris' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '1.', name: 'Matematika', score: isSampleStudent ? 86 : '', comp: isSampleStudent ? 'Menentukan determinan dan invers matriks maksimal ordo 3x3' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '2.', name: 'Bahasa Inggris', score: isSampleStudent ? 88 : '', comp: isSampleStudent ? 'Mengidentifikasi ciri-ciri kebahasaan teks narrative dan teks recount' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '3.', name: 'Mata Pelajaran (Konsentrasi Keahlian)***', score: isSampleStudent ? 87 : '', comp: isSampleStudent ? 'Menunjukkan penguasaan yang baik dalam menerapkan konsep dasar CSS' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '4.', name: 'Projek Kreatif dan Kewirausahaan', score: isSampleStudent ? 91 : '', comp: isSampleStudent ? 'Menyusun rancangan prototype produk perangkat lunak bernilai jual' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '5.', name: 'Mata Pelajaran Pilihan****: a. Design UI/UX', score: isSampleStudent ? 87 : '', comp: isSampleStudent ? 'Menjelaskan desain UI untuk berbagai ukuran layar, responsive layout dan media queries' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '6.', name: 'Mata Pelajaran Pilihan****: b. Pemrograman Gim', score: isSampleStudent ? 82 : '', comp: isSampleStudent ? 'Mengintegrasikan objek statis dan dinamis ke dalam gim engine' : '', kktp: isSampleStudent ? 78 : '' },
  ];

  const rawScoresXii1 = [
    { no: '1.', name: 'Pendidikan Agama dan Budi Pekerti*', score: isSampleStudent ? 91 : '', comp: isSampleStudent ? 'Menganalisis terjemahan mengenai sikap sabar dalam menghadapi ujian' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '2.', name: 'Pendidikan Pancasila', score: isSampleStudent ? 90 : '', comp: isSampleStudent ? 'Menerapkan nilai Pancasila' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '3.', name: 'Bahasa Indonesia', score: isSampleStudent ? 91 : '', comp: isSampleStudent ? 'Menemukan dan menggunakan informasi ide kewirausahaan, fenomena AI' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '4.', name: 'Muatan Lokal**: a. Conversation', score: isSampleStudent ? 85 : '', comp: isSampleStudent ? 'Berkomunikasi lisan dalam konteks industri kerja profesional' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '1.', name: 'Matematika', score: isSampleStudent ? 84 : '', comp: isSampleStudent ? 'Menganalisis dan mengolah permutasi' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '2.', name: 'Bahasa Inggris', score: isSampleStudent ? 86 : '', comp: isSampleStudent ? 'Menganalisis teks naratif dan argumentatif' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '3.', name: 'Mata Pelajaran (Konsentrasi Keahlian)***', score: isSampleStudent ? 94 : '', comp: isSampleStudent ? 'Memahami konsep bahasa pemrograman serta pembuatannya' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '4.', name: 'Projek Kreatif dan Kewirausahaan', score: isSampleStudent ? 97 : '', comp: isSampleStudent ? 'Memahami dasar hukum HAKI' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '5.', name: 'Praktik Kerja Lapangan (PKL Industri)****', score: isSampleStudent ? 88 : '', comp: isSampleStudent ? 'Melaksanakan magang industri di PT Buana Mitra Nusantara secara disiplin' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '6.', name: 'Mata Pelajaran Pilihan****: a. Design UI/UX', score: isSampleStudent ? 94 : '', comp: isSampleStudent ? 'Merancang platform' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '7.', name: 'Mata Pelajaran Pilihan****: b. Pengembangan Gim', score: isSampleStudent ? 89 : '', comp: isSampleStudent ? 'Menggunakan game engine Unity' : '', kktp: isSampleStudent ? 78 : '' },
  ];

  const rawScoresXii2 = [
    { no: '1.', name: 'Pendidikan Agama dan Budi Pekerti*', score: isSampleStudent ? 90 : '', comp: isSampleStudent ? 'Memahami ilmu kalam' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '2.', name: 'Pendidikan Pancasila', score: isSampleStudent ? 89 : '', comp: isSampleStudent ? 'Menganalisis identitas kelompok lokal, regional' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '3.', name: 'Bahasa Indonesia', score: isSampleStudent ? 91 : '', comp: isSampleStudent ? 'Memahami isi teks cerita' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '4.', name: 'Muatan Lokal**: a. Conversation', score: isSampleStudent ? 86 : '', comp: isSampleStudent ? 'Wawancara kerja teknis dan presentasi portofolio industri dengan lancar' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '1.', name: 'Matematika', score: isSampleStudent ? 85 : '', comp: isSampleStudent ? 'Menyelesaikan masalah fungsi aljabar dan anuitas' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '2.', name: 'Bahasa Inggris', score: isSampleStudent ? 87 : '', comp: isSampleStudent ? 'Menulis dan mempresentasikan hortatory exposition text' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '3.', name: 'Mata Pelajaran (Konsentrasi Keahlian)***', score: isSampleStudent ? 95 : '', comp: isSampleStudent ? 'Pemrograman SQL, PBO, GUI dan pembuatan web statis' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '4.', name: 'Projek Kreatif dan Kewirausahaan', score: isSampleStudent ? 98 : '', comp: isSampleStudent ? 'Membuat produk website toko online layak jual' : '', kktp: isSampleStudent ? 80 : '' },
    { no: '5.', name: 'Praktik Kerja Lapangan / UKK****', score: isSampleStudent ? 90 : '', comp: isSampleStudent ? 'Uji Kompetensi Keahlian Kejuruan Bersertifikat Kompeten BNSP' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '6.', name: 'Mata Pelajaran Pilihan****: a. Design UI/UX', score: isSampleStudent ? 90 : '', comp: isSampleStudent ? 'Menerapkan standar WCAG dan praktik terbaik mobile UI' : '', kktp: isSampleStudent ? 78 : '' },
    { no: '7.', name: 'Mata Pelajaran Pilihan****: b. Pemrograman Gim', score: isSampleStudent ? 89 : '', comp: isSampleStudent ? 'Memahami source code dan melakukan pembaruan gim' : '', kktp: isSampleStudent ? 78 : '' },
  ];

  const makeDefaultP5Dims = (items?: any[]) => [
    { no: '1.', dimensi: 'Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia', elemen: items?.[0]?.elemen || '', sub_elemen: items?.[0]?.sub_elemen || '', target: items?.[0]?.target || '-' },
    { no: '2.', dimensi: 'Berkebhinekaan Global', elemen: items?.[1]?.elemen || '', sub_elemen: items?.[1]?.sub_elemen || '', target: items?.[1]?.target || '-' },
    { no: '3.', dimensi: 'Bergotong Royong', elemen: items?.[2]?.elemen || '', sub_elemen: items?.[2]?.sub_elemen || '', target: items?.[2]?.target || '-' },
    { no: '4.', dimensi: 'Mandiri', elemen: items?.[3]?.elemen || '', sub_elemen: items?.[3]?.sub_elemen || '', target: items?.[3]?.target || '-' },
    { no: '5.', dimensi: 'Bernalar Kritis', elemen: items?.[4]?.elemen || '', sub_elemen: items?.[4]?.sub_elemen || '', target: items?.[4]?.target || '-' },
    { no: '6.', dimensi: 'Kreatif', elemen: items?.[5]?.elemen || '', sub_elemen: items?.[5]?.sub_elemen || '', target: items?.[5]?.target || '-' },
  ];

  const rawP5X1 = makeDefaultP5Dims(isSampleStudent ? [
    { elemen: 'Akhlak kepada alam', sub_elemen: 'Mewujudkan dan membangun kesadaran peduli lingkungan', target: 'Mulai berkembang' },
    { elemen: '-', sub_elemen: '-', target: '-' },
    { elemen: 'Kolaborasi', sub_elemen: 'Bersinergi untuk kebaikan', target: 'Mulai berkembang' },
    { elemen: '-', sub_elemen: '-', target: '-' },
    { elemen: '-', sub_elemen: '-', target: '-' },
    { elemen: 'Keluwesan berpikir', sub_elemen: 'Bereksperimen secara kreatif', target: 'Mulai berkembang' },
  ] : []);

  const rawP5X2 = makeDefaultP5Dims(isSampleStudent ? [
    { elemen: 'Akhlak pribadi', sub_elemen: 'Menjaga integritas dan kejujuran diri', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Mengenal budaya', sub_elemen: 'Memahami toleransi keberagaman suku', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Kerjasama tim', sub_elemen: 'Aktif berbagi tugas dan tolong menolong', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Regulasi diri', sub_elemen: 'Mengatur waktu belajar dan praktek coding', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Memproses ide', sub_elemen: 'Menjelaskan argumen logis algoritma', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Karya mandiri', sub_elemen: 'Menghasilkan karya media interaktif', target: 'Berkembang Sesuai Harapan' },
  ] : []);

  const rawP5Xi1 = makeDefaultP5Dims(isSampleStudent ? [
    { elemen: 'Akhlak kepada Manusia', sub_elemen: 'Melakukan perbuatan baik kepada sesama', target: 'Berkembang Sesuai Harapan' },
    { elemen: '-', sub_elemen: '-', target: '-' },
    { elemen: 'Kerjasama tim', sub_elemen: 'Kolaborasi proyek web', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Inisiatif mandiri', sub_elemen: 'Eksplorasi framework web', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Analisis logika', sub_elemen: 'Problem solving algoritma', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Kreativitas desain', sub_elemen: 'Prototipe antarmuka sistem', target: 'Berkembang Sesuai Harapan' },
  ] : []);

  const rawP5Xi2 = makeDefaultP5Dims(isSampleStudent ? [
    { elemen: 'Integritas etika', sub_elemen: 'Tanggung jawab kode etik IT', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Wawasan global', sub_elemen: 'Standar teknologi internasional', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Sinergi tim kerja', sub_elemen: 'Manajemen sprint scrum', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Kemandirian profesional', sub_elemen: 'Penyelesaian bug mandiri', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Refleksi teknis', sub_elemen: 'Code review rekan tim', target: 'Berkembang Sesuai Harapan' },
    { elemen: 'Inovasi produk', sub_elemen: 'Aplikasi fungsional bernilai guna', target: 'Berkembang Sesuai Harapan' },
  ] : []);

  const rawP5Xii1 = makeDefaultP5Dims(isSampleStudent ? [
    { elemen: 'Etika industri', sub_elemen: 'Disiplin dan loyalitas tempat PKL', target: 'Sangat Berkembang' },
    { elemen: 'Komunikasi profesional', sub_elemen: 'Presentasi hasil kerja ke pembimbing', target: 'Sangat Berkembang' },
    { elemen: 'Gotong royong tim', sub_elemen: 'Bekerja sama dalam divisi engineering', target: 'Sangat Berkembang' },
    { elemen: 'Kemandirian kerja', sub_elemen: 'Menyelesaikan modul tepat waktu', target: 'Sangat Berkembang' },
    { elemen: 'Troubleshooting kritis', sub_elemen: 'Menganalisis kegagalan sistem', target: 'Sangat Berkembang' },
    { elemen: 'Kreativitas solusi', sub_elemen: 'Optimalisasi arsitektur aplikasi', target: 'Sangat Berkembang' },
  ] : []);

  const rawP5Xii2 = makeDefaultP5Dims(isSampleStudent ? [
    { elemen: 'Akhlak mulia', sub_elemen: 'Kesiapan berbakti pada masyarakat', target: 'Sangat Berkembang' },
    { elemen: 'Wawasan kebangsaan', sub_elemen: 'Karya untuk kemajuan Indonesia', target: 'Sangat Berkembang' },
    { elemen: 'Solidaritas alumni', sub_elemen: 'Membangun jejaring karir positif', target: 'Sangat Berkembang' },
    { elemen: 'Kemandirian hidup', sub_elemen: 'Siap bekerja dan wirausaha', target: 'Sangat Berkembang' },
    { elemen: 'Visi masa depan', sub_elemen: 'Perencanaan studi lanjut dan karir', target: 'Sangat Berkembang' },
    { elemen: 'Karya inovatif akhir', sub_elemen: 'Tugas akhir bersertifikasi BNSP', target: 'Sangat Berkembang' },
  ] : []);

  const defaultExtras = (sampleIdx: number = 0) => [
    { no: '1.', name: isSampleStudent ? 'Praja Muda Karana (Pramuka)' : '', notes: isSampleStudent ? 'Aktif dalam kegiatan kepramukaan sekolah' : '' },
    { no: '2.', name: isSampleStudent ? (sampleIdx % 2 === 0 ? 'PMR (Palang Merah Remaja)' : 'English Conversation Club') : '', notes: isSampleStudent ? 'Melaksanakan kegiatan dengan sangat baik' : '' },
    { no: '3.', name: '', notes: '' },
  ];

  const defaultAchievements = () => [
    { type: isSampleStudent ? 'Akademik' : '', level: isSampleStudent ? 'Kabupaten/Kota' : '', name: isSampleStudent ? 'Lomba Cerdas Cermat Jenjang SMK' : '', year: isSampleStudent ? '2023' : '', organizer: isSampleStudent ? 'Dinas Pendidikan Deli Serdang' : '', rank: isSampleStudent ? 'Peserta Berprestasi' : '' },
    { type: isSampleStudent ? 'Teknologi' : '', level: isSampleStudent ? 'Sekolah' : '', name: isSampleStudent ? 'Juara 1 Web Design SMKN 1 Beringin' : '', year: isSampleStudent ? '2024' : '', organizer: isSampleStudent ? 'SMKN 1 Beringin' : '', rank: isSampleStudent ? 'Juara I' : '' },
  ];

  const { data, setData, put, processing, errors } = useForm({
    // LEMBAR 1: IDENTITAS LENGKAP
    nomor_urut: student.nomor_urut || (isSampleStudent ? '1' : ''),
    nis: student.nis || '',
    nisn: student.nisn || '',
    nik: student.nik || (isSampleStudent ? '1207191005080001' : ''),
    name: student.name || '',
    nickname: student.nickname || '',
    gender: student.gender || 'Laki-laki',
    birth_place: student.birth_place || (isSampleStudent ? 'LUBUK PAKAM' : ''),
    birth_date: cleanBirthDate || (isSampleStudent ? '2008-05-10' : ''),
    religion: student.religion || (isSampleStudent ? 'ISLAM' : ''),
    citizenship: student.citizenship || (isSampleStudent ? 'INDONESIA' : ''),
    child_order: student.child_order || (isSampleStudent ? '1 (SATU)' : ''),
    siblings_count: student.siblings_count !== undefined && student.siblings_count !== null ? student.siblings_count : (isSampleStudent ? 2 : ''),
    step_siblings_count: student.step_siblings_count !== undefined && student.step_siblings_count !== null ? student.step_siblings_count : (isSampleStudent ? 0 : ''),
    foster_siblings_count: student.foster_siblings_count !== undefined && student.foster_siblings_count !== null ? student.foster_siblings_count : (isSampleStudent ? 0 : ''),
    daily_language: student.daily_language || (isSampleStudent ? 'BAHASA INDONESIA' : ''),
    blood_type: student.blood_type || (isSampleStudent ? 'A' : ''),

    // Header Kode Sekolah & Wilayah
    kode_kecamatan: isSampleStudent ? '0201' : '',
    kode_kabupaten: isSampleStudent ? '02' : '',
    kode_sekolah: isSampleStudent ? '10258778' : '',
    kode_provinsi: isSampleStudent ? '32' : '',

    // Alamat
    address: student.address || (isSampleStudent ? 'DESA ARAS KABU DUSUN AMAL NO. 086' : ''),
    rt_rw: student.rt_rw || (isSampleStudent ? '-' : ''),
    village: student.village || (isSampleStudent ? 'ARAS KABU' : ''),
    district: student.district || (isSampleStudent ? 'BERINGIN' : ''),
    regency: student.regency || (isSampleStudent ? 'DELI SERDANG' : ''),
    province: student.province || (isSampleStudent ? 'SUMATERA UTARA' : ''),
    postal_code: student.postal_code || (isSampleStudent ? '20552' : ''),
    phone: student.phone || (isSampleStudent ? '0831 8006 8288' : ''),
    residence_type: student.residence_type || (isSampleStudent ? 'Bersama Orang Tua' : ''),
    distance_to_school: student.distance_to_school || (isSampleStudent ? '5 KM' : ''),

    // Orang Tua & Wali
    father_name: parentData.father_name || (isSampleStudent ? 'DODY CANDRA SITEPU' : ''),
    father_nik: parentData.father_nik || (isSampleStudent ? '1207191005780002' : ''),
    father_education: parentData.father_education || (isSampleStudent ? 'SLTA / SEDERAJAT' : ''),
    father_job: parentData.father_job || (isSampleStudent ? 'BURUH HARIAN LEPAS' : ''),
    father_phone: parentData.father_phone || (isSampleStudent ? '0838 4341 3678' : ''),
    father_birth_place_date: isSampleStudent ? 'LUBUK PAKAM, 10 MEI 1978' : '',
    father_religion: isSampleStudent ? 'ISLAM' : '',
    father_citizenship: isSampleStudent ? 'INDONESIA' : '',
    father_income: isSampleStudent ? 'Rp 2.500.000,-' : '',
    father_alive: isSampleStudent ? 'MASIH HIDUP' : '',

    mother_name: parentData.mother_name || (isSampleStudent ? 'JURHAIDAH' : ''),
    mother_nik: parentData.mother_nik || (isSampleStudent ? '1207194508800003' : ''),
    mother_education: parentData.mother_education || (isSampleStudent ? 'SD / SEDERAJAT' : ''),
    mother_job: parentData.mother_job || (isSampleStudent ? 'IBU RUMAH TANGGA' : ''),
    mother_phone: parentData.mother_phone || (isSampleStudent ? '0838 4341 3678' : ''),
    mother_birth_place_date: isSampleStudent ? 'LUBUK PAKAM, 05 AGUSTUS 1980' : '',
    mother_religion: isSampleStudent ? 'ISLAM' : '',
    mother_citizenship: isSampleStudent ? 'INDONESIA' : '',
    mother_income: isSampleStudent ? '-' : '',
    mother_alive: isSampleStudent ? 'MASIH HIDUP' : '',

    guardian_name: guardianData.name || '',
    guardian_relation: guardianData.relation || '',
    guardian_education: guardianData.education || '',
    guardian_job: guardianData.job || '',
    guardian_phone: guardianData.phone || '',

    // Pendidikan Asal (SMP)
    previous_school_name: eduData.school_name || (isSampleStudent ? 'SMP NEGERI 3 LUBUK PAKAM' : ''),
    previous_school_certificate: eduData.certificate_number || (isSampleStudent ? 'DN-07/D-SMP/K13/23/0040627' : ''),
    previous_school_certificate_date: eduData.certificate_date || (isSampleStudent ? '9 JUNI 2023' : ''),
    admission_info: isSampleStudent ? 'KELAS X (PPLG) - TANGGAL 10 JULI 2023' : '',

    // LEMBAR 2: Jasmani 6 Semester
    height_sem1: isSampleStudent ? 155 : (healthData.height || ''),
    height_sem2: isSampleStudent ? 158 : '',
    height_sem3: isSampleStudent ? 160 : '',
    height_sem4: isSampleStudent ? 162 : '',
    height_sem5: isSampleStudent ? 163 : '',
    height_sem6: isSampleStudent ? 165 : '',
    weight_sem1: isSampleStudent ? 35 : (healthData.weight || ''),
    weight_sem2: isSampleStudent ? 38 : '',
    weight_sem3: isSampleStudent ? 42 : '',
    weight_sem4: isSampleStudent ? 45 : '',
    weight_sem5: isSampleStudent ? 48 : '',
    weight_sem6: isSampleStudent ? 50 : '',
    medical_history: healthData.medical_history || (isSampleStudent ? '-' : ''),
    special_condition: healthData.special_condition || (isSampleStudent ? '-' : ''),

    // Meninggalkan Sekolah
    graduation_year: isSampleStudent ? '2026' : '',
    university_continuation: isSampleStudent ? 'UNIVERSITAS SUMATERA UTARA (USU)' : '',
    transfer_school: isSampleStudent ? '-' : '',
    drop_out_reason: isSampleStudent ? '-' : '',

    // Prestasi & Beasiswa
    achievement_name: isSampleStudent ? 'Lomba Cerdas Cermat Jenjang SMK' : '',
    achievement_level: isSampleStudent ? 'Kabupaten/Kota' : '',
    achievement_year: isSampleStudent ? '2023' : '',
    achievement_rank: isSampleStudent ? 'Peserta Berprestasi' : '',
    scholarship_desc: isSampleStudent ? 'Beasiswa Murid Berprestasi Disdik Deli Serdang' : '',
    scholarship_start_year: isSampleStudent ? '2024' : '',
    scholarship_end_year: isSampleStudent ? '2025' : '',

    // Pejabat & Tanda Tangan
    principal_name: school?.principal_name || 'HJ. HAFRIDA HANUM, S.Pd, M.Pd',
    principal_nip: school?.principal_nip || '19660414 199403 2 009',

    // Wali Kelas X, XI, XII
    wali_x_name: historyX?.wali_kelas?.name || (isSampleStudent ? 'ADISTY WARDHANI, S.Pd.I' : ''),
    wali_x_nip: historyX?.wali_kelas?.nip || (isSampleStudent ? '19821231 201101 2 008' : ''),

    wali_xi_name: historyXI?.wali_kelas?.name || (isSampleStudent ? 'NOVAYANTI, S.Pd.I' : ''),
    wali_xi_nip: historyXI?.wali_kelas?.nip || (isSampleStudent ? '19880721 201503 2 004' : ''),

    wali_xii_name: historyXII?.wali_kelas?.name || (isSampleStudent ? 'BUDI SANTOSO, S.Kom' : ''),
    wali_xii_nip: historyXII?.wali_kelas?.nip || (isSampleStudent ? '19850312 201402 1 003' : ''),

    // Keputusan Kenaikan & Kelulusan
    promotion_x_genap: isSampleStudent ? 'Naik ke Kelas XI PPLG 2' : '',
    promotion_xi_genap: isSampleStudent ? 'Naik ke Kelas XII PPLG 2' : '',
    graduation_status: student.graduation?.status || (isSampleStudent ? 'LULUS' : ''),
    graduation_cert_no: student.graduation?.certificate_number || (isSampleStudent ? 'DN-07/M-SMK/K13/2026/0012345' : ''),
    graduation_skhus_no: student.graduation?.notes || (isSampleStudent ? 'DN-07/D-SMK/2026/0054321' : ''),

    // Header Semester: Kelas, Fase, Tahun Pelajaran & Semester (Manual input fleksibel)
    class_x1: student.current_class?.name || (isSampleStudent ? 'X PPLG 2' : ''),
    fase_x1: isSampleStudent ? 'E' : '',
    tahun_pelajaran_x1: isSampleStudent ? '2023/2024' : '',
    semester_x1: '1 (GANJIL)',

    class_x2: student.current_class?.name || (isSampleStudent ? 'X PPLG 2' : ''),
    fase_x2: isSampleStudent ? 'E' : '',
    tahun_pelajaran_x2: isSampleStudent ? '2023/2024' : '',
    semester_x2: '2 (GENAP)',

    class_xi1: isSampleStudent ? 'XI PPLG 2' : '',
    fase_xi1: isSampleStudent ? 'F' : '',
    tahun_pelajaran_xi1: isSampleStudent ? '2024/2025' : '',
    semester_xi1: '3 (GANJIL)',

    class_xi2: isSampleStudent ? 'XI PPLG 2' : '',
    fase_xi2: isSampleStudent ? 'F' : '',
    tahun_pelajaran_xi2: isSampleStudent ? '2024/2025' : '',
    semester_xi2: '4 (GENAP)',

    class_xii1: isSampleStudent ? 'XII PPLG 2' : '',
    fase_xii1: isSampleStudent ? 'F' : '',
    tahun_pelajaran_xii1: isSampleStudent ? '2025/2026' : '',
    semester_xii1: '5 (GANJIL)',

    class_xii2: isSampleStudent ? 'XII PPLG 2' : '',
    fase_xii2: isSampleStudent ? 'F' : '',
    tahun_pelajaran_xii2: isSampleStudent ? '2025/2026' : '',
    semester_xii2: '6 (GENAP)',

    class_transkrip: student.current_class?.name || (isSampleStudent ? 'XII PPLG 2' : ''),
    fase_transkrip: isSampleStudent ? 'F' : '',
    tahun_pelajaran_transkrip: isSampleStudent ? '2023/2024 s.d. 2025/2026' : '',
    semester_transkrip: '1 s.d. 6 (LULUS)',

    // Presensi 6 Semester
    sick_x_1: isSampleStudent ? 0 : '', permit_x_1: isSampleStudent ? 0 : '', unexcused_x_1: isSampleStudent ? 0 : '',
    sick_x_2: isSampleStudent ? 1 : '', permit_x_2: isSampleStudent ? 0 : '', unexcused_x_2: isSampleStudent ? 0 : '',
    sick_xi_1: isSampleStudent ? 0 : '', permit_xi_1: isSampleStudent ? 0 : '', unexcused_xi_1: isSampleStudent ? 0 : '',
    sick_xi_2: isSampleStudent ? 0 : '', permit_xi_2: isSampleStudent ? 0 : '', unexcused_xi_2: isSampleStudent ? 0 : '',
    sick_xii_1: isSampleStudent ? 0 : '', permit_xii_1: isSampleStudent ? 0 : '', unexcused_xii_1: isSampleStudent ? 0 : '',
    sick_xii_2: isSampleStudent ? 0 : '', permit_xii_2: isSampleStudent ? 0 : '', unexcused_xii_2: isSampleStudent ? 0 : '',

    // Nilai Mapel Lengkap per Semester
    scores_x1: rawScoresX1,
    scores_x2: rawScoresX2,
    scores_xi1: rawScoresXi1,
    scores_xi2: rawScoresXi2,
    scores_xii1: rawScoresXii1,
    scores_xii2: rawScoresXii2,

    // ASPEK C, D, E (P5, EKSTRAKURIKULER, PRESTASI) 6 SEMESTER
    p5_theme_1_x1: isSampleStudent ? 'Pembuatan Pupuk Organik (Eco enzym)' : '',
    p5_theme_2_x1: isSampleStudent ? "Senam pagi setiap hari jum'at" : '',
    p5_theme_3_x1: isSampleStudent ? 'Kunjungan industri ke PT. Braja Mitra Nusantara' : '',
    p5_dimensions_x1: rawP5X1,
    extras_x1: defaultExtras(0),
    achievements_x1: defaultAchievements(),

    p5_theme_1_x2: isSampleStudent ? 'Budaya Hidup Bersih & Sehat (K3LH)' : '',
    p5_theme_2_x2: isSampleStudent ? 'Kebhinekaan Nusantara' : '',
    p5_theme_3_x2: isSampleStudent ? 'Kewirausahaan Mandiri' : '',
    p5_dimensions_x2: rawP5X2,
    extras_x2: defaultExtras(1),
    achievements_x2: defaultAchievements(),

    p5_theme_1_xi1: isSampleStudent ? 'Sehat Jasmani' : '',
    p5_theme_2_xi1: isSampleStudent ? 'Siap Bekerja' : '',
    p5_theme_3_xi1: isSampleStudent ? 'Siap Berkarya' : '',
    p5_dimensions_xi1: rawP5Xi1,
    extras_xi1: defaultExtras(0),
    achievements_xi1: defaultAchievements(),

    p5_theme_1_xi2: isSampleStudent ? 'Kewirausahaan Digital' : '',
    p5_theme_2_xi2: isSampleStudent ? 'Rekayasa Perangkat Lunak Berkelanjutan' : '',
    p5_theme_3_xi2: isSampleStudent ? 'Etika Profesi IT' : '',
    p5_dimensions_xi2: rawP5Xi2,
    extras_xi2: defaultExtras(1),
    achievements_xi2: defaultAchievements(),

    p5_theme_1_xii1: isSampleStudent ? 'Inovasi Produk Digital Industri' : '',
    p5_theme_2_xii1: isSampleStudent ? 'Integritas & Etika Kerja Profesional' : '',
    p5_theme_3_xii1: isSampleStudent ? 'Kepemimpinan Lapangan' : '',
    p5_dimensions_xii1: rawP5Xii1,
    extras_xii1: defaultExtras(0),
    achievements_xii1: defaultAchievements(),

    p5_theme_1_xii2: isSampleStudent ? 'Kesiapan Karir & Dunia Usaha' : '',
    p5_theme_2_xii2: isSampleStudent ? 'Kewirausahaan Mandiri Berkelanjutan' : '',
    p5_theme_3_xii2: isSampleStudent ? 'Bakti Alumni untuk Negeri' : '',
    p5_dimensions_xii2: rawP5Xii2,
    extras_xii2: defaultExtras(1),
    achievements_xii2: defaultAchievements(),

    status: student.status || 'Aktif',
    current_class_id: student.current_class_id || '',
  });

  // Calculate live sum and average for any list of scores
  const calcSum = (list: { score: any }[]) => {
    const valid = list.filter((i) => i.score !== '' && i.score !== null && !isNaN(Number(i.score)));
    if (!valid.length) return '-';
    return valid.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  };
  const calcAvg = (list: { score: any }[]) => {
    const valid = list.filter((i) => i.score !== '' && i.score !== null && !isNaN(Number(i.score)));
    if (!valid.length) return '-';
    const sum = valid.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
    return (sum / valid.length).toFixed(2);
  };

  const handleScoreChange = (
    semKey: 'scores_x1' | 'scores_x2' | 'scores_xi1' | 'scores_xi2' | 'scores_xii1' | 'scores_xii2',
    index: number,
    field: 'score' | 'comp' | 'kktp',
    val: any
  ) => {
    const list = [...data[semKey]];
    list[index] = { ...list[index], [field]: field === 'comp' ? val : Number(val) };
    setData(semKey, list);
  };

  const handleP5DimChange = (dimKey: string, idx: number, field: string, val: string) => {
    const list = [...(data as any)[dimKey]];
    list[idx] = { ...list[idx], [field]: val };
    setData(dimKey as any, list);
  };

  const handleExtraChange = (extraKey: string, idx: number, field: string, val: string) => {
    const list = [...(data as any)[extraKey]];
    list[idx] = { ...list[idx], [field]: val };
    setData(extraKey as any, list);
  };

  const handleAchievementChange = (achKey: string, idx: number, field: string, val: string) => {
    const list = [...(data as any)[achKey]];
    list[idx] = { ...list[idx], [field]: val };
    setData(achKey as any, list);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/students/${student.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      },
    });
  };

  return (
    <AppLayout title={`Buku Induk & Rapor 6 Semester - ${student.name}`}>
      <Head title={`Buku Induk & Rapor 6 Semester - ${student.name}`} />

      <div className="space-y-4 pb-28">
        {/* Floating Top Header (Toolbar Pengisian) */}
        <div className="sticky top-2 z-30 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/students"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition shrink-0"
              title="Kembali ke Daftar Siswa"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-mono">
                  NIS: {student.nis}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-mono">
                  NISN: {student.nisn}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                  {student.current_class?.name || 'X PPLG 2'}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white uppercase tracking-tight mt-0.5 font-serif truncate">
                {student.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            {saveSuccess && (
              <span className="w-full md:w-auto text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tersimpan!</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={processing}
              className="flex-1 md:flex-none neu-btn-tactile inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-slate-900 dark:text-white text-xs font-extrabold transition disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-blue-600" />
              <span>{processing ? 'Menyimpan...' : 'Simpan Data'}</span>
            </button>

            {/* ONE-CLICK PRINT (Prints all 15 sheets uninterrupted!) */}
            <a
              href={`/reports/buku-induk/${student.id}?print=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none neu-btn-primary-tactile inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak 15 Hal A4</span>
            </a>

            {/* Quick Sheet Pager (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 neu-inset-sm p-1 rounded-xl">
              <button
                type="button"
                onClick={handlePrevSheet}
                disabled={currentIndex <= 0 && activeSheetTab !== 'all'}
                className="p-1 rounded-lg text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold px-2 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                {activeSheetTab === 'all' ? '15 Hal' : `${currentIndex + 1} / 9`}
              </span>
              <button
                type="button"
                onClick={handleNextSheet}
                disabled={currentIndex >= sheetOrder.length - 1 && activeSheetTab !== 'all'}
                className="p-1 rounded-lg text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Hapus Siswa */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="neu-btn-danger-tactile inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0"
              title="Hapus Data Peserta Didik"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Siswa</span>
            </button>
          </div>
        </div>

        {/* Tab Navigasi Lembar Buku Fisik (Desktop & Print Only) */}
        <div className="hidden md:flex print:hidden items-center gap-1 overflow-x-auto p-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold font-sans scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
          <button
            type="button"
            onClick={() => setActiveSheetTab('all')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeSheetTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Semua Lembar Utuh (15 Hal)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSheetTab('lembar1')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeSheetTab === 'lembar1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            1. Biodata Siswa (Lbr 1)
          </button>

          <button
            type="button"
            onClick={() => setActiveSheetTab('lembar2')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeSheetTab === 'lembar2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            2. Jasmani 6 Smt & Beasiswa (Lbr 2)
          </button>

          <button
            type="button"
            onClick={() => setActiveSheetTab('raporX1')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeSheetTab === 'raporX1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            3. Rapor X Smt 1 (Ganjil)
          </button>

          <button
            type="button"
            onClick={() => setActiveSheetTab('raporX2')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeSheetTab === 'raporX2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            4. Rapor X Smt 2 (Naik XI)
          </button>

          <button
            type="button"
            onClick={() => setActiveSheetTab('raporXI1')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeSheetTab === 'raporXI1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            5. Rapor XI Smt 3 (Ganjil)
          </button>

          <button
            type="button"
            onClick={() => setActiveSheetTab('raporXI2')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeSheetTab === 'raporXI2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            6. Rapor XI Smt 4 (Naik XII)
          </button>

          <button
            type="button"
            onClick={() => setActiveSheetTab('raporXII1')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeSheetTab === 'raporXII1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            7. Rapor XII Smt 5 (PKL Industri)
          </button>

          <button
            type="button"
            onClick={() => setActiveSheetTab('raporXII2')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              activeSheetTab === 'raporXII2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            8. Rapor XII Smt 6 (Kelulusan & Ijazah)
          </button>

          {/* HALAMAN TERAKHIR: Rekap Nilai 6 Semester (Foto 3) */}
          <button
            type="button"
            onClick={() => setActiveSheetTab('lembar3')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 font-extrabold ${
              activeSheetTab === 'lembar3'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            9. Rekap Nilai 6 Smt (Halaman Terakhir)
          </button>
        </div>

        {/* ============================================================== */}
        {/* DUAL FORM: MOBILE RESPONSIVE APP + DESKTOP AUTHENTIC PAPER      */}
        {/* ============================================================== */}
        <form onSubmit={handleFormSubmit} className="space-y-6">

          {/* ============================================================== */}
          {/* 1. MOBILE RESPONSIVE FORM (TAMPILAN KHUSUS PONSEL, BUKAN KERTAS)*/}
          {/* ============================================================== */}
          <div className="block md:hidden print:hidden space-y-4 font-sans">
            {/* Mobile Tab Switcher (Neumorphic Segmented Track) */}
            <div className="grid grid-cols-4 gap-1.5 neu-tab-track text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setMobileTab('biodata')}
                className={cn(
                  "py-2.5 px-1 rounded-xl text-center transition-all flex flex-col items-center gap-1 cursor-pointer",
                  mobileTab === 'biodata'
                    ? "neu-tab-pill-active scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                <User className="w-4 h-4" />
                <span>Biodata</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab('jasmani')}
                className={cn(
                  "py-2.5 px-1 rounded-xl text-center transition-all flex flex-col items-center gap-1 cursor-pointer",
                  mobileTab === 'jasmani'
                    ? "neu-tab-pill-active scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                <Activity className="w-4 h-4" />
                <span>Jasmani</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab('rapor')}
                className={cn(
                  "py-2.5 px-1 rounded-xl text-center transition-all flex flex-col items-center gap-1 cursor-pointer",
                  mobileTab === 'rapor'
                    ? "neu-tab-pill-active scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                <Award className="w-4 h-4" />
                <span>Rapor</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab('rekap')}
                className={cn(
                  "py-2.5 px-1 rounded-xl text-center transition-all flex flex-col items-center gap-1 cursor-pointer",
                  mobileTab === 'rekap'
                    ? "neu-tab-pill-active scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Rekap</span>
              </button>
            </div>

            {/* TAB 1: BIODATA & ORANG TUA */}
            {mobileTab === 'biodata' && (
              <div className="space-y-4">
                {/* Identitas Satuan Pendidikan & Peserta Didik */}
                <MobileCard title="Identitas Satuan Pendidikan & Siswa" icon={Building2} badge="Buku Induk">
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase tracking-wider">
                        SMK NEGERI 1 BERINGIN
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-tight mt-1 truncate">
                        {data.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        NIS: {data.nis} • NISN: {data.nisn}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Status: {student.status || 'Aktif'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {student.current_class?.name || 'X PPLG 2'}
                        </span>
                      </div>
                    </div>
                  </div>
                </MobileCard>

                {/* Dokumen & Identitas */}
                <MobileCard title="Dokumen & Nomor Identitas" icon={BookOpen} badge="Identitas Resmi">
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="NIS" value={data.nis} onChange={(v) => setData('nis', v)} />
                    <MobileInput label="NISN" value={data.nisn} onChange={(v) => setData('nisn', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="NIK Siswa" value={data.nik} onChange={(v) => setData('nik', v)} />
                    <MobileInput label="No. Urut Buku Induk" value={data.nomor_urut} onChange={(v) => setData('nomor_urut', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Kode Sekolah" value={data.kode_sekolah} onChange={(v) => setData('kode_sekolah', v)} />
                    <MobileInput label="Kode Kecamatan" value={data.kode_kecamatan} onChange={(v) => setData('kode_kecamatan', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Kode Kab/Kota" value={data.kode_kabupaten} onChange={(v) => setData('kode_kabupaten', v)} />
                    <MobileInput label="Kode Provinsi" value={data.kode_provinsi} onChange={(v) => setData('kode_provinsi', v)} />
                  </div>
                </MobileCard>

                {/* Data Diri */}
                <MobileCard title="Data Diri Peserta Didik" icon={User} badge="Wajib Diisi">
                  <MobileInput label="Nama Lengkap Siswa" value={data.name} onChange={(v) => setData('name', v)} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Nama Panggilan" value={data.nickname} onChange={(v) => setData('nickname', v)} />
                    <MobileSelect
                      label="Jenis Kelamin"
                      value={data.gender}
                      onChange={(v) => setData('gender', v as any)}
                      options={[
                        { label: 'Laki-laki', value: 'Laki-laki' },
                        { label: 'Perempuan', value: 'Perempuan' },
                      ]}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Tempat Lahir" value={data.birth_place} onChange={(v) => setData('birth_place', v)} />
                    <MobileInput label="Tanggal Lahir" type="date" value={data.birth_date} onChange={(v) => setData('birth_date', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileSelect
                      label="Agama"
                      value={data.religion}
                      onChange={(v) => setData('religion', v)}
                      options={[
                        { label: 'ISLAM', value: 'ISLAM' },
                        { label: 'KRISTEN PROTESTAN', value: 'KRISTEN PROTESTAN' },
                        { label: 'KATOLIK', value: 'KATOLIK' },
                        { label: 'HINDU', value: 'HINDU' },
                        { label: 'BUDDHA', value: 'BUDDHA' },
                        { label: 'KONGHUCU', value: 'KONGHUCU' },
                      ]}
                    />
                    <MobileInput label="Kewarganegaraan" value={data.citizenship} onChange={(v) => setData('citizenship', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Anak ke-" value={data.child_order} onChange={(v) => setData('child_order', v)} />
                    <MobileInput label="Jml Saudara Kandung" type="number" value={data.siblings_count} onChange={(v) => setData('siblings_count', Number(v) || 0)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Jml Saudara Tiri" type="number" value={data.step_siblings_count} onChange={(v) => setData('step_siblings_count', Number(v) || 0)} />
                    <MobileInput label="Jml Saudara Angkat" type="number" value={data.foster_siblings_count} onChange={(v) => setData('foster_siblings_count', Number(v) || 0)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Golongan Darah" value={data.blood_type} onChange={(v) => setData('blood_type', v)} />
                    <MobileInput label="Bahasa Sehari-hari" value={data.daily_language} onChange={(v) => setData('daily_language', v)} />
                  </div>
                </MobileCard>

                {/* Tempat Tinggal */}
                <MobileCard title="Tempat Tinggal & Kontak" icon={Home}>
                  <MobileInput label="Alamat Tempat Tinggal" value={data.address} onChange={(v) => setData('address', v)} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="RT / RW" value={data.rt_rw} onChange={(v) => setData('rt_rw', v)} />
                    <MobileInput label="Kelurahan / Desa" value={data.village} onChange={(v) => setData('village', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Kecamatan" value={data.district} onChange={(v) => setData('district', v)} />
                    <MobileInput label="Kabupaten / Kota" value={data.regency} onChange={(v) => setData('regency', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Provinsi" value={data.province} onChange={(v) => setData('province', v)} />
                    <MobileInput label="Kode Pos" value={data.postal_code} onChange={(v) => setData('postal_code', v)} />
                  </div>
                  <MobileInput label="Nomor Telepon / HP Siswa" value={data.phone} onChange={(v) => setData('phone', v)} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Tinggal Bersama" value={data.residence_type} onChange={(v) => setData('residence_type', v)} />
                    <MobileInput label="Jarak ke Sekolah" value={data.distance_to_school} onChange={(v) => setData('distance_to_school', v)} />
                  </div>
                </MobileCard>

                {/* Orang Tua Kandung */}
                <MobileCard title="Data Orang Tua Kandung" icon={Heart}>
                  {/* Segmented Ayah / Ibu */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">
                    <button
                      type="button"
                      onClick={() => setParentSubTab('ayah')}
                      className={cn(
                        "py-1.5 rounded-lg transition",
                        parentSubTab === 'ayah'
                          ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      👨 Ayah Kandung
                    </button>
                    <button
                      type="button"
                      onClick={() => setParentSubTab('ibu')}
                      className={cn(
                        "py-1.5 rounded-lg transition",
                        parentSubTab === 'ibu'
                          ? "bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      👩 Ibu Kandung
                    </button>
                  </div>

                  {parentSubTab === 'ayah' ? (
                    <div className="space-y-3 pt-1">
                      <MobileInput label="Nama Lengkap Ayah" value={data.father_name} onChange={(v) => setData('father_name', v)} />
                      <MobileInput label="NIK Ayah" value={data.father_nik} onChange={(v) => setData('father_nik', v)} />
                      <MobileInput label="Tempat & Tanggal Lahir Ayah" value={data.father_birth_place_date} onChange={(v) => setData('father_birth_place_date', v)} />
                      <div className="grid grid-cols-2 gap-2.5">
                        <MobileInput label="Agama" value={data.father_religion} onChange={(v) => setData('father_religion', v)} />
                        <MobileInput label="Kewarganegaraan" value={data.father_citizenship} onChange={(v) => setData('father_citizenship', v)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <MobileInput label="Pendidikan Terakhir" value={data.father_education} onChange={(v) => setData('father_education', v)} />
                        <MobileInput label="Pekerjaan Ayah" value={data.father_job} onChange={(v) => setData('father_job', v)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <MobileInput label="Penghasilan / Bulan" value={data.father_income} onChange={(v) => setData('father_income', v)} />
                        <MobileInput label="No. HP Ayah" value={data.father_phone} onChange={(v) => setData('father_phone', v)} />
                      </div>
                      <MobileSelect
                        label="Status Keberadaan Ayah"
                        value={data.father_alive}
                        onChange={(v) => setData('father_alive', v)}
                        options={[
                          { label: 'MASIH HIDUP', value: 'MASIH HIDUP' },
                          { label: 'SUDAH MENINGGAL', value: 'SUDAH MENINGGAL' },
                        ]}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <MobileInput label="Nama Lengkap Ibu" value={data.mother_name} onChange={(v) => setData('mother_name', v)} />
                      <MobileInput label="NIK Ibu" value={data.mother_nik} onChange={(v) => setData('mother_nik', v)} />
                      <MobileInput label="Tempat & Tanggal Lahir Ibu" value={data.mother_birth_place_date} onChange={(v) => setData('mother_birth_place_date', v)} />
                      <div className="grid grid-cols-2 gap-2.5">
                        <MobileInput label="Agama" value={data.mother_religion} onChange={(v) => setData('mother_religion', v)} />
                        <MobileInput label="Kewarganegaraan" value={data.mother_citizenship} onChange={(v) => setData('mother_citizenship', v)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <MobileInput label="Pendidikan Terakhir" value={data.mother_education} onChange={(v) => setData('mother_education', v)} />
                        <MobileInput label="Pekerjaan Ibu" value={data.mother_job} onChange={(v) => setData('mother_job', v)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <MobileInput label="Penghasilan / Bulan" value={data.mother_income} onChange={(v) => setData('mother_income', v)} />
                        <MobileInput label="No. HP Ibu" value={data.mother_phone} onChange={(v) => setData('mother_phone', v)} />
                      </div>
                      <MobileSelect
                        label="Status Keberadaan Ibu"
                        value={data.mother_alive}
                        onChange={(v) => setData('mother_alive', v)}
                        options={[
                          { label: 'MASIH HIDUP', value: 'MASIH HIDUP' },
                          { label: 'SUDAH MENINGGAL', value: 'SUDAH MENINGGAL' },
                        ]}
                      />
                    </div>
                  )}
                </MobileCard>

                {/* Wali & Asal SMP */}
                <MobileCard title="Data Wali & Pendidikan Asal (SMP)" icon={GraduationCap}>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                    Data Wali Siswa (Bila Ada)
                  </div>
                  <MobileInput label="Nama Lengkap Wali" value={data.guardian_name} onChange={(v) => setData('guardian_name', v)} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Hubungan Keluarga" value={data.guardian_relation} onChange={(v) => setData('guardian_relation', v)} />
                    <MobileInput label="Pekerjaan Wali" value={data.guardian_job} onChange={(v) => setData('guardian_job', v)} />
                  </div>
                  <MobileInput label="No. HP Wali" value={data.guardian_phone} onChange={(v) => setData('guardian_phone', v)} />

                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1 pt-2">
                    Pendidikan Sebelumnya (SMP/MTs)
                  </div>
                  <MobileInput label="Nama SMP / MTs Asal" value={data.previous_school_name} onChange={(v) => setData('previous_school_name', v)} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Tanggal Ijazah SMP" value={data.previous_school_certificate_date} onChange={(v) => setData('previous_school_certificate_date', v)} />
                    <MobileInput label="Nomor Ijazah SMP" value={data.previous_school_certificate} onChange={(v) => setData('previous_school_certificate', v)} />
                  </div>
                  <MobileInput label="Diterima di SMK Negeri 1 Beringin" value={data.admission_info} onChange={(v) => setData('admission_info', v)} />
                </MobileCard>
              </div>
            )}

            {/* TAB 2: JASMANI & BEASISWA */}
            {mobileTab === 'jasmani' && (
              <div className="space-y-4">
                <MobileCard title="Riwayat Jasmani (Tinggi & Berat Badan)" icon={Activity} badge="6 Semester">
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-500 uppercase px-1">
                      <span>Tingkat / Semester</span>
                      <span className="text-center">Tinggi (cm)</span>
                      <span className="text-center">Berat (kg)</span>
                    </div>

                    {[
                      { label: 'Kelas X - Smt 1', hKey: 'height_sem1', wKey: 'weight_sem1' },
                      { label: 'Kelas X - Smt 2', hKey: 'height_sem2', wKey: 'weight_sem2' },
                      { label: 'Kelas XI - Smt 3', hKey: 'height_sem3', wKey: 'weight_sem3' },
                      { label: 'Kelas XI - Smt 4', hKey: 'height_sem4', wKey: 'weight_sem4' },
                      { label: 'Kelas XII - Smt 5', hKey: 'height_sem5', wKey: 'weight_sem5' },
                      { label: 'Kelas XII - Smt 6', hKey: 'height_sem6', wKey: 'weight_sem6' },
                    ].map((row, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-2 items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                          {row.label}
                        </span>
                        <input
                          type="number"
                          value={(data as any)[row.hKey] ?? ''}
                          onChange={(e) => setData(row.hKey as any, e.target.value)}
                          placeholder="cm"
                          className="w-full text-center py-1 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs"
                        />
                        <input
                          type="number"
                          value={(data as any)[row.wKey] ?? ''}
                          onChange={(e) => setData(row.wKey as any, e.target.value)}
                          placeholder="kg"
                          className="w-full text-center py-1 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <MobileInput label="Golongan Darah" value={data.blood_type} onChange={(v) => setData('blood_type', v)} />
                    <MobileInput label="Riwayat Penyakit Pernah Diderita" value={data.medical_history} onChange={(v) => setData('medical_history', v)} />
                    <MobileInput label="Kelainan Jasmani / Catatan Khusus" value={data.special_condition} onChange={(v) => setData('special_condition', v)} />
                  </div>
                </MobileCard>

                {/* Prestasi & Beasiswa */}
                <MobileCard title="Prestasi & Beasiswa" icon={Award}>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                    Prestasi Siswa
                  </div>
                  <MobileInput label="Nama Lomba / Prestasi" value={data.achievement_name} onChange={(v) => setData('achievement_name', v)} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Tingkat Prestasi" value={data.achievement_level} onChange={(v) => setData('achievement_level', v)} />
                    <MobileInput label="Peringkat / Juara" value={data.achievement_rank} onChange={(v) => setData('achievement_rank', v)} />
                  </div>
                  <MobileInput label="Tahun Perolehan" value={data.achievement_year} onChange={(v) => setData('achievement_year', v)} />

                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1 pt-2">
                    Beasiswa yang Diterima
                  </div>
                  <MobileInput label="Nama / Sumber Beasiswa" value={data.scholarship_desc} onChange={(v) => setData('scholarship_desc', v)} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Tahun Mulai" value={data.scholarship_start_year} onChange={(v) => setData('scholarship_start_year', v)} />
                    <MobileInput label="Tahun Selesai" value={data.scholarship_end_year} onChange={(v) => setData('scholarship_end_year', v)} />
                  </div>
                </MobileCard>

                {/* Akhir Pendidikan */}
                <MobileCard title="Kelulusan / Akhir Pendidikan" icon={GraduationCap}>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileSelect
                      label="Status Kelulusan"
                      value={data.graduation_status}
                      onChange={(v) => setData('graduation_status', v)}
                      options={[
                        { label: 'LULUS', value: 'LULUS' },
                        { label: 'BELUM LULUS', value: 'BELUM LULUS' },
                        { label: 'MASIH AKTIF', value: 'MASIH AKTIF' },
                      ]}
                    />
                    <MobileInput label="Tahun Lulus" value={data.graduation_year} onChange={(v) => setData('graduation_year', v)} />
                  </div>
                  <MobileInput label="Nomor Ijazah SMK" value={data.graduation_cert_no} onChange={(v) => setData('graduation_cert_no', v)} />
                  <MobileInput label="Nomor SKHUS / Surat Keterangan" value={data.graduation_skhus_no} onChange={(v) => setData('graduation_skhus_no', v)} />
                  <MobileInput label="Melanjutkan ke Perguruan Tinggi" value={data.university_continuation} onChange={(v) => setData('university_continuation', v)} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput label="Pindah ke Sekolah" value={data.transfer_school} onChange={(v) => setData('transfer_school', v)} />
                    <MobileInput label="Alasan Keluar Sekolah" value={data.drop_out_reason} onChange={(v) => setData('drop_out_reason', v)} />
                  </div>
                </MobileCard>
              </div>
            )}

            {/* TAB 3: RAPOR SEMESTER */}
            {mobileTab === 'rapor' && (
              <div className="space-y-4">
                {/* Semester Picker Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-[11px] font-bold">
                  {[
                    { key: 'scores_x1', label: 'X - Smt 1' },
                    { key: 'scores_x2', label: 'X - Smt 2' },
                    { key: 'scores_xi1', label: 'XI - Smt 3' },
                    { key: 'scores_xi2', label: 'XI - Smt 4' },
                    { key: 'scores_xii1', label: 'XII - Smt 5' },
                    { key: 'scores_xii2', label: 'XII - Smt 6' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setMobileRaporSem(s.key as any)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl shrink-0 transition",
                        mobileRaporSem === s.key
                          ? "bg-blue-600 text-white shadow-xs font-extrabold"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Identitas Rombel & Semester Terpilih */}
                <MobileCard title={`Identitas ${currentSemMeta.title}`} icon={BookOpen} badge="Kurikulum Merdeka">
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput 
                      label="Kelas / Rombel" 
                      value={(data as any)[currentSemMeta.classKey]} 
                      onChange={(v) => setData(currentSemMeta.classKey as any, v)} 
                    />
                    <MobileInput 
                      label="Fase Pembelajaran" 
                      value={(data as any)[currentSemMeta.faseKey]} 
                      onChange={(v) => setData(currentSemMeta.faseKey as any, v)} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput 
                      label="Tahun Pelajaran" 
                      value={(data as any)[currentSemMeta.tpKey]} 
                      onChange={(v) => setData(currentSemMeta.tpKey as any, v)} 
                    />
                    <MobileInput 
                      label="Semester" 
                      value={(data as any)[currentSemMeta.semKey]} 
                      onChange={(v) => setData(currentSemMeta.semKey as any, v)} 
                    />
                  </div>
                </MobileCard>

                {/* Presensi Semester Terpilih */}
                <MobileCard title="Presensi & Ketidakhadiran" icon={Calendar} badge="Semester Ini">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                      <span className="block text-[10px] font-bold text-amber-700 dark:text-amber-400">Sakit (S)</span>
                      <input
                        type="number"
                        min="0"
                        value={
                          mobileRaporSem === 'scores_x1' ? data.sick_x_1 :
                          mobileRaporSem === 'scores_x2' ? data.sick_x_2 :
                          mobileRaporSem === 'scores_xi1' ? data.sick_xi_1 :
                          mobileRaporSem === 'scores_xi2' ? data.sick_xi_2 :
                          mobileRaporSem === 'scores_xii1' ? data.sick_xii_1 : data.sick_xii_2
                        }
                        onChange={(e) => {
                          const v = Math.max(0, parseInt(e.target.value) || 0);
                          const k = mobileRaporSem === 'scores_x1' ? 'sick_x_1' :
                                    mobileRaporSem === 'scores_x2' ? 'sick_x_2' :
                                    mobileRaporSem === 'scores_xi1' ? 'sick_xi_1' :
                                    mobileRaporSem === 'scores_xi2' ? 'sick_xi_2' :
                                    mobileRaporSem === 'scores_xii1' ? 'sick_xii_1' : 'sick_xii_2';
                          setData(k as any, v);
                        }}
                        className="w-full text-center font-mono font-bold text-sm bg-transparent border-none focus:outline-none mt-1"
                      />
                      <span className="text-[10px] text-amber-600/70">hari</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                      <span className="block text-[10px] font-bold text-blue-700 dark:text-blue-400">Izin (I)</span>
                      <input
                        type="number"
                        min="0"
                        value={
                          mobileRaporSem === 'scores_x1' ? data.permit_x_1 :
                          mobileRaporSem === 'scores_x2' ? data.permit_x_2 :
                          mobileRaporSem === 'scores_xi1' ? data.permit_xi_1 :
                          mobileRaporSem === 'scores_xi2' ? data.permit_xi_2 :
                          mobileRaporSem === 'scores_xii1' ? data.permit_xii_1 : data.permit_xii_2
                        }
                        onChange={(e) => {
                          const v = Math.max(0, parseInt(e.target.value) || 0);
                          const k = mobileRaporSem === 'scores_x1' ? 'permit_x_1' :
                                    mobileRaporSem === 'scores_x2' ? 'permit_x_2' :
                                    mobileRaporSem === 'scores_xi1' ? 'permit_xi_1' :
                                    mobileRaporSem === 'scores_xi2' ? 'permit_xi_2' :
                                    mobileRaporSem === 'scores_xii1' ? 'permit_xii_1' : 'permit_xii_2';
                          setData(k as any, v);
                        }}
                        className="w-full text-center font-mono font-bold text-sm bg-transparent border-none focus:outline-none mt-1"
                      />
                      <span className="text-[10px] text-blue-600/70">hari</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                      <span className="block text-[10px] font-bold text-rose-700 dark:text-rose-400">Alpha (A)</span>
                      <input
                        type="number"
                        min="0"
                        value={
                          mobileRaporSem === 'scores_x1' ? data.unexcused_x_1 :
                          mobileRaporSem === 'scores_x2' ? data.unexcused_x_2 :
                          mobileRaporSem === 'scores_xi1' ? data.unexcused_xi_1 :
                          mobileRaporSem === 'scores_xi2' ? data.unexcused_xi_2 :
                          mobileRaporSem === 'scores_xii1' ? data.unexcused_xii_1 : data.unexcused_xii_2
                        }
                        onChange={(e) => {
                          const v = Math.max(0, parseInt(e.target.value) || 0);
                          const k = mobileRaporSem === 'scores_x1' ? 'unexcused_x_1' :
                                    mobileRaporSem === 'scores_x2' ? 'unexcused_x_2' :
                                    mobileRaporSem === 'scores_xi1' ? 'unexcused_xi_1' :
                                    mobileRaporSem === 'scores_xi2' ? 'unexcused_xi_2' :
                                    mobileRaporSem === 'scores_xii1' ? 'unexcused_xii_1' : 'unexcused_xii_2';
                          setData(k as any, v);
                        }}
                        className="w-full text-center font-mono font-bold text-sm bg-transparent border-none focus:outline-none mt-1"
                      />
                      <span className="text-[10px] text-rose-600/70">hari</span>
                    </div>
                  </div>
                </MobileCard>

                {/* Daftar Nilai Mata Pelajaran */}
                <MobileCard 
                  title={`Daftar Nilai (${(data as any)[mobileRaporSem]?.length || 0} Mapel)`} 
                  icon={Award}
                  badge={`Rata-rata: ${calcAvg((data as any)[mobileRaporSem])}`}
                >
                  <div className="space-y-3">
                    {((data as any)[mobileRaporSem] || []).map((sub: any, idx: number) => {
                      const isBelowKktp = Number(sub.score) < Number(sub.kktp);
                      return (
                        <div 
                          key={idx} 
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                              {idx + 1}. {sub.name}
                            </span>
                            {sub.score && (
                              <span className={cn(
                                "text-xs font-mono font-black px-2 py-0.5 rounded-lg shrink-0",
                                isBelowKktp 
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              )}>
                                {sub.score}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">KKTP</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={sub.kktp ?? ''}
                                onChange={(e) => handleScoreChange(mobileRaporSem, idx, 'kktp', e.target.value)}
                                className="w-full text-center py-1 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nilai Akhir</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={sub.score ?? ''}
                                onChange={(e) => handleScoreChange(mobileRaporSem, idx, 'score', e.target.value)}
                                className="w-full text-center py-1 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Capaian Kompetensi</label>
                            <textarea
                              rows={2}
                              value={sub.comp ?? ''}
                              onChange={(e) => handleScoreChange(mobileRaporSem, idx, 'comp', e.target.value)}
                              placeholder="Deskripsi pencapaian kompetensi..."
                              className="w-full p-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ringkasan Skor */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">Total Nilai Kumulatif :</span>
                    <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">
                      {calcSum((data as any)[mobileRaporSem])}
                    </span>
                  </div>
                </MobileCard>

                {/* Aspek C: Projek Penguatan Profil Pelajar Pancasila (P5) */}
                {(() => {
                  const semKeySuffix = mobileRaporSem.replace('scores_', '');
                  const p5Dims = (data as any)[`p5_dimensions_${semKeySuffix}`] || [];
                  const extras = (data as any)[`extras_${semKeySuffix}`] || [];
                  const achs = (data as any)[`achievements_${semKeySuffix}`] || [];

                  return (
                    <>
                      {/* C. P5 Card */}
                      <MobileCard title="C. Projek Penguatan Profil Pelajar Pancasila (P5)" icon={Sparkles} badge="Kurikulum Merdeka">
                        <div className="space-y-3">
                          <div className="space-y-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Tema Projek Semester Ini:</span>
                            <MobileInput
                              label="Tema 1"
                              value={(data as any)[`p5_theme_1_${semKeySuffix}`] || ''}
                              onChange={(v) => setData(`p5_theme_1_${semKeySuffix}` as any, v)}
                              placeholder="Tema 1 Projek P5..."
                            />
                            <MobileInput
                              label="Tema 2"
                              value={(data as any)[`p5_theme_2_${semKeySuffix}`] || ''}
                              onChange={(v) => setData(`p5_theme_2_${semKeySuffix}` as any, v)}
                              placeholder="Tema 2 Projek P5..."
                            />
                            <MobileInput
                              label="Tema 3"
                              value={(data as any)[`p5_theme_3_${semKeySuffix}`] || ''}
                              onChange={(v) => setData(`p5_theme_3_${semKeySuffix}` as any, v)}
                              placeholder="Tema 3 Projek P5..."
                            />
                          </div>

                          <div className="space-y-2.5">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Penilaian 6 Dimensi P5:</span>
                            {p5Dims.map((dim: any, dIdx: number) => (
                              <div key={dIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                  {dIdx + 1}. {dim.dimensi}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Elemen</label>
                                    <input
                                      type="text"
                                      value={dim.elemen}
                                      onChange={(e) => handleP5DimChange(`p5_dimensions_${semKeySuffix}`, dIdx, 'elemen', e.target.value)}
                                      placeholder="Elemen..."
                                      className="neu-field-slot w-full px-2 py-1 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Sub-Elemen</label>
                                    <input
                                      type="text"
                                      value={dim.sub_elemen}
                                      onChange={(e) => handleP5DimChange(`p5_dimensions_${semKeySuffix}`, dIdx, 'sub_elemen', e.target.value)}
                                      placeholder="Sub-elemen..."
                                      className="neu-field-slot w-full px-2 py-1 text-xs"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Target Fase / Capaian</label>
                                  <select
                                    value={dim.target}
                                    onChange={(e) => handleP5DimChange(`p5_dimensions_${semKeySuffix}`, dIdx, 'target', e.target.value)}
                                    className="neu-field-slot w-full px-2 py-1.5 text-xs font-semibold"
                                  >
                                    <option value="-">- Belum Dinilai -</option>
                                    <option value="Mulai berkembang">Mulai berkembang</option>
                                    <option value="Sedang berkembang">Sedang berkembang</option>
                                    <option value="Berkembang Sesuai Harapan">Berkembang Sesuai Harapan</option>
                                    <option value="Sangat Berkembang">Sangat Berkembang</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </MobileCard>

                      {/* D. Ekstrakurikuler Card */}
                      <MobileCard title="D. Kegiatan Ekstrakurikuler" icon={Award} badge="Bisa Diedit">
                        <div className="space-y-3">
                          {extras.map((ext: any, eIdx: number) => (
                            <div key={eIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Ekstrakurikuler #{eIdx + 1}
                              </div>
                              <input
                                type="text"
                                value={ext.name}
                                onChange={(e) => handleExtraChange(`extras_${semKeySuffix}`, eIdx, 'name', e.target.value)}
                                placeholder="Nama Ekstrakurikuler (contoh: Pramuka)..."
                                className="neu-field-slot w-full px-2.5 py-1.5 text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={ext.notes}
                                onChange={(e) => handleExtraChange(`extras_${semKeySuffix}`, eIdx, 'notes', e.target.value)}
                                placeholder="Keterangan capaian / predikat..."
                                className="neu-field-slot w-full px-2.5 py-1.5 text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </MobileCard>

                      {/* E. Prestasi Card */}
                      <MobileCard title="E. Prestasi & Penghargaan" icon={Trophy} badge="Bisa Diedit">
                        <div className="space-y-3">
                          {achs.map((ach: any, aIdx: number) => (
                            <div key={aIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2">
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Prestasi #{aIdx + 1}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={ach.name}
                                  onChange={(e) => handleAchievementChange(`achievements_${semKeySuffix}`, aIdx, 'name', e.target.value)}
                                  placeholder="Nama Prestasi / Lomba..."
                                  className="neu-field-slot col-span-2 px-2.5 py-1.5 text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  value={ach.type}
                                  onChange={(e) => handleAchievementChange(`achievements_${semKeySuffix}`, aIdx, 'type', e.target.value)}
                                  placeholder="Jenis (Akademik / Seni)..."
                                  className="neu-field-slot px-2 py-1 text-xs"
                                />
                                <input
                                  type="text"
                                  value={ach.level}
                                  onChange={(e) => handleAchievementChange(`achievements_${semKeySuffix}`, aIdx, 'level', e.target.value)}
                                  placeholder="Tingkat (Sekolah / Kota)..."
                                  className="neu-field-slot px-2 py-1 text-xs"
                                />
                                <input
                                  type="text"
                                  value={ach.year}
                                  onChange={(e) => handleAchievementChange(`achievements_${semKeySuffix}`, aIdx, 'year', e.target.value)}
                                  placeholder="Tahun..."
                                  className="neu-field-slot px-2 py-1 text-xs font-mono"
                                />
                                <input
                                  type="text"
                                  value={ach.rank}
                                  onChange={(e) => handleAchievementChange(`achievements_${semKeySuffix}`, aIdx, 'rank', e.target.value)}
                                  placeholder="Peringkat (Juara 1)..."
                                  className="neu-field-slot px-2 py-1 text-xs"
                                />
                                <input
                                  type="text"
                                  value={ach.organizer}
                                  onChange={(e) => handleAchievementChange(`achievements_${semKeySuffix}`, aIdx, 'organizer', e.target.value)}
                                  placeholder="Penyelenggara..."
                                  className="neu-field-slot col-span-2 px-2 py-1 text-xs"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </MobileCard>
                    </>
                  );
                })()}

                {/* Kenaikan Kelas (Bila Semester Genap) */}
                {mobileRaporSem === 'scores_x2' && (
                  <MobileCard title="Keputusan Kenaikan Kelas X" icon={GraduationCap}>
                    <MobileInput
                      label="Keterangan Kenaikan"
                      value={data.promotion_x_genap}
                      onChange={(v) => setData('promotion_x_genap', v)}
                      placeholder="Contoh: Naik ke Kelas XI PPLG 2"
                    />
                  </MobileCard>
                )}

                {mobileRaporSem === 'scores_xi2' && (
                  <MobileCard title="Keputusan Kenaikan Kelas XI" icon={GraduationCap}>
                    <MobileInput
                      label="Keterangan Kenaikan"
                      value={data.promotion_xi_genap}
                      onChange={(v) => setData('promotion_xi_genap', v)}
                      placeholder="Contoh: Naik ke Kelas XII PPLG 2"
                    />
                  </MobileCard>
                )}

                {/* Pengesahan Rapor Semester Ini */}
                <MobileCard title={`Pengesahan Rapor — ${currentSemMeta.title}`} icon={UserCheck} badge="Tanda Tangan Resmi">
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Kepala SMK Negeri 1 Beringin</span>
                      </div>
                      <MobileInput 
                        label="Nama Lengkap Kepala Sekolah" 
                        value={data.principal_name} 
                        onChange={(v) => setData('principal_name', v)} 
                      />
                      <MobileInput 
                        label="NIP Kepala Sekolah" 
                        value={data.principal_nip} 
                        onChange={(v) => setData('principal_nip', v)} 
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>{currentSemMeta.waliLabel}</span>
                      </div>
                      <MobileInput 
                        label={`Nama Lengkap ${currentSemMeta.waliLabel}`} 
                        value={(data as any)[currentSemMeta.waliNameKey]} 
                        onChange={(v) => setData(currentSemMeta.waliNameKey as any, v)} 
                      />
                      <MobileInput 
                        label={`NIP ${currentSemMeta.waliLabel}`} 
                        value={(data as any)[currentSemMeta.waliNipKey]} 
                        onChange={(v) => setData(currentSemMeta.waliNipKey as any, v)} 
                      />
                    </div>
                  </div>
                </MobileCard>
              </div>
            )}

            {/* TAB 4: REKAP NILAI 6 SEMESTER */}
            {mobileTab === 'rekap' && (
              <div className="space-y-4">
                {/* Identitas Transkrip Kumulatif */}
                <MobileCard title="Identitas Transkrip Master Kumulatif" icon={BookOpen} badge="Transkrip 6 Smt">
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput 
                      label="Kelas Tingkat Akhir" 
                      value={data.class_transkrip} 
                      onChange={(v) => setData('class_transkrip', v)} 
                    />
                    <MobileInput 
                      label="Fase Pembelajaran" 
                      value={data.fase_transkrip} 
                      onChange={(v) => setData('fase_transkrip', v)} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <MobileInput 
                      label="Rentang Tahun Pelajaran" 
                      value={data.tahun_pelajaran_transkrip} 
                      onChange={(v) => setData('tahun_pelajaran_transkrip', v)} 
                    />
                    <MobileInput 
                      label="Keterangan Semester" 
                      value={data.semester_transkrip} 
                      onChange={(v) => setData('semester_transkrip', v)} 
                    />
                  </div>
                </MobileCard>

                <MobileCard title="Master Transkrip Rekapitulasi 6 Semester" icon={FileSpreadsheet} badge="Kumulatif">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Rekapitulasi seluruh capaian nilai rapor siswa dari Semester 1 s.d. 6. Transkrip ini tersinkronisasi otomatis untuk lembar terakhir buku induk fisik A4.
                  </p>

                  <div className="space-y-2 pt-2">
                    {[
                      { name: 'Semester 1 (Kelas X - Ganjil)', avg: calcAvg(data.scores_x1) },
                      { name: 'Semester 2 (Kelas X - Genap)', avg: calcAvg(data.scores_x2) },
                      { name: 'Semester 3 (Kelas XI - Ganjil)', avg: calcAvg(data.scores_xi1) },
                      { name: 'Semester 4 (Kelas XI - Genap)', avg: calcAvg(data.scores_xi2) },
                      { name: 'Semester 5 (Kelas XII - Ganjil)', avg: calcAvg(data.scores_xii1) },
                      { name: 'Semester 6 (Kelas XII - Genap)', avg: calcAvg(data.scores_xii2) },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{row.name}</span>
                        <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950">
                          {row.avg}
                        </span>
                      </div>
                    ))}
                  </div>
                </MobileCard>

                {/* Pengesahan Transkrip Master */}
                <MobileCard title="Pengesahan Transkrip Master (Halaman Terakhir)" icon={UserCheck} badge="Tanda Tangan Resmi">
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Kepala SMK Negeri 1 Beringin</span>
                      </div>
                      <MobileInput 
                        label="Nama Lengkap Kepala Sekolah" 
                        value={data.principal_name} 
                        onChange={(v) => setData('principal_name', v)} 
                      />
                      <MobileInput 
                        label="NIP Kepala Sekolah" 
                        value={data.principal_nip} 
                        onChange={(v) => setData('principal_nip', v)} 
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Wali Kelas Tingkat Akhir (Kelas XII)</span>
                      </div>
                      <MobileInput 
                        label="Nama Lengkap Wali Kelas XII" 
                        value={data.wali_xii_name} 
                        onChange={(v) => setData('wali_xii_name', v)} 
                      />
                      <MobileInput 
                        label="NIP Wali Kelas XII" 
                        value={data.wali_xii_nip} 
                        onChange={(v) => setData('wali_xii_nip', v)} 
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <a
                      href={`/reports/buku-induk/${student.id}?print=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Master Transkrip Lengkap (A4)</span>
                    </a>
                  </div>
                </MobileCard>
              </div>
            )}

            {/* Mobile Primary Save Button at Bottom */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={processing}
                className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{processing ? 'Menyimpan Perubahan...' : 'Simpan Semua Data Siswa'}</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. DESKTOP & PRINT PAPER VIEW (TAMPILAN KERTAS ASLI DOKUMEN)   */}
          {/* ============================================================== */}
          <div className="hidden md:block print:block max-w-[215mm] mx-auto font-serif space-y-8">

          {/* ------------------------------------------------------------ */}
          {/* 1. LEMBAR 1: BIODATA PESERTA DIDIK & ORANG TUA / WALI        */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'lembar1') && (
            <div className="bg-white p-8 border border-slate-400">
              <div className="flex gap-4 items-start mb-2">
                <div className="flex-1 space-y-1 text-[11px] pt-1">
                  <div className="grid grid-cols-[165px_1fr_150px_1fr] items-baseline gap-1">
                    <span className="text-slate-800">Nomor Induk Siswa</span>
                    <input 
                      type="text"
                      value={data.nis} 
                      onChange={(e) => setData('nis', e.target.value)}
                      className="font-bold font-mono text-[11px] border-b border-dotted border-slate-400 px-1 py-0.5 bg-transparent"
                    />
                    <span className="text-slate-800 pl-2">Nomor Kode Kecamatan</span>
                    <input
                      type="text"
                      value={data.kode_kecamatan}
                      onChange={(e) => setData('kode_kecamatan', e.target.value)}
                      className="font-bold font-mono text-[11px] border-b border-dotted border-slate-400 px-1 py-0.5 bg-transparent w-20"
                    />
                  </div>

                  <div className="grid grid-cols-[165px_1fr_150px_1fr] items-baseline gap-1">
                    <span className="text-slate-800">Nomor Induk Siswa Nasional</span>
                    <input 
                      type="text"
                      value={data.nisn} 
                      onChange={(e) => setData('nisn', e.target.value)}
                      className="font-bold font-mono text-[11px] border-b border-dotted border-slate-400 px-1 py-0.5 bg-transparent"
                    />
                    <span className="text-slate-800 pl-2">Nomor Kode Kab/kota</span>
                    <input
                      type="text"
                      value={data.kode_kabupaten}
                      onChange={(e) => setData('kode_kabupaten', e.target.value)}
                      className="font-bold font-mono text-[11px] border-b border-dotted border-slate-400 px-1 py-0.5 bg-transparent w-20"
                    />
                  </div>

                  <div className="grid grid-cols-[165px_1fr_150px_1fr] items-baseline gap-1">
                    <span className="text-slate-800">Nomor Kode Sekolah</span>
                    <input
                      type="text"
                      value={data.kode_sekolah}
                      onChange={(e) => setData('kode_sekolah', e.target.value)}
                      className="font-bold font-mono text-[11px] border-b border-dotted border-slate-400 px-1 py-0.5 bg-transparent w-28"
                    />
                    <span className="text-slate-800 pl-2">Nomor Kode Provinsi</span>
                    <input
                      type="text"
                      value={data.kode_provinsi}
                      onChange={(e) => setData('kode_provinsi', e.target.value)}
                      className="font-bold font-mono text-[11px] border-b border-dotted border-slate-400 px-1 py-0.5 bg-transparent w-20"
                    />
                  </div>
                </div>

                <div className="w-24 text-center shrink-0">
                  <span className="text-[10px] text-slate-800 block mb-0.5">Nomor Urut :</span>
                  <input
                    type="text"
                    value={data.nomor_urut}
                    onChange={(e) => setData('nomor_urut', e.target.value)}
                    className="border border-slate-900 w-full h-10 text-center font-mono font-bold text-lg bg-slate-50"
                  />
                </div>
              </div>

              <div className="text-center py-2.5 border-y-2 border-double border-slate-900 my-2">
                <h2 className="text-base font-extrabold tracking-wider uppercase text-slate-950">
                  LEMBAR BUKU INDUK PESERTA DIDIK
                </h2>
                <p className="text-xs font-semibold text-slate-700 tracking-wide mt-0.5">
                  SEKOLAH MENENGAH KEJURUAN (SMK) NEGERI 1 BERINGIN
                </p>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-1 min-w-0 space-y-2 text-slate-950">
                  <div>
                    <div className="text-[11.5px] font-bold uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                      A. KETERANGAN TENTANG DIRI PESERTA DIDIK
                    </div>
                    <div className="space-y-[1px]">
                      <PaperDottedRow label="1. Nama Lengkap Peserta Didik" value={data.name} onChange={(v) => setData('name', v)} />
                      <PaperDottedRow label="2. Nama Panggilan" value={data.nickname} onChange={(v) => setData('nickname', v)} />
                      <PaperDottedRow label="3. Jenis Kelamin" value={data.gender} onChange={(v) => setData('gender', v as any)} />
                      <PaperDottedRow label="4. Tempat dan Tanggal Lahir" value={`${data.birth_place || ''}${data.birth_place && data.birth_date ? ', ' : ''}${data.birth_date || ''}`} onChange={(v) => {
                        const parts = v.split(',');
                        if (parts[0]) setData('birth_place', parts[0].trim());
                        if (parts[1]) setData('birth_date', parts[1].trim());
                      }} />
                      <PaperDottedRow label="5. Agama" value={data.religion} onChange={(v) => setData('religion', v)} />
                      <PaperDottedRow label="6. Kewarganegaraan" value={data.citizenship} onChange={(v) => setData('citizenship', v)} />
                      <PaperDottedRow label="7. Anak ke berapa" value={data.child_order} onChange={(v) => setData('child_order', v)} />
                      <PaperDottedRow label="8. Jumlah Saudara Kandung" value={data.siblings_count !== '' && data.siblings_count !== null && data.siblings_count !== undefined ? `${data.siblings_count} ORANG` : ''} onChange={(v) => setData('siblings_count', Number(v.replace(/\D/g, '')) || 0)} />
                      <PaperDottedRow label="   Jumlah Saudara Tiri / Angkat" value={`${data.step_siblings_count || 0} / ${data.foster_siblings_count || 0} ORANG`} sub onChange={(v) => {
                        const p = v.split('/');
                        setData('step_siblings_count', Number(p[0]?.replace(/\D/g, '')) || 0);
                        setData('foster_siblings_count', Number(p[1]?.replace(/\D/g, '')) || 0);
                      }} />
                      <PaperDottedRow label="9. Anak Yatim / Piatu / Yatim Piatu" value="-" />
                      <PaperDottedRow label="10. Bahasa Sehari-hari di Rumah" value={data.daily_language} onChange={(v) => setData('daily_language', v)} />
                    </div>
                  </div>

                  <div>
                    <div className="text-[11.5px] font-bold uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                      B. KETERANGAN TEMPAT TINGGAL
                    </div>
                    <div className="space-y-[1px]">
                      <PaperDottedRow label="11. Alamat Tempat Tinggal" value={data.address} onChange={(v) => setData('address', v)} />
                      <PaperDottedRow label="    RT / RW" value={data.rt_rw} sub onChange={(v) => setData('rt_rw', v)} />
                      <PaperDottedRow label="    Kelurahan / Desa" value={data.village} sub onChange={(v) => setData('village', v)} />
                      <PaperDottedRow label="    Kecamatan" value={data.district} sub onChange={(v) => setData('district', v)} />
                      <PaperDottedRow label="    Kabupaten / Kota" value={data.regency} sub onChange={(v) => setData('regency', v)} />
                      <PaperDottedRow label="    Provinsi" value={data.province} sub onChange={(v) => setData('province', v)} />
                      <PaperDottedRow label="    Kode Pos / Nomor Telepon" value={data.postal_code || data.phone ? `${data.postal_code || ''} / ${data.phone || ''}` : ''} sub onChange={(v) => {
                        const p = v.split('/');
                        setData('postal_code', p[0]?.trim());
                        setData('phone', p[1]?.trim());
                      }} />
                      <PaperDottedRow label="12. Tinggal dengan Siapa" value={data.residence_type} onChange={(v) => setData('residence_type', v)} />
                      <PaperDottedRow label="13. Jarak Tempat Tinggal ke Sekolah" value={data.distance_to_school} onChange={(v) => setData('distance_to_school', v)} />
                    </div>
                  </div>

                  <div>
                    <div className="text-[11.5px] font-bold uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                      C. KETERANGAN ORANG TUA KANDUNG
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 min-w-0">
                      <div className="space-y-[1px] min-w-0">
                        <div className="font-bold text-[11px] underline text-slate-900 mb-0.5">Ayah Kandung :</div>
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="14. Nama Ayah" value={data.father_name} onChange={(v) => setData('father_name', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="15. Tempat & Tgl Lahir" value={data.father_birth_place_date} onChange={(v) => setData('father_birth_place_date', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="16. Agama" value={data.father_religion} onChange={(v) => setData('father_religion', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="17. Kewarganegaraan" value={data.father_citizenship} onChange={(v) => setData('father_citizenship', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="18. Pendidikan Tertinggi" value={data.father_education} onChange={(v) => setData('father_education', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="19. Pekerjaan" value={data.father_job} onChange={(v) => setData('father_job', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="20. Penghasilan Per Bulan" value={data.father_income} onChange={(v) => setData('father_income', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="21. No. HP Ayah" value={data.father_phone} onChange={(v) => setData('father_phone', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="22. Masih Hidup / Meninggal" value={data.father_alive} onChange={(v) => setData('father_alive', v)} />
                      </div>

                      <div className="space-y-[1px] min-w-0">
                        <div className="font-bold text-[11px] underline text-slate-900 mb-0.5">Ibu Kandung :</div>
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="23. Nama Ibu" value={data.mother_name} onChange={(v) => setData('mother_name', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="24. Tempat & Tgl Lahir" value={data.mother_birth_place_date} onChange={(v) => setData('mother_birth_place_date', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="25. Agama" value={data.mother_religion} onChange={(v) => setData('mother_religion', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="26. Kewarganegaraan" value={data.mother_citizenship} onChange={(v) => setData('mother_citizenship', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="27. Pendidikan Tertinggi" value={data.mother_education} onChange={(v) => setData('mother_education', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="28. Pekerjaan" value={data.mother_job} onChange={(v) => setData('mother_job', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="29. Penghasilan Per Bulan" value={data.mother_income} onChange={(v) => setData('mother_income', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="30. No. HP Ibu" value={data.mother_phone} onChange={(v) => setData('mother_phone', v)} />
                        <PaperDottedRow labelWidth="w-[125px] shrink-0" label="31. Masih Hidup / Meninggal" value={data.mother_alive} onChange={(v) => setData('mother_alive', v)} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11.5px] font-bold uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                      D. KETERANGAN TENTANG WALI
                    </div>
                    <div className="space-y-[1px]">
                      <PaperDottedRow label="32. Nama Lengkap Wali" value={data.guardian_name} onChange={(v) => setData('guardian_name', v)} />
                      <PaperDottedRow label="33. Pekerjaan Wali" value={data.guardian_job} onChange={(v) => setData('guardian_job', v)} />
                      <PaperDottedRow label="34. Hubungan dengan Peserta Didik" value={data.guardian_relation} onChange={(v) => setData('guardian_relation', v)} />
                    </div>
                  </div>

                  <div>
                    <div className="text-[11.5px] font-bold uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                      E. PERKEMBANGAN PESERTA DIDIK
                    </div>
                    <div className="space-y-[1px]">
                      <PaperDottedRow label="35. Pendidikan Sebelumnya (SMP)" value={data.previous_school_name} onChange={(v) => setData('previous_school_name', v)} />
                      <PaperDottedRow label="36. Tanggal dan Nomor Ijazah SMP" value={`${data.previous_school_certificate_date || ''}${data.previous_school_certificate_date && data.previous_school_certificate ? ', ' : ''}${data.previous_school_certificate || ''}`} onChange={(v) => {
                        const p = v.split(',');
                        setData('previous_school_certificate_date', p[0]?.trim());
                        setData('previous_school_certificate', p[1]?.trim());
                      }} />
                      <PaperDottedRow label="37. Diterima di SMK Negeri 1 Beringin" value={data.admission_info} onChange={(v) => setData('admission_info', v)} />
                    </div>
                  </div>
                </div>

                {/* Kolom Pas Foto Fisik 3x4 (Sesuai Format Fisik Buku Induk SMKN 1 Beringin) */}
                <div className="w-[32mm] shrink-0 flex flex-col items-center gap-3 pt-0.5 select-none">
                  {/* Box 1: Saat Masuk / Kelas X */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[30mm] h-[40mm] border border-slate-900 bg-white flex flex-col items-center justify-center p-1 shadow-xs">
                      <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider">Pas Foto</span>
                      <span className="text-[8px] text-slate-500">Ukuran</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900">3 x 4</span>
                      <span className="text-[7.5px] text-slate-500 mt-1 font-sans">(Saat Masuk)</span>
                    </div>
                    <p className="text-[7px] text-center text-slate-600 leading-tight w-[30mm] mt-1 font-serif">
                      Cap tiga jari tengah mengenai pas photo bagian bawah
                    </p>
                  </div>

                  {/* Box 2: Naik Kelas XI */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[30mm] h-[40mm] border border-slate-900 bg-white flex flex-col items-center justify-center p-1 shadow-xs">
                      <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider">Pas Foto</span>
                      <span className="text-[8px] text-slate-500">Ukuran</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900">3 x 4</span>
                      <span className="text-[7.5px] text-slate-500 mt-1 font-sans">(Kelas XI)</span>
                    </div>
                    <p className="text-[7px] text-center text-slate-600 leading-tight w-[30mm] mt-1 font-serif">
                      Cap tiga jari tengah mengenai pas photo bagian bawah
                    </p>
                  </div>

                  {/* Box 3: Naik Kelas XII */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[30mm] h-[40mm] border border-slate-900 bg-white flex flex-col items-center justify-center p-1 shadow-xs">
                      <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider">Pas Foto</span>
                      <span className="text-[8px] text-slate-500">Ukuran</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900">3 x 4</span>
                      <span className="text-[7.5px] text-slate-500 mt-1 font-sans">(Kelas XII)</span>
                    </div>
                    <p className="text-[7px] text-center text-slate-600 leading-tight w-[30mm] mt-1 font-serif">
                      Cap tiga jari tengah mengenai pas photo bagian bawah
                    </p>
                  </div>

                  {/* Box 4: Lulus / Ijazah */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[30mm] h-[40mm] border border-slate-900 bg-white flex flex-col items-center justify-center p-1 shadow-xs">
                      <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider">Pas Foto</span>
                      <span className="text-[8px] text-slate-500">Ukuran</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900">3 x 4</span>
                      <span className="text-[7.5px] text-slate-500 mt-1 font-sans">(Ijazah)</span>
                    </div>
                    <p className="text-[7px] text-center text-slate-600 leading-tight w-[30mm] mt-1 font-serif">
                      Cap tiga jari tengah mengenai pas photo bagian bawah
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 2. LEMBAR 2: JASMANI 6 SMT, PRESTASI, BEASISWA               */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'lembar2') && (
            <div className="bg-white p-8 border border-slate-400">
              <div className="text-center py-2.5 border-y-2 border-double border-slate-900 mb-4">
                <h2 className="text-base font-extrabold tracking-wider uppercase text-slate-950">
                  LEMBAR BUKU INDUK PESERTA DIDIK (LANJUTAN)
                </h2>
                <p className="text-xs font-semibold text-slate-700">
                  PERKEMBANGAN JASMANI, PRESTASI, DAN BEASISWA PESERTA DIDIK
                </p>
              </div>

              {/* D. MENINGGALKAN SEKOLAH */}
              <div className="mb-4">
                <div className="text-[11.5px] font-bold text-slate-950 uppercase border-b border-slate-800 pb-0.5 mb-2">
                  D. MENINGGALKAN SEKOLAH
                </div>
                <div className="space-y-1">
                  <PaperDottedRow label="21. Tamat Belajar / Lulus Tahun" value={data.graduation_year} onChange={(v) => setData('graduation_year', v)} />
                  <PaperDottedRow label="    Nomor Ijazah / STTB" value={data.graduation_cert_no} onChange={(v) => setData('graduation_cert_no', v)} sub />
                  <PaperDottedRow label="    Melanjutkan ke Perguruan Tinggi" value={data.university_continuation} onChange={(v) => setData('university_continuation', v)} sub />
                  <PaperDottedRow label="22. Pindah Sekolah ke" value={data.transfer_school} onChange={(v) => setData('transfer_school', v)} />
                  <PaperDottedRow label="23. Keluar Sekolah / Alasan" value={data.drop_out_reason} onChange={(v) => setData('drop_out_reason', v)} />
                </div>
              </div>

              {/* E. LAIN-LAIN */}
              <div className="mb-4">
                <div className="text-[11.5px] font-bold text-slate-950 uppercase border-b border-slate-800 pb-0.5 mb-2">
                  E. LAIN-LAIN
                </div>
                <div className="text-[11px] font-bold text-slate-900 mb-1">
                  1. Tinggi dan Berat Badan Peserta Didik Selama 6 Semester
                </div>
                <table className="w-full border border-slate-900 text-[10px] text-center border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-100 font-bold">
                      <th rowSpan={2} className="border-r border-slate-900 p-1 w-8">No</th>
                      <th rowSpan={2} className="border-r border-slate-900 p-1 w-44">Aspek Yang Dinilai</th>
                      <th colSpan={2} className="border-r border-slate-900 p-1">Kelas X (2023/2024)</th>
                      <th colSpan={2} className="border-r border-slate-900 p-1">Kelas XI (2024/2025)</th>
                      <th colSpan={2} className="border-r border-slate-900 p-1">Kelas XII (2025/2026)</th>
                      <th rowSpan={2} className="p-1 w-24">Keterangan</th>
                    </tr>
                    <tr className="border-b border-slate-900 bg-slate-50 font-bold">
                      <th className="border-r border-slate-900 p-0.5 w-12">Ganjil</th>
                      <th className="border-r border-slate-900 p-0.5 w-12">Genap</th>
                      <th className="border-r border-slate-900 p-0.5 w-12">Ganjil</th>
                      <th className="border-r border-slate-900 p-0.5 w-12">Genap</th>
                      <th className="border-r border-slate-900 p-0.5 w-12">Ganjil</th>
                      <th className="border-r border-slate-900 p-0.5 w-12">Genap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    <tr>
                      <td className="border-r border-slate-900 p-1">1</td>
                      <td className="border-r border-slate-900 p-1 text-left font-medium">Tinggi Badan (cm)</td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.height_sem1} onChange={(e) => setData('height_sem1', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.height_sem2} onChange={(e) => setData('height_sem2', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.height_sem3} onChange={(e) => setData('height_sem3', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.height_sem4} onChange={(e) => setData('height_sem4', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.height_sem5} onChange={(e) => setData('height_sem5', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.height_sem6} onChange={(e) => setData('height_sem6', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="p-1 text-[9.5px]">{isSampleStudent ? 'Pertumbuhan Baik' : '-'}</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-1">2</td>
                      <td className="border-r border-slate-900 p-1 text-left font-medium">Berat Badan (kg)</td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.weight_sem1} onChange={(e) => setData('weight_sem1', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.weight_sem2} onChange={(e) => setData('weight_sem2', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.weight_sem3} onChange={(e) => setData('weight_sem3', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.weight_sem4} onChange={(e) => setData('weight_sem4', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.weight_sem5} onChange={(e) => setData('weight_sem5', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono">
                        <input type="number" value={data.weight_sem6} onChange={(e) => setData('weight_sem6', Number(e.target.value))} className="w-12 text-center" />
                      </td>
                      <td className="p-1 text-[9.5px]">{isSampleStudent ? 'Normal & Sehat' : '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan Buku Induk */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 text-center text-xs border-t border-slate-400">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-semibold">Wali Kelas X PPLG 2</p>
                  <div className="h-16"></div>
                  <input
                    type="text"
                    value={data.wali_x_name}
                    onChange={(e) => setData('wali_x_name', e.target.value)}
                    className="font-bold text-center border-b border-dotted border-slate-400 uppercase text-xs w-64 block mx-auto"
                  />
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span>NIP.</span>
                    <input
                      type="text"
                      value={data.wali_x_nip}
                      onChange={(e) => setData('wali_x_nip', e.target.value)}
                      className="font-mono text-[10px] border-b border-dotted border-slate-400 w-44"
                    />
                  </div>
                </div>

                <div>
                  <p>Beringin, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-semibold">Kepala SMK Negeri 1 Beringin</p>
                  <div className="h-16"></div>
                  <input
                    type="text"
                    value={data.principal_name}
                    onChange={(e) => setData('principal_name', e.target.value)}
                    className="font-bold text-center border-b border-dotted border-slate-400 uppercase text-xs w-64 block mx-auto"
                  />
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span>NIP.</span>
                    <input
                      type="text"
                      value={data.principal_nip}
                      onChange={(e) => setData('principal_nip', e.target.value)}
                      className="font-mono text-[10px] border-b border-dotted border-slate-400 w-44"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* Helper Component to Render Complete Physical Semester Report */}
          {/* ------------------------------------------------------------ */}

          {/* ============================================================== */}
          {/* COMPLETE PHYSICAL SEMESTER REPORTS (HALAMAN DEPAN & BELAKANG) */}
          {/* ============================================================== */}

          {/* ------------------------------------------------------------ */}
          {/* 3. RAPOR KELAS X SEMESTER 1 GANJIL (FOTO 11 & FOTO 5 ASLI)   */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'raporX1') && (
            <div className="space-y-8">
              {/* Info Header Banner Lembar 3 */}
              <div className="max-w-[210mm] mx-auto mb-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-sans flex items-center justify-between print:hidden shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px]">
                    Lembar 3 dari 9
                  </span>
                  <span className="font-bold text-slate-900">
                    Rapor Tingkat Kelas X — Semester 1 (Ganjil)
                  </span>
                </div>
                <span className="text-[11px] text-blue-700 font-mono font-semibold">
                  Fase E • Tingkat Awal
                </span>
              </div>

              {/* HALAMAN DEPAN X1 */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                    LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
                  </h2>
                </div>

                {/* A. IDENTITAS PESERTA DIDIK */}
                <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-900">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                    <span>Kelas</span><span>:</span>
                    <input
                      type="text"
                      value={data.class_x1}
                      onChange={(e) => setData('class_x1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-32"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                    <span>Fase</span><span>:</span>
                    <input
                      type="text"
                      value={data.fase_x1}
                      onChange={(e) => setData('fase_x1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-20"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Sekolah</span><span>:</span><strong>{school?.name || 'SMKN 1 BERINGIN'}</strong>
                    <span>Semester</span><span>:</span>
                    <input
                      type="text"
                      value={data.semester_x1}
                      onChange={(e) => setData('semester_x1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Alamat</span><span>:</span><strong>{school?.address || 'JL. PENDIDIKAN NO. 3'}</strong>
                    <span>Tahun Pelajaran</span><span>:</span>
                    <input
                      type="text"
                      value={data.tahun_pelajaran_x1}
                      onChange={(e) => setData('tahun_pelajaran_x1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                </div>

                {/* B. INTRAKURIKULER (Foto 11) */}
                <div className="mb-2">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
                  <table className="w-full border border-slate-900 text-[9px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                        <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                        <th className="border-r border-slate-900 p-0.5 w-12">Nilai Akhir</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                        <th className="p-0.5 w-10">KKTP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                      </tr>
                      {data.scores_x1.slice(0, 7).map((item, idx) => (
                        <tr key={idx}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_x1', idx, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_x1', idx, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_x1', idx, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                      </tr>
                      {data.scores_x1.slice(7).map((item, idx) => (
                        <tr key={idx + 7}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_x1', idx + 7, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_x1', idx + 7, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_x1', idx + 7, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">
                          {calcSum(data.scores_x1)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-slate-700">
                          {calcSum(data.scores_x1) !== '-' ? 'Tuntas Seluruh Capaian Pembelajaran' : '-'}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px] text-blue-900">
                          {calcAvg(data.scores_x1)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-blue-900">
                          {calcAvg(data.scores_x1) !== '-' ? 'Predikat: Baik' : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* C. P5 */}
                <PaperP5Section
                  theme1={data.p5_theme_1_x1}
                  theme2={data.p5_theme_2_x1}
                  theme3={data.p5_theme_3_x1}
                  onTheme1Change={(v) => setData('p5_theme_1_x1', v)}
                  onTheme2Change={(v) => setData('p5_theme_2_x1', v)}
                  onTheme3Change={(v) => setData('p5_theme_3_x1', v)}
                  dimensions={data.p5_dimensions_x1}
                  onDimChange={(idx, f, v) => handleP5DimChange('p5_dimensions_x1', idx, f, v)}
                />

                {/* D. EKSTRAKURIKULER */}
                <PaperExtraSection
                  extras={data.extras_x1}
                  onExtraChange={(idx, f, v) => handleExtraChange('extras_x1', idx, f, v)}
                />
              </div>

              {/* HALAMAN BELAKANG X1 (Foto 5 Asli) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                {/* E. PRESTASI */}
                <PaperAchievementSection
                  achievements={data.achievements_x1}
                  onAchChange={(idx, f, v) => handleAchievementChange('achievements_x1', idx, f, v)}
                />

                {/* F. KETIDAKHADIRAN & TANDA TANGAN */}
                <div className="mb-6">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
                  <table className="w-full border border-slate-900 text-[10px] border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-900">
                        <td rowSpan={3} className="border-r border-slate-900 p-2 w-40 font-semibold align-top">
                          Ketidakhadiran
                        </td>
                        <td className="border-r border-slate-900 p-1.5 w-48">Sakit</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono w-28">
                          <input
                            type="number"
                            value={data.sick_x_1}
                            onChange={(e) => setData('sick_x_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                          <p className="font-semibold text-xs">Wali Kelas</p>
                          <div className="h-12"></div>
                          <input
                            type="text"
                            value={data.wali_x_name}
                            onChange={(e) => setData('wali_x_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.wali_x_nip}
                              onChange={(e) => setData('wali_x_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                          <p className="font-semibold text-xs">Mengetahui,</p>
                          <p className="font-semibold text-xs">Kepala Sekolah</p>
                          <div className="h-10"></div>
                          <input
                            type="text"
                            value={data.principal_name}
                            onChange={(e) => setData('principal_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.principal_nip}
                              onChange={(e) => setData('principal_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Izin</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.permit_x_1}
                            onChange={(e) => setData('permit_x_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.unexcused_x_1}
                            onChange={(e) => setData('unexcused_x_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Keterangan Footnotes */}
                <div className="text-[9px] text-slate-700 space-y-0.5 border-t border-slate-400 pt-3">
                  <p className="font-bold">Keterangan:</p>
                  <p>* Diikuti oleh peserta didik sesuai dengan agama masing-masing.</p>
                  <p>** Paling banyak 2 (dua) JP per minggu atau 72 (tujuh puluh dua) JP per tahun.</p>
                  <p>*** Nama mata pelajaran merupakan nama konsentrasi keahlian.</p>
                  <p>**** Nama mata pelajaran merupakan mata pelajaran yang dipilih oleh peserta didik.</p>
                  <p>***** Total JP tidak termasuk mata pelajaran muatan lokal dan/atau mata pelajaran tambahan yang diselenggarakan oleh satuan pendidikan.</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 4. RAPOR KELAS X SEMESTER 2 GENAP (FOTO 13 ASLI - NAIK KELAS) */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'raporX2') && (
            <div className="space-y-8">
              {/* Info Header Banner Lembar 4 */}
              <div className="max-w-[210mm] mx-auto mb-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-sans flex items-center justify-between print:hidden shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px]">
                    Lembar 4 dari 9
                  </span>
                  <span className="font-bold text-slate-900">
                    Rapor Tingkat Kelas X — Semester 2 (Genap & Kenaikan Kelas)
                  </span>
                </div>
                <span className="text-[11px] text-blue-700 font-mono font-semibold">
                  Fase E • Kenaikan Kelas
                </span>
              </div>

              {/* HALAMAN DEPAN X2 */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                    LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
                  </h2>
                </div>

                <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-900">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                    <span>Kelas</span><span>:</span>
                    <input
                      type="text"
                      value={data.class_x2}
                      onChange={(e) => setData('class_x2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-32"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                    <span>Fase</span><span>:</span>
                    <input
                      type="text"
                      value={data.fase_x2}
                      onChange={(e) => setData('fase_x2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-20"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Sekolah</span><span>:</span><strong>{school?.name || 'SMKN 1 BERINGIN'}</strong>
                    <span>Semester</span><span>:</span>
                    <input
                      type="text"
                      value={data.semester_x2}
                      onChange={(e) => setData('semester_x2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Alamat</span><span>:</span><strong>{school?.address || 'JL. PENDIDIKAN NO. 3'}</strong>
                    <span>Tahun Pelajaran</span><span>:</span>
                    <input
                      type="text"
                      value={data.tahun_pelajaran_x2}
                      onChange={(e) => setData('tahun_pelajaran_x2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                </div>

                {/* B. INTRAKURIKULER X2 */}
                <div className="mb-2">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
                  <table className="w-full border border-slate-900 text-[9px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                        <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                        <th className="border-r border-slate-900 p-0.5 w-12">Nilai Akhir</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                        <th className="p-0.5 w-10">KKTP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                      </tr>
                      {data.scores_x2.slice(0, 7).map((item, idx) => (
                        <tr key={idx}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_x2', idx, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_x2', idx, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_x2', idx, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                      </tr>
                      {data.scores_x2.slice(7).map((item, idx) => (
                        <tr key={idx + 7}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_x2', idx + 7, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_x2', idx + 7, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_x2', idx + 7, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">
                          {calcSum(data.scores_x2)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-slate-700">
                          {calcSum(data.scores_x2) !== '-' ? 'Tuntas Seluruh Capaian Pembelajaran' : '-'}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px] text-blue-900">
                          {calcAvg(data.scores_x2)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-blue-900">
                          {calcAvg(data.scores_x2) !== '-' ? 'Predikat: Amat Baik' : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* C. P5 */}
                <PaperP5Section
                  theme1={data.p5_theme_1_x2}
                  theme2={data.p5_theme_2_x2}
                  theme3={data.p5_theme_3_x2}
                  onTheme1Change={(v) => setData('p5_theme_1_x2', v)}
                  onTheme2Change={(v) => setData('p5_theme_2_x2', v)}
                  onTheme3Change={(v) => setData('p5_theme_3_x2', v)}
                  dimensions={data.p5_dimensions_x2}
                  onDimChange={(idx, f, v) => handleP5DimChange('p5_dimensions_x2', idx, f, v)}
                />

                {/* D. EKSTRAKURIKULER */}
                <PaperExtraSection
                  extras={data.extras_x2}
                  onExtraChange={(idx, f, v) => handleExtraChange('extras_x2', idx, f, v)}
                />
              </div>

              {/* HALAMAN BELAKANG X2 (Foto 13 Asli - Kenaikan Kelas) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                {/* E. PRESTASI */}
                <PaperAchievementSection
                  achievements={data.achievements_x2}
                  onAchChange={(idx, f, v) => handleAchievementChange('achievements_x2', idx, f, v)}
                />

                {/* F. KETIDAKHADIRAN & KEPUTUSAN KENAIKAN (FOTO 13) */}
                <div className="mb-6">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
                  <table className="w-full border border-slate-900 text-[10px] border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-900">
                        <td rowSpan={4} className="border-r border-slate-900 p-2 w-36 font-semibold align-top">
                          Ketidakhadiran
                        </td>
                        <td className="border-r border-slate-900 p-1.5 w-44">Sakit</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono w-24">
                          <input
                            type="number"
                            value={data.sick_x_2}
                            onChange={(e) => setData('sick_x_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                          <p className="font-semibold text-xs">Wali Kelas</p>
                          <div className="h-12"></div>
                          <input
                            type="text"
                            value={data.wali_x_name}
                            onChange={(e) => setData('wali_x_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.wali_x_nip}
                              onChange={(e) => setData('wali_x_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                          <p className="font-semibold text-xs">Mengetahui,</p>
                          <p className="font-semibold text-xs">Kepala Sekolah</p>
                          <div className="h-10"></div>
                          <input
                            type="text"
                            value={data.principal_name}
                            onChange={(e) => setData('principal_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.principal_nip}
                              onChange={(e) => setData('principal_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Izin</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.permit_x_2}
                            onChange={(e) => setData('permit_x_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.unexcused_x_2}
                            onChange={(e) => setData('unexcused_x_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>

                      {/* KOTAK KEPUTUSAN KENAIKAN (FOTO 13 ASLI) */}
                      <tr>
                        <td colSpan={2} className="border-r border-slate-900 p-2 bg-slate-50">
                          <p className="font-bold text-[10px]">Keputusan:</p>
                          <p className="text-[9px] leading-tight text-slate-800">
                            Berdasarkan Hasil Belajar pada Semester I dan II, peserta didik ditetapkan
                          </p>
                          <div className="mt-1 font-bold text-[10px]">
                            Kenaikan : <span className="underline uppercase text-blue-900">Naik</span>
                          </div>
                          <div className="text-[9.5px] mt-0.5">
                            Ke Kelas : <input
                              type="text"
                              value={data.promotion_x_genap}
                              onChange={(e) => setData('promotion_x_genap', e.target.value)}
                              className="font-bold font-mono text-[10px] border-b border-dotted w-32"
                            />
                          </div>
                          <p className="text-[8.5px] text-slate-600 mt-1">Tanggal : {isSampleStudent ? '22 Juni 2024' : '-'}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[9px] text-slate-700 space-y-0.5 border-t border-slate-400 pt-3">
                  <p className="font-bold">Keterangan:</p>
                  <p>* Diikuti oleh peserta didik sesuai dengan agama masing-masing.</p>
                  <p>** Paling banyak 2 (dua) JP per minggu atau 72 (tujuh puluh dua) JP per tahun.</p>
                  <p>*** Nama mata pelajaran merupakan nama konsentrasi keahlian.</p>
                  <p>**** Nama mata pelajaran merupakan mata pelajaran yang dipilih oleh peserta didik.</p>
                  <p>***** Total JP tidak termasuk mata pelajaran muatan lokal dan/atau mata pelajaran tambahan yang diselenggarakan oleh satuan pendidikan.</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 5. RAPOR KELAS XI SEMESTER 3 GANJIL (FOTO 6 & FOTO 9 ASLI)   */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'raporXI1') && (
            <div className="space-y-8">
              {/* Info Header Banner Lembar 5 */}
              <div className="max-w-[210mm] mx-auto mb-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-sans flex items-center justify-between print:hidden shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[10px]">
                    Lembar 5 dari 9
                  </span>
                  <span className="font-bold text-slate-900">
                    Rapor Tingkat Kelas XI — Semester 3 (Ganjil)
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-mono font-semibold">
                  Fase F • Tingkat Menengah
                </span>
              </div>

              {/* HALAMAN DEPAN XI1 (Foto 6) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                    LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
                  </h2>
                </div>

                <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-900">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                    <span>Kelas</span><span>:</span>
                    <input
                      type="text"
                      value={data.class_xi1}
                      onChange={(e) => setData('class_xi1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-32"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                    <span>Fase</span><span>:</span>
                    <input
                      type="text"
                      value={data.fase_xi1}
                      onChange={(e) => setData('fase_xi1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-20"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Sekolah</span><span>:</span><strong>{school?.name || 'SMKN 1 BERINGIN'}</strong>
                    <span>Semester</span><span>:</span>
                    <input
                      type="text"
                      value={data.semester_xi1}
                      onChange={(e) => setData('semester_xi1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Alamat</span><span>:</span><strong>{school?.address || 'JL. PENDIDIKAN NO. 3'}</strong>
                    <span>Tahun Pelajaran</span><span>:</span>
                    <input
                      type="text"
                      value={data.tahun_pelajaran_xi1}
                      onChange={(e) => setData('tahun_pelajaran_xi1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                </div>

                {/* B. INTRAKURIKULER XI1 (Foto 6) */}
                <div className="mb-2">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
                  <table className="w-full border border-slate-900 text-[9px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                        <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                        <th className="border-r border-slate-900 p-0.5 w-12">Nilai Akhir</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                        <th className="p-0.5 w-10">KKTP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                      </tr>
                      {data.scores_xi1.slice(0, 6).map((item, idx) => (
                        <tr key={idx}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_xi1', idx, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_xi1', idx, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_xi1', idx, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                      </tr>
                      {data.scores_xi1.slice(6).map((item, idx) => (
                        <tr key={idx + 6}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_xi1', idx + 6, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_xi1', idx + 6, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_xi1', idx + 6, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">
                          {calcSum(data.scores_xi1)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-slate-700">
                          {calcSum(data.scores_xi1) !== '-' ? 'Tuntas Seluruh Capaian Pembelajaran' : '-'}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px] text-blue-900">
                          {calcAvg(data.scores_xi1)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-blue-900">
                          {calcAvg(data.scores_xi1) !== '-' ? 'Predikat: Baik' : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* C. P5 */}
                <PaperP5Section
                  theme1={data.p5_theme_1_xi1}
                  theme2={data.p5_theme_2_xi1}
                  theme3={data.p5_theme_3_xi1}
                  onTheme1Change={(v) => setData('p5_theme_1_xi1', v)}
                  onTheme2Change={(v) => setData('p5_theme_2_xi1', v)}
                  onTheme3Change={(v) => setData('p5_theme_3_xi1', v)}
                  dimensions={data.p5_dimensions_xi1}
                  onDimChange={(idx, f, v) => handleP5DimChange('p5_dimensions_xi1', idx, f, v)}
                />

                {/* D. EKSTRAKURIKULER */}
                <PaperExtraSection
                  extras={data.extras_xi1}
                  onExtraChange={(idx, f, v) => handleExtraChange('extras_xi1', idx, f, v)}
                />
              </div>

              {/* HALAMAN BELAKANG XI1 (Foto 9 Asli) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                {/* E. PRESTASI */}
                <PaperAchievementSection
                  achievements={data.achievements_xi1}
                  onAchChange={(idx, f, v) => handleAchievementChange('achievements_xi1', idx, f, v)}
                />

                {/* F. KETIDAKHADIRAN & TTD (Foto 9 Asli: Tanpa Keterangan 1 Hari) */}
                <div className="mb-6">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
                  <table className="w-full border border-slate-900 text-[10px] border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-900">
                        <td rowSpan={3} className="border-r border-slate-900 p-2 w-40 font-semibold align-top">
                          Ketidakhadiran
                        </td>
                        <td className="border-r border-slate-900 p-1.5 w-48">Sakit</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono w-28">
                          <input
                            type="number"
                            value={data.sick_xi_1}
                            onChange={(e) => setData('sick_xi_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                          <p className="font-semibold text-xs">Wali Kelas</p>
                          <div className="h-12"></div>
                          <input
                            type="text"
                            value={data.wali_xi_name}
                            onChange={(e) => setData('wali_xi_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.wali_xi_nip}
                              onChange={(e) => setData('wali_xi_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                          <p className="font-semibold text-xs">Mengetahui,</p>
                          <p className="font-semibold text-xs">Kepala Sekolah</p>
                          <div className="h-10"></div>
                          <input
                            type="text"
                            value={data.principal_name}
                            onChange={(e) => setData('principal_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.principal_nip}
                              onChange={(e) => setData('principal_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Izin</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.permit_xi_1}
                            onChange={(e) => setData('permit_xi_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono font-bold">
                          <input
                            type="number"
                            value={data.unexcused_xi_1}
                            onChange={(e) => setData('unexcused_xi_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted font-mono font-bold"
                          /> hari
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[9px] text-slate-700 space-y-0.5 border-t border-slate-400 pt-3">
                  <p className="font-bold">Keterangan:</p>
                  <p>* Diikuti oleh peserta didik sesuai dengan agama masing-masing.</p>
                  <p>** Paling banyak 2 (dua) JP per minggu atau 72 (tujuh puluh dua) JP per tahun.</p>
                  <p>*** Nama mata pelajaran merupakan nama konsentrasi keahlian.</p>
                  <p>**** Nama mata pelajaran merupakan mata pelajaran yang dipilih oleh peserta didik.</p>
                  <p>***** Total JP tidak termasuk mata pelajaran muatan lokal dan/atau mata pelajaran tambahan yang diselenggarakan oleh satuan pendidikan.</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 6. RAPOR KELAS XI SEMESTER 4 GENAP (FOTO 10 & FOTO 8 ASLI)   */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'raporXI2') && (
            <div className="space-y-8">
              {/* Info Header Banner Lembar 6 */}
              <div className="max-w-[210mm] mx-auto mb-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-sans flex items-center justify-between print:hidden shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[10px]">
                    Lembar 6 dari 9
                  </span>
                  <span className="font-bold text-slate-900">
                    Rapor Tingkat Kelas XI — Semester 4 (Genap & Kenaikan Kelas)
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-mono font-semibold">
                  Fase F • Kenaikan Kelas XII
                </span>
              </div>

              {/* HALAMAN DEPAN XI2 (Foto 10) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                    LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
                  </h2>
                </div>

                <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-900">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                    <span>Kelas</span><span>:</span>
                    <input
                      type="text"
                      value={data.class_xi2}
                      onChange={(e) => setData('class_xi2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-32"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                    <span>Fase</span><span>:</span>
                    <input
                      type="text"
                      value={data.fase_xi2}
                      onChange={(e) => setData('fase_xi2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-20"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Sekolah</span><span>:</span><strong>{school?.name || 'SMKN 1 BERINGIN'}</strong>
                    <span>Semester</span><span>:</span>
                    <input
                      type="text"
                      value={data.semester_xi2}
                      onChange={(e) => setData('semester_xi2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Alamat</span><span>:</span><strong>{school?.address || 'JL. PENDIDIKAN NO. 3'}</strong>
                    <span>Tahun Pelajaran</span><span>:</span>
                    <input
                      type="text"
                      value={data.tahun_pelajaran_xi2}
                      onChange={(e) => setData('tahun_pelajaran_xi2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                </div>

                {/* B. INTRAKURIKULER XI2 (Foto 10) */}
                <div className="mb-2">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
                  <table className="w-full border border-slate-900 text-[9px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                        <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                        <th className="border-r border-slate-900 p-0.5 w-12">Nilai Akhir</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                        <th className="p-0.5 w-10">KKTP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                      </tr>
                      {data.scores_xi2.slice(0, 6).map((item, idx) => (
                        <tr key={idx}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_xi2', idx, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_xi2', idx, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_xi2', idx, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                      </tr>
                      {data.scores_xi2.slice(6).map((item, idx) => (
                        <tr key={idx + 6}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_xi2', idx + 6, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_xi2', idx + 6, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_xi2', idx + 6, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">
                          {calcSum(data.scores_xi2)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-slate-700">
                          {calcSum(data.scores_xi2) !== '-' ? 'Tuntas Seluruh Capaian Pembelajaran' : '-'}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px] text-blue-900">
                          {calcAvg(data.scores_xi2)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-blue-900">
                          {calcAvg(data.scores_xi2) !== '-' ? 'Predikat: Amat Baik' : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* C. P5 */}
                <PaperP5Section
                  theme1={data.p5_theme_1_xi2}
                  theme2={data.p5_theme_2_xi2}
                  theme3={data.p5_theme_3_xi2}
                  onTheme1Change={(v) => setData('p5_theme_1_xi2', v)}
                  onTheme2Change={(v) => setData('p5_theme_2_xi2', v)}
                  onTheme3Change={(v) => setData('p5_theme_3_xi2', v)}
                  dimensions={data.p5_dimensions_xi2}
                  onDimChange={(idx, f, v) => handleP5DimChange('p5_dimensions_xi2', idx, f, v)}
                />

                {/* D. EKSTRAKURIKULER */}
                <PaperExtraSection
                  extras={data.extras_xi2}
                  onExtraChange={(idx, f, v) => handleExtraChange('extras_xi2', idx, f, v)}
                />
              </div>

              {/* HALAMAN BELAKANG XI2 (Foto 8 Asli - Kenaikan Kelas) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                {/* E. PRESTASI */}
                <PaperAchievementSection
                  achievements={data.achievements_xi2}
                  onAchChange={(idx, f, v) => handleAchievementChange('achievements_xi2', idx, f, v)}
                />

                {/* F. KETIDAKHADIRAN & KEPUTUSAN KENAIKAN (FOTO 8) */}
                <div className="mb-6">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
                  <table className="w-full border border-slate-900 text-[10px] border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-900">
                        <td rowSpan={4} className="border-r border-slate-900 p-2 w-36 font-semibold align-top">
                          Ketidakhadiran
                        </td>
                        <td className="border-r border-slate-900 p-1.5 w-44">Sakit</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono w-24">
                          <input
                            type="number"
                            value={data.sick_xi_2}
                            onChange={(e) => setData('sick_xi_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                          <p className="font-semibold text-xs">Wali Kelas</p>
                          <div className="h-12"></div>
                          <input
                            type="text"
                            value={data.wali_xi_name}
                            onChange={(e) => setData('wali_xi_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.wali_xi_nip}
                              onChange={(e) => setData('wali_xi_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                          <p className="font-semibold text-xs">Mengetahui,</p>
                          <p className="font-semibold text-xs">Kepala Sekolah</p>
                          <div className="h-10"></div>
                          <input
                            type="text"
                            value={data.principal_name}
                            onChange={(e) => setData('principal_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.principal_nip}
                              onChange={(e) => setData('principal_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Izin</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.permit_xi_2}
                            onChange={(e) => setData('permit_xi_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.unexcused_xi_2}
                            onChange={(e) => setData('unexcused_xi_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>

                      {/* KOTAK KEPUTUSAN KENAIKAN (FOTO 8 ASLI) */}
                      <tr>
                        <td colSpan={2} className="border-r border-slate-900 p-2 bg-slate-50">
                          <p className="font-bold text-[10px]">Keputusan:</p>
                          <p className="text-[9px] leading-tight text-slate-800">
                            Berdasarkan Hasil Belajar pada Semester I dan II, peserta didik ditetapkan
                          </p>
                          <div className="mt-1 font-bold text-[10px]">
                            Kenaikan : <span className="underline uppercase text-blue-900">Naik</span>
                          </div>
                          <div className="text-[9.5px] mt-0.5">
                            Ke Kelas : <input
                              type="text"
                              value={data.promotion_xi_genap}
                              onChange={(e) => setData('promotion_xi_genap', e.target.value)}
                              className="font-bold font-mono text-[10px] border-b border-dotted w-32"
                            />
                          </div>
                          <p className="text-[8.5px] text-slate-600 mt-1">Tanggal : {isSampleStudent ? '21 Juni 2025' : '-'}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[9px] text-slate-700 space-y-0.5 border-t border-slate-400 pt-3">
                  <p className="font-bold">Keterangan:</p>
                  <p>* Diikuti oleh peserta didik sesuai dengan agama masing-masing.</p>
                  <p>** Paling banyak 2 (dua) JP per minggu atau 72 (tujuh puluh dua) JP per tahun.</p>
                  <p>*** Nama mata pelajaran merupakan nama konsentrasi keahlian.</p>
                  <p>**** Nama mata pelajaran merupakan mata pelajaran yang dipilih oleh peserta didik.</p>
                  <p>***** Total JP tidak termasuk mata pelajaran muatan lokal dan/atau mata pelajaran tambahan yang diselenggarakan oleh satuan pendidikan.</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 7. RAPOR KELAS XII SEMESTER 5 GANJIL (FOTO 7 & FOTO 5 ASLI)  */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'raporXII1') && (
            <div className="space-y-8">
              {/* Info Header Banner Lembar 7 */}
              <div className="max-w-[210mm] mx-auto mb-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-xs font-sans flex items-center justify-between print:hidden shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-extrabold text-[10px]">
                    Lembar 7 dari 9
                  </span>
                  <span className="font-bold text-slate-900">
                    Rapor Tingkat Kelas XII — Semester 5 (Ganjil & PKL Industri)
                  </span>
                </div>
                <span className="text-[11px] text-purple-700 font-mono font-semibold">
                  Fase F • Tingkat Akhir SMK
                </span>
              </div>

              {/* HALAMAN DEPAN XII1 (Foto 7) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                    LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
                  </h2>
                </div>

                <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-900">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                    <span>Kelas</span><span>:</span>
                    <input
                      type="text"
                      value={data.class_xii1}
                      onChange={(e) => setData('class_xii1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-32"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                    <span>Fase</span><span>:</span>
                    <input
                      type="text"
                      value={data.fase_xii1}
                      onChange={(e) => setData('fase_xii1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-20"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Sekolah</span><span>:</span><strong>{school?.name || 'SMKN 1 BERINGIN'}</strong>
                    <span>Semester</span><span>:</span>
                    <input
                      type="text"
                      value={data.semester_xii1}
                      onChange={(e) => setData('semester_xii1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Alamat</span><span>:</span><strong>{school?.address || 'JL. PENDIDIKAN NO. 3'}</strong>
                    <span>Tahun Pelajaran</span><span>:</span>
                    <input
                      type="text"
                      value={data.tahun_pelajaran_xii1}
                      onChange={(e) => setData('tahun_pelajaran_xii1', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                </div>

                {/* B. INTRAKURIKULER XII1 (Foto 7) */}
                <div className="mb-2">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER & PKL</div>
                  <table className="w-full border border-slate-900 text-[9px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                        <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                        <th className="border-r border-slate-900 p-0.5 w-12">Nilai Akhir</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                        <th className="p-0.5 w-10">KKTP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                      </tr>
                      {data.scores_xii1.slice(0, 4).map((item, idx) => (
                        <tr key={idx}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_xii1', idx, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_xii1', idx, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_xii1', idx, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                      </tr>
                      {data.scores_xii1.slice(4).map((item, idx) => (
                        <tr key={idx + 4}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_xii1', idx + 4, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_xii1', idx + 4, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_xii1', idx + 4, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">
                          {calcSum(data.scores_xii1)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-slate-700">
                          {calcSum(data.scores_xii1) !== '-' ? 'Tuntas Seluruh Capaian Pembelajaran' : '-'}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px] text-blue-900">
                          {calcAvg(data.scores_xii1)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-blue-900">
                          {calcAvg(data.scores_xii1) !== '-' ? 'Predikat: Amat Baik' : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* C. P5 */}
                <PaperP5Section
                  theme1={data.p5_theme_1_xii1}
                  theme2={data.p5_theme_2_xii1}
                  theme3={data.p5_theme_3_xii1}
                  onTheme1Change={(v) => setData('p5_theme_1_xii1', v)}
                  onTheme2Change={(v) => setData('p5_theme_2_xii1', v)}
                  onTheme3Change={(v) => setData('p5_theme_3_xii1', v)}
                  dimensions={data.p5_dimensions_xii1}
                  onDimChange={(idx, f, v) => handleP5DimChange('p5_dimensions_xii1', idx, f, v)}
                />

                {/* D. EKSTRAKURIKULER */}
                <PaperExtraSection
                  extras={data.extras_xii1}
                  onExtraChange={(idx, f, v) => handleExtraChange('extras_xii1', idx, f, v)}
                />
              </div>

              {/* HALAMAN BELAKANG XII1 (Foto 5 Asli: Kusniarti, S.Pd) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                {/* E. PRESTASI */}
                <PaperAchievementSection
                  achievements={data.achievements_xii1}
                  onAchChange={(idx, f, v) => handleAchievementChange('achievements_xii1', idx, f, v)}
                />

                {/* F. KETIDAKHADIRAN & TTD WALI (Foto 5: Kusniarti, S.Pd) */}
                <div className="mb-6">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
                  <table className="w-full border border-slate-900 text-[10px] border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-900">
                        <td rowSpan={3} className="border-r border-slate-900 p-2 w-40 font-semibold align-top">
                          Ketidakhadiran
                        </td>
                        <td className="border-r border-slate-900 p-1.5 w-48">Sakit</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono w-28">
                          <input
                            type="number"
                            value={data.sick_xii_1}
                            onChange={(e) => setData('sick_xii_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                          <p className="font-semibold text-xs">Wali Kelas</p>
                          <div className="h-12"></div>
                          <input
                            type="text"
                            value={data.wali_xii_name}
                            onChange={(e) => setData('wali_xii_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.wali_xii_nip}
                              onChange={(e) => setData('wali_xii_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                          <p className="font-semibold text-xs">Mengetahui,</p>
                          <p className="font-semibold text-xs">Kepala Sekolah</p>
                          <div className="h-10"></div>
                          <input
                            type="text"
                            value={data.principal_name}
                            onChange={(e) => setData('principal_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.principal_nip}
                              onChange={(e) => setData('principal_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Izin</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.permit_xii_1}
                            onChange={(e) => setData('permit_xii_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.unexcused_xii_1}
                            onChange={(e) => setData('unexcused_xii_1', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[9px] text-slate-700 space-y-0.5 border-t border-slate-400 pt-3">
                  <p className="font-bold">Keterangan:</p>
                  <p>* Diikuti oleh peserta didik sesuai dengan agama masing-masing.</p>
                  <p>** Paling banyak 2 (dua) JP per minggu atau 72 (tujuh puluh dua) JP per tahun.</p>
                  <p>*** Nama mata pelajaran merupakan nama konsentrasi keahlian.</p>
                  <p>**** Nama mata pelajaran merupakan mata pelajaran yang dipilih oleh peserta didik.</p>
                  <p>***** Total JP tidak termasuk mata pelajaran muatan lokal dan/atau mata pelajaran tambahan yang diselenggarakan oleh satuan pendidikan.</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 8. RAPOR KELAS XII SEMESTER 6 GENAP (FOTO 4 & FOTO 1 ASLI)   */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'raporXII2') && (
            <div className="space-y-8">
              {/* Info Header Banner Lembar 8 */}
              <div className="max-w-[210mm] mx-auto mb-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-xs font-sans flex items-center justify-between print:hidden shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-extrabold text-[10px]">
                    Lembar 8 dari 9
                  </span>
                  <span className="font-bold text-slate-900">
                    Rapor Tingkat Kelas XII — Semester 6 (Genap & Kelulusan Akhir / Ijazah)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Kelulusan Akhir & Ijazah
                  </span>
                  <span className="text-[11px] text-purple-700 font-mono font-semibold">
                    Fase F • Tingkat Akhir SMK
                  </span>
                </div>
              </div>

              {/* HALAMAN DEPAN XII2 (Foto 4) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                    LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
                  </h2>
                </div>

                <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-900">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                    <span>Kelas</span><span>:</span>
                    <input
                      type="text"
                      value={data.class_xii2}
                      onChange={(e) => setData('class_xii2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-32"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                    <span>Fase</span><span>:</span>
                    <input
                      type="text"
                      value={data.fase_xii2}
                      onChange={(e) => setData('fase_xii2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-20"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Nama Sekolah</span><span>:</span><strong>{school?.name || 'SMKN 1 BERINGIN'}</strong>
                    <span>Semester</span><span>:</span>
                    <input
                      type="text"
                      value={data.semester_xii2}
                      onChange={(e) => setData('semester_xii2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                    <span>Alamat</span><span>:</span><strong>{school?.address || 'JL. PENDIDIKAN NO. 3'}</strong>
                    <span>Tahun Pelajaran</span><span>:</span>
                    <input
                      type="text"
                      value={data.tahun_pelajaran_xii2}
                      onChange={(e) => setData('tahun_pelajaran_xii2', e.target.value)}
                      className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-28"
                    />
                  </div>
                </div>

                {/* B. INTRAKURIKULER XII2 (Foto 4) */}
                <div className="mb-2">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER & UKK</div>
                  <table className="w-full border border-slate-900 text-[9px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                        <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                        <th className="border-r border-slate-900 p-0.5 w-12">Nilai Akhir</th>
                        <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                        <th className="p-0.5 w-10">KKTP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                      </tr>
                      {data.scores_xii2.slice(0, 4).map((item, idx) => (
                        <tr key={idx}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_xii2', idx, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_xii2', idx, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_xii2', idx, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100/70 font-bold text-left">
                        <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                      </tr>
                      {data.scores_xii2.slice(4).map((item, idx) => (
                        <tr key={idx + 4}>
                          <td className="border-r border-slate-900 p-0.5 text-center">{item.no}</td>
                          <td className="border-r border-slate-900 p-0.5 font-medium">{item.name}</td>
                          <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">
                            <input
                              type="number"
                              value={item.score}
                              onChange={(e) => handleScoreChange('scores_xii2', idx + 4, 'score', e.target.value)}
                              className="w-10 text-center border-b border-dotted font-mono font-bold"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0.5 text-[8.5px]">
                            <input
                              type="text"
                              value={item.comp}
                              onChange={(e) => handleScoreChange('scores_xii2', idx + 4, 'comp', e.target.value)}
                              className="w-full border-b border-dotted px-1 text-[8.5px]"
                            />
                          </td>
                          <td className="p-0.5 text-center font-mono">
                            <input
                              type="number"
                              value={item.kktp}
                              onChange={(e) => handleScoreChange('scores_xii2', idx + 4, 'kktp', e.target.value)}
                              className="w-8 text-center font-mono"
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">
                          {calcSum(data.scores_xii2)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-slate-700">
                          {calcSum(data.scores_xii2) !== '-' ? 'Tuntas Seluruh Capaian Pembelajaran' : '-'}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                        <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px] text-blue-900">
                          {calcAvg(data.scores_xii2)}
                        </td>
                        <td colSpan={2} className="p-0.5 text-left pl-2 text-[8.5px] text-blue-900">
                          {calcAvg(data.scores_xii2) !== '-' ? 'Predikat: Amat Baik (Lulus UKK)' : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* C. P5 */}
                <PaperP5Section
                  theme1={data.p5_theme_1_xii2}
                  theme2={data.p5_theme_2_xii2}
                  theme3={data.p5_theme_3_xii2}
                  onTheme1Change={(v) => setData('p5_theme_1_xii2', v)}
                  onTheme2Change={(v) => setData('p5_theme_2_xii2', v)}
                  onTheme3Change={(v) => setData('p5_theme_3_xii2', v)}
                  dimensions={data.p5_dimensions_xii2}
                  onDimChange={(idx, f, v) => handleP5DimChange('p5_dimensions_xii2', idx, f, v)}
                />

                {/* D. EKSTRAKURIKULER */}
                <PaperExtraSection
                  extras={data.extras_xii2}
                  onExtraChange={(idx, f, v) => handleExtraChange('extras_xii2', idx, f, v)}
                />
              </div>

              {/* HALAMAN BELAKANG XII2 (Foto 1 Asli: KELULUSAN & IJAZAH) */}
              <div className="max-w-[210mm] mx-auto bg-white p-7 border border-slate-900 shadow-xs min-h-[297mm]">
                {/* E. PRESTASI */}
                <PaperAchievementSection
                  achievements={data.achievements_xii2}
                  onAchChange={(idx, f, v) => handleAchievementChange('achievements_xii2', idx, f, v)}
                />

                {/* KETIDAKHADIRAN DAN KELULUSAN (FOTO 1 ASLI) */}
                <div className="mb-6">
                  <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">
                    KETIDAKHADIRAN DAN KELULUSAN
                  </div>
                  <table className="w-full border border-slate-900 text-[10px] border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-900">
                        <td rowSpan={4} className="border-r border-slate-900 p-2 w-36 font-semibold align-top">
                          Ketidakhadiran
                        </td>
                        <td className="border-r border-slate-900 p-1.5 w-40">Sakit</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono w-24">
                          <input
                            type="number"
                            value={data.sick_xii_2}
                            onChange={(e) => setData('sick_xii_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                          <div className="mb-2">
                            <span className="font-bold block text-xs">STATUS AKHIR</span>
                            <span className="text-sm font-black underline uppercase text-emerald-800">
                              {data.graduation_status || (isSampleStudent ? 'L U L U S' : '-')}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600 mb-1">Tanggal : {isSampleStudent ? '5 Mei 2026' : '-'}</p>
                          <p className="font-semibold text-xs mt-3">Wali Kelas</p>
                          <div className="h-10"></div>
                          <input
                            type="text"
                            value={data.wali_xii_name}
                            onChange={(e) => setData('wali_xii_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.wali_xii_nip}
                              onChange={(e) => setData('wali_xii_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                        <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                          <p className="font-semibold text-xs">Mengetahui,</p>
                          <p className="font-semibold text-xs">Kepala Sekolah</p>
                          <div className="h-14"></div>
                          <input
                            type="text"
                            value={data.principal_name}
                            onChange={(e) => setData('principal_name', e.target.value)}
                            className="font-bold text-center border-b border-dotted uppercase text-xs w-48 block mx-auto focus:bg-amber-50/40"
                          />
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="font-mono text-[9.5px]">NIP.</span>
                            <input
                              type="text"
                              value={data.principal_nip}
                              onChange={(e) => setData('principal_nip', e.target.value)}
                              className="font-mono text-[9.5px] border-b border-dotted text-center w-36 focus:bg-amber-50/40"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Izin</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.permit_xii_2}
                            onChange={(e) => setData('permit_xii_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>
                      <tr className="border-b border-slate-900">
                        <td className="border-r border-slate-900 p-1.5">Tanpa Kehadiran</td>
                        <td className="border-r border-slate-900 p-1.5 text-center font-mono">
                          <input
                            type="number"
                            value={data.unexcused_xii_2}
                            onChange={(e) => setData('unexcused_xii_2', Number(e.target.value))}
                            className="w-8 text-center border-b border-dotted"
                          /> hari
                        </td>
                      </tr>

                      {/* KOTAK KEPUTUSAN KELULUSAN & NO IJAZAH (FOTO 1 ASLI) */}
                      <tr>
                        <td colSpan={2} className="border-r border-slate-900 p-2 bg-slate-50">
                          <p className="font-bold text-[10px]">Keputusan:</p>
                          <p className="text-[9.5px] leading-tight">
                            Berdasarkan Hasil Belajar yang dicapai Peserta Didik ditetapkan: <strong>{data.graduation_status || (isSampleStudent ? 'LULUS' : '-')}</strong>
                          </p>
                          <div className="mt-1 space-y-0.5 text-[9.5px]">
                            <div>
                              No. Ijazah : <input
                                type="text"
                                value={data.graduation_cert_no}
                                onChange={(e) => setData('graduation_cert_no', e.target.value)}
                                className="font-bold font-mono text-[9.5px] border-b border-dotted w-44"
                              />
                            </div>
                            <div>
                              No. SKHUS : <input
                                type="text"
                                value={data.graduation_skhus_no}
                                onChange={(e) => setData('graduation_skhus_no', e.target.value)}
                                className="font-bold font-mono text-[9.5px] border-b border-dotted w-44"
                              />
                            </div>
                            <div>Tgl / Bln / Thn : <strong className="font-mono">{isSampleStudent ? '05 / 05 / 2026' : '-'}</strong></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[9px] text-slate-700 space-y-0.5 border-t border-slate-400 pt-3">
                  <p className="font-bold">Keterangan:</p>
                  <p>* Diikuti oleh peserta didik sesuai dengan agama masing-masing.</p>
                  <p>** Paling banyak 2 (dua) JP per minggu atau 72 (tujuh puluh dua) JP per tahun.</p>
                  <p>*** Nama mata pelajaran merupakan nama konsentrasi keahlian.</p>
                  <p>**** Nama mata pelajaran merupakan mata pelajaran yang dipilih oleh peserta didik.</p>
                  <p>***** Total JP tidak termasuk mata pelajaran muatan lokal dan/atau mata pelajaran tambahan yang diselenggarakan oleh satuan pendidikan.</p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 9. HALAMAN TERAKHIR: REKAPITULASI NILAI 6 SEMESTER           */}
          {/* (FOTO 3 ASLI: LAPORAN HASIL AKHIR PEMBELAJARAN SISWA)        */}
          {/* ------------------------------------------------------------ */}
          {(activeSheetTab === 'all' || activeSheetTab === 'lembar3') && (
            <div>
              {/* Info Header Banner Lembar 9 */}
              <div className="max-w-[215mm] mx-auto mb-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-sans flex items-center justify-between print:hidden shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-800 text-white font-extrabold text-[10px]">
                    Lembar 9 dari 9
                  </span>
                  <span className="font-bold text-slate-900">
                    Rekapitulasi Nilai 6 Semester (Halaman Terakhir — Transkrip Master)
                  </span>
                </div>
                <span className="text-[11px] text-blue-800 font-mono font-bold">
                  Kumulatif Semester 1 s.d. 6
                </span>
              </div>

              <div className="bg-white p-8 border border-slate-400">
              <div className="text-center py-2 border-b-2 border-slate-900 mb-2">
                <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-950">
                  LAPORAN HASIL AKHIR PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
                </h2>
                <p className="text-xs font-semibold text-slate-700">
                  (REKAPITULASI NILAI 6 SEMESTER - TRANSKRIP MASTER KELULUSAN - HALAMAN TERAKHIR)
                </p>
              </div>

              <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-400">
                <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
                <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                  <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                  <span>Kelas</span><span>:</span>
                  <input
                    type="text"
                    value={data.class_transkrip}
                    onChange={(e) => setData('class_transkrip', e.target.value)}
                    className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-32"
                  />
                </div>
                <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                  <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                  <span>Fase</span><span>:</span>
                  <input
                    type="text"
                    value={data.fase_transkrip}
                    onChange={(e) => setData('fase_transkrip', e.target.value)}
                    className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-20"
                  />
                </div>
                <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                  <span>Nama Sekolah</span><span>:</span><strong>{school?.name || 'SMKN 1 BERINGIN'}</strong>
                  <span>Semester</span><span>:</span>
                  <input
                    type="text"
                    value={data.semester_transkrip}
                    onChange={(e) => setData('semester_transkrip', e.target.value)}
                    className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-36"
                  />
                </div>
                <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                  <span>Alamat</span><span>:</span><strong>{school?.address || 'JL. PENDIDIKAN NO. 3'}</strong>
                  <span>Tahun Pelajaran</span><span>:</span>
                  <input
                    type="text"
                    value={data.tahun_pelajaran_transkrip}
                    onChange={(e) => setData('tahun_pelajaran_transkrip', e.target.value)}
                    className="font-bold font-mono text-[10px] border-b border-dotted border-slate-400 bg-transparent px-1 uppercase w-48"
                  />
                </div>
              </div>

              {/* Master 6 Semester Transcript Table (Foto 3) */}
              <div className="mb-3">
                <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
                <table className="w-full border border-slate-900 text-[8.5px] text-center border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-100 font-bold">
                      <th rowSpan={2} className="border-r border-slate-900 p-0.5 w-6">No.</th>
                      <th rowSpan={2} className="border-r border-slate-900 p-0.5 text-left w-56">Mata Pelajaran</th>
                      <th colSpan={3} className="border-r border-slate-900 p-0.5">Kelas X</th>
                      <th colSpan={3} className="border-r border-slate-900 p-0.5">Kelas XI</th>
                      <th colSpan={3} className="border-r border-slate-900 p-0.5">Kelas XII</th>
                      <th rowSpan={2} className="p-0.5 w-14">Nilai Ujian Sekolah</th>
                    </tr>
                    <tr className="border-b border-slate-900 bg-slate-50 font-bold text-[8px]">
                      <th className="border-r border-slate-900 p-0.5 w-8">Semester Ganjil</th>
                      <th className="border-r border-slate-900 p-0.5 w-8">Semester Genap</th>
                      <th className="border-r border-slate-900 p-0.5 w-8">Rata-rata</th>
                      <th className="border-r border-slate-900 p-0.5 w-8">Semester Ganjil</th>
                      <th className="border-r border-slate-900 p-0.5 w-8">Semester Genap</th>
                      <th className="border-r border-slate-900 p-0.5 w-8">Rata-rata</th>
                      <th className="border-r border-slate-900 p-0.5 w-8">Semester Ganjil</th>
                      <th className="border-r border-slate-900 p-0.5 w-8">Semester Genap</th>
                      <th className="border-r border-slate-900 p-0.5 w-8">Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {!isSampleStudent ? (
                      <>
                        <tr className="bg-slate-100/70 font-bold text-left">
                          <td colSpan={12} className="p-0.5 pl-1.5 text-[9px]">A. Kelompok Mata Pelajaran Umum</td>
                        </tr>
                        {[
                          'Pendidikan Agama dan Budi Pekerti*',
                          'Pendidikan Pancasila',
                          'Bahasa Indonesia',
                          'Pendidikan Jasmani, Olahraga, dan Kesehatan',
                          'Sejarah',
                          'Seni dan Budaya**: a. Seni Musik',
                          'Muatan Lokal**: a. Conversation'
                        ].map((subj, idx) => (
                          <tr key={idx}>
                            <td className="border-r border-slate-900 p-0.5">{idx + 1}.</td>
                            <td className="border-r border-slate-900 p-0.5 text-left font-medium">{subj}</td>
                            {[...Array(10)].map((_, cIdx) => (
                              <td key={cIdx} className={`p-0.5 font-mono ${cIdx < 9 ? 'border-r border-slate-900' : ''}`}>-</td>
                            ))}
                          </tr>
                        ))}
                        <tr className="bg-slate-100/70 font-bold text-left">
                          <td colSpan={12} className="p-0.5 pl-1.5 text-[9px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                        </tr>
                        {[
                          'Matematika',
                          'Bahasa Inggris',
                          'Informatika',
                          'Projek Ilmu Pengetahuan Alam dan Sosial****',
                          'Mata Pelajaran (Konsentrasi Keahlian)***',
                          'Projek Kreatif dan Kewirausahaan',
                          'Praktik Kerja Lapangan****',
                          'Mata Pelajaran Pilihan****',
                          'Dasar-dasar Program Keahlian'
                        ].map((subj, idx) => (
                          <tr key={idx}>
                            <td className="border-r border-slate-900 p-0.5">{idx + 1}.</td>
                            <td className="border-r border-slate-900 p-0.5 text-left font-medium">{subj}</td>
                            {[...Array(10)].map((_, cIdx) => (
                              <td key={cIdx} className={`p-0.5 font-mono ${cIdx < 9 ? 'border-r border-slate-900' : ''}`}>-</td>
                            ))}
                          </tr>
                        ))}
                        <tr className="bg-slate-100 font-bold">
                          <td colSpan={2} className="border-r border-slate-900 p-1 text-left pl-2 font-bold text-[9.5px]">Jumlah Nilai</td>
                          {[...Array(10)].map((_, cIdx) => (
                            <td key={cIdx} className={`p-1 font-mono font-bold text-[10px] ${cIdx < 9 ? 'border-r border-slate-900' : ''}`}>-</td>
                          ))}
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className="bg-slate-100/70 font-bold text-left">
                      <td colSpan={12} className="p-0.5 pl-1.5 text-[9px]">A. Kelompok Mata Pelajaran Umum</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">1.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Pendidikan Agama dan Budi Pekerti*</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">83</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">87</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">85</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">88</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">89</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">88,5</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">91</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">90</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">90,5</td>
                      <td className="p-0.5 font-mono font-bold">90</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">2.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Pendidikan Pancasila</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">82</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">86</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">85</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">88</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">86,5</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">90</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">89</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">89,5</td>
                      <td className="p-0.5 font-mono font-bold">89</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">3.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Bahasa Indonesia</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">80</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">82</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">81</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">90</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">87</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">91</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">91</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">91</td>
                      <td className="p-0.5 font-mono font-bold">91</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">4.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Pendidikan Jasmani, Olahraga, dan Kesehatan</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">73</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">80</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">76,5</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">85</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">95</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">90</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="p-0.5 font-mono font-bold">83</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">5.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Sejarah</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">78</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">81</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">79,5</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="p-0.5 font-mono font-bold">82</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">6.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Seni dan Budaya**: a. Seni Musik</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">85</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">95</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">90</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="p-0.5 font-mono font-bold">90</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">7.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Muatan Lokal**: a. Conversation</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">85</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">81</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">83</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="p-0.5 font-mono font-bold">83</td>
                    </tr>

                    <tr className="bg-slate-100/70 font-bold text-left">
                      <td colSpan={12} className="p-0.5 pl-1.5 text-[9px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">1.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Matematika</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">80</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">81</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">80,5</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">81</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">86</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">83,5</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">85</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">84,5</td>
                      <td className="p-0.5 font-mono font-bold">84</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">2.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Bahasa Inggris</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">83</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">86</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">84,5</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">88</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">86</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">86</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">87</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">86,5</td>
                      <td className="p-0.5 font-mono font-bold">87</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">3.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Informatika</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">89</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">92</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">90,5</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="p-0.5 font-mono font-bold">91</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">4.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Projek Ilmu Pengetahuan Alam dan Sosial****</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">84</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="p-0.5 font-mono font-bold">84</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">5.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Mata Pelajaran (Konsentrasi Keahlian)***</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">83</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">87</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">85</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">94</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">95</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">94,5</td>
                      <td className="p-0.5 font-mono font-bold">95</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">6.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Projek Kreatif dan Kewirausahaan</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">85</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">91</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">88</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">97</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">98</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">97,5</td>
                      <td className="p-0.5 font-mono font-bold">97</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">7.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Praktik Kerja Lapangan****</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">88</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">90</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">89</td>
                      <td className="p-0.5 font-mono font-bold">90</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">8.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">Mata Pelajaran Pilihan****</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono">-</td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold">-</td>
                      <td className="p-0.5 font-mono font-bold">-</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-0.5">9.</td>
                      <td className="border-r border-slate-900 p-0.5 text-left font-medium">
                        Dasar-dasar Program Keahlian:
                        <div className="pl-2">a. Dasar-dasar PPLG</div>
                        <div className="pl-2">b. Desain UI/UX</div>
                        <div className="pl-2">c. Pemrograman Gim</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono align-top">
                        <div className="h-3"></div>
                        <div>87</div>
                        <div>-</div>
                        <div>-</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono align-top">
                        <div className="h-3"></div>
                        <div>90</div>
                        <div>-</div>
                        <div>-</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold align-top">
                        <div className="h-3"></div>
                        <div>78,5</div>
                        <div>-</div>
                        <div>-</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono align-top">
                        <div className="h-3"></div>
                        <div>84</div>
                        <div>79</div>
                        <div>-</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono align-top">
                        <div className="h-3"></div>
                        <div>87</div>
                        <div>82</div>
                        <div>-</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold align-top">
                        <div className="h-3"></div>
                        <div>85,5</div>
                        <div>80,5</div>
                        <div>-</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono align-top">
                        <div className="h-3"></div>
                        <div>94</div>
                        <div>89</div>
                        <div>-</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono align-top">
                        <div className="h-3"></div>
                        <div>95</div>
                        <div>90</div>
                        <div>-</div>
                      </td>
                      <td className="border-r border-slate-900 p-0.5 font-mono font-bold align-top">
                        <div className="h-3"></div>
                        <div>94,5</div>
                        <div>89,5</div>
                        <div>-</div>
                      </td>
                      <td className="p-0.5 font-mono font-bold align-top">
                        <div className="h-3"></div>
                        <div>94</div>
                        <div>90</div>
                        <div>-</div>
                      </td>
                    </tr>

                    {/* JUMLAH NILAI (FOTO 3 ASLI: 989 | 1025 | 997 | 922 | 967 | 944,5 | ...) */}
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={2} className="border-r border-slate-900 p-1 text-left pl-2 font-bold text-[9.5px]">
                        Jumlah Nilai
                      </td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px]">989</td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px]">1025</td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px] text-blue-900">997</td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px]">922</td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px]">967</td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px] text-blue-900">944,5</td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px]">722</td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px]">735</td>
                      <td className="border-r border-slate-900 p-1 font-mono font-bold text-[10px] text-blue-900">728,5</td>
                      <td className="p-1 font-mono font-bold text-[10.5px] text-emerald-900">910</td>
                    </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan Transkrip Akhir (Kepala Sekolah & Cap) */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-400 text-center text-xs">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-semibold">Kepala Program Keahlian PPLG</p>
                  <div className="h-16"></div>
                  <input
                    type="text"
                    value={data.wali_xii_name}
                    onChange={(e) => setData('wali_xii_name', e.target.value)}
                    className="font-bold text-center border-b border-dotted border-slate-400 uppercase text-xs w-56 block mx-auto focus:bg-amber-50/40"
                  />
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="font-mono text-[10px]">NIP.</span>
                    <input
                      type="text"
                      value={data.wali_xii_nip}
                      onChange={(e) => setData('wali_xii_nip', e.target.value)}
                      className="font-mono text-[10px] border-b border-dotted border-slate-400 w-44 text-center focus:bg-amber-50/40"
                    />
                  </div>
                </div>

                <div>
                  <p>Beringin, {isSampleStudent ? '6 Mei 2026' : '-'}</p>
                  <p className="font-semibold">Kepala SMK Negeri 1 Beringin</p>
                  <div className="h-16"></div>
                  <input
                    type="text"
                    value={data.principal_name}
                    onChange={(e) => setData('principal_name', e.target.value)}
                    className="font-bold text-center border-b border-dotted border-slate-400 uppercase text-xs w-56 block mx-auto focus:bg-amber-50/40"
                  />
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="font-mono text-[10px]">NIP.</span>
                    <input
                      type="text"
                      value={data.principal_nip}
                      onChange={(e) => setData('principal_nip', e.target.value)}
                      className="font-mono text-[10px] border-b border-dotted border-slate-400 w-44 text-center focus:bg-amber-50/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>

          {/* Bottom Sheet Paging Bar (Desktop Only - Sticky within Content Area, Never Collides with Sidebar) */}
          <div className="hidden md:block print:hidden sticky bottom-4 z-20 px-4 pointer-events-none transition-all duration-300 mt-6">
            <div className="max-w-xl mx-auto neu-floating-dock p-2 sm:p-2.5 flex items-center justify-between gap-2 pointer-events-auto font-sans">
              <button
                type="button"
                onClick={handlePrevSheet}
                disabled={currentIndex <= 0 && activeSheetTab !== 'all'}
                className="neu-btn-tactile inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
                {currentIndex > 0 && (
                  <span className="hidden xl:inline text-[10px] font-normal text-slate-500">
                    ({sheetOrder[currentIndex - 1]?.shortLabel})
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="neu-badge text-[11px] font-bold px-3 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 font-mono whitespace-nowrap">
                  {activeSheetTab === 'all'
                    ? '📖 15 Hal Utuh'
                    : `${currentIndex + 1}/9: ${sheetOrder[currentIndex]?.shortLabel}`}
                </span>

                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={processing}
                  className="neu-btn-tactile inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-900 dark:text-white text-xs font-extrabold transition disabled:opacity-50 shrink-0"
                >
                  <Save className="w-3.5 h-3.5 text-blue-600" />
                  <span>{processing ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleNextSheet}
                disabled={currentIndex >= sheetOrder.length - 1 && activeSheetTab !== 'all'}
                className="neu-btn-primary-tactile inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                title="Halaman Selanjutnya"
              >
                {currentIndex < sheetOrder.length - 1 && (
                  <span className="hidden xl:inline text-[10px] font-normal text-blue-100">
                    ({sheetOrder[currentIndex + 1]?.shortLabel})
                  </span>
                )}
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

        {/* Modal Konfirmasi Hapus Siswa */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
              onClick={() => !isDeleting && setShowDeleteModal(false)}
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
                      {student.name}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      NISN: {student.nisn} • NIS: {student.nis}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Kelas: {student.current_class?.name || '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStudent}
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
      </div>
    </AppLayout>
  );
}
