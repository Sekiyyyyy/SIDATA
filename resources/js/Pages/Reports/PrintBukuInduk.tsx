import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AcademicYear, SchoolClass, SchoolProfile, Student, Subject } from '@/Types';
import { Printer, ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  student: Student & {
    nomor_urut?: string;
    daily_language?: string;
    rt_rw?: string;
    step_siblings_count?: number;
    foster_siblings_count?: number;
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
  };
  school: SchoolProfile | null;
  subjects?: Subject[];
  academicYears?: AcademicYear[];
  classes?: SchoolClass[];
}

function formatIndoDate(dateStr?: string | null) {
  if (!dateStr) return '-';
  try {
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr.toUpperCase();
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  } catch {
    return (dateStr || '-').toUpperCase();
  }
}

function DottedRow({ 
  label, 
  value, 
  sub = false, 
  labelWidth, 
  className = '' 
}: { 
  label: string; 
  value?: string | number | null; 
  sub?: boolean; 
  labelWidth?: string; 
  className?: string 
}) {
  const defaultWidth = sub ? 'pl-3 w-40 shrink-0' : 'w-44 shrink-0';
  const widthClass = labelWidth || defaultWidth;
  return (
    <div className={`flex items-baseline text-[10.5px] leading-tight py-[1.5px] min-w-0 ${className}`}>
      <span className={`${widthClass} text-slate-800`}>
        {label}
      </span>
      <span className="mx-0.5 shrink-0">:</span>
      <span className="font-semibold text-slate-950 uppercase shrink-0 mr-1 font-mono text-[11px] truncate max-w-[210px]">
        {value !== undefined && value !== null && value !== '' ? String(value) : '-'}
      </span>
      <span className="flex-1 border-b border-dotted border-slate-400 h-2.5 min-w-[12px]" />
    </div>
  );
}

export default function PrintBukuInduk({ student, school, subjects = [], academicYears = [], classes = [] }: Props) {
  const sheetOrder: Array<{
    id: 'lembar1' | 'lembar2' | 'raporX1' | 'raporX2' | 'raporXI1' | 'raporXI2' | 'raporXII1' | 'raporXII2' | 'lembar3';
    label: string;
    shortLabel: string;
    num: number;
  }> = [
    { id: 'lembar1', label: '1. Lembar 1: Biodata Siswa & Ortu', shortLabel: 'Lembar 1', num: 1 },
    { id: 'lembar2', label: '2. Lembar 2: Jasmani, Beasiswa & Buku Induk', shortLabel: 'Lembar 2', num: 2 },
    { id: 'raporX1', label: '3. Rapor X Smt 1 (Ganjil)', shortLabel: 'Rapor X1', num: 3 },
    { id: 'raporX2', label: '4. Rapor X Smt 2 (Naik XI)', shortLabel: 'Rapor X2', num: 4 },
    { id: 'raporXI1', label: '5. Rapor XI Smt 3 (Ganjil)', shortLabel: 'Rapor XI1', num: 5 },
    { id: 'raporXI2', label: '6. Rapor XI Smt 4 (Naik XII)', shortLabel: 'Rapor XI2', num: 6 },
    { id: 'raporXII1', label: '7. Rapor XII Smt 5 (PKL Industri)', shortLabel: 'Rapor XII1', num: 7 },
    { id: 'raporXII2', label: '8. Rapor XII Smt 6 (Kelulusan Akhir & Ijazah)', shortLabel: 'Rapor XII2', num: 8 },
    { id: 'lembar3', label: '9. Rekap Nilai 6 Smt (Halaman Terakhir)', shortLabel: 'Rekap 6 Smt', num: 9 },
  ];

  const [selectedView, setSelectedView] = useState<
    'all' | 'lembar1' | 'lembar2' | 'raporX1' | 'raporX2' | 'raporXI1' | 'raporXI2' | 'raporXII1' | 'raporXII2' | 'lembar3'
  >('all');

  const currentIndex = sheetOrder.findIndex((s) => s.id === selectedView);

  const handlePrevView = () => {
    if (selectedView === 'all') {
      setSelectedView('lembar3');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentIndex > 0) {
      setSelectedView(sheetOrder[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextView = () => {
    if (selectedView === 'all') {
      setSelectedView('lembar1');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentIndex < sheetOrder.length - 1) {
      setSelectedView(sheetOrder[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('print') === '1') {
        const timer = setTimeout(() => {
          window.print();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const parent = Array.isArray(student.parents) ? student.parents[0] : (student.parents || {});
  const guardian = student.guardian || {};
  const edu = student.education_history || student.educationHistory || {};
  const healthList = student.health_records || student.healthRecords || [];
  const health = Array.isArray(healthList) && healthList.length > 0 ? healthList[0] : {};
  const classHistories = student.class_histories || student.classHistories || [];

  const isSampleStudent = Boolean(
    student.id === 1 && (student.nis === '28354' || (student.name && student.name.toUpperCase().includes('ADITYA')))
  );

  // Wali kelas per grade level
  const historyX = classHistories.find((h: any) => h.school_class?.grade_level === 'X' || h.promotion_status?.includes('XI') || h.academic_year?.name?.includes('2023'));
  const historyXI = classHistories.find((h: any) => h.school_class?.grade_level === 'XI' || h.promotion_status?.includes('XII') || h.academic_year?.name?.includes('2024'));
  const historyXII = classHistories.find((h: any) => h.school_class?.grade_level === 'XII' || h.academic_year?.name?.includes('2025'));

  const waliXName = historyX?.wali_kelas?.name || (isSampleStudent ? 'ADISTY WARDHANI, S.Pd.I' : '-');
  const waliXNip = historyX?.wali_kelas?.nip || (isSampleStudent ? '19821231 201101 2 008' : '-');

  const waliXIName = historyXI?.wali_kelas?.name || (isSampleStudent ? 'NOVAYANTI, S.Pd.I' : '-');
  const waliXINip = historyXI?.wali_kelas?.nip || (isSampleStudent ? '19880721 201503 2 004' : '-');

  const waliXIIName = historyXII?.wali_kelas?.name || (isSampleStudent ? 'BUDI SANTOSO, S.Kom' : '-');
  const waliXIINip = historyXII?.wali_kelas?.nip || (isSampleStudent ? '19850312 201402 1 003' : '-');

  const principalName = school?.principal_name || 'HJ. HAFRIDA HANUM, S.Pd, M.Pd';
  const principalNip = school?.principal_nip || '19660414 199403 2 009';

  return (
    <div className="min-h-screen bg-slate-200 py-6 pb-28 print:py-0 print:pb-0 print:bg-white text-slate-950 font-serif">
      <Head title={`Buku Induk & Rapor Lengkap 15 Halaman - ${student.name}`} />

      {/* Print: margin halaman 0 agar header/footer browser (tanggal, judul, URL, no. halaman) hilang & kertas A4 terisi penuh */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0 !important; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .bi-sheet {
            width: 210mm !important;
            max-width: 210mm !important;
            min-height: 296mm !important;
            margin: 0 !important;
            padding: 12mm 14mm !important;
            box-sizing: border-box !important;
            border: none !important;
            box-shadow: none !important;
            break-after: page;
            page-break-after: always;
          }
        }
      `}</style>

      {/* Floating Action Bar (Hidden in Print) */}
      <div className="fixed top-3 left-3 right-3 sm:left-auto sm:right-4 z-50 flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 print:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-slate-700 p-2 sm:p-2.5 rounded-2xl shadow-xl font-sans">
        <Link
          href={`/students/${student.id}`}
          className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Kembali</span>
          <span className="xs:hidden">Kembali</span>
        </Link>

        {/* View Filter Dropdown - Sesuai urutan foto asli: Rekap 6 semester adalah HALAMAN TERAKHIR */}
        <select
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value as any)}
          className="flex-1 sm:flex-none max-w-[200px] sm:max-w-none px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 truncate"
        >
          <option value="all">📖 Semua Berkas (15 Halaman A4)</option>
          <option value="lembar1">1. Biodata Siswa & Ortu (Lbr 1)</option>
          <option value="lembar2">2. Jasmani & Beasiswa (Lbr 2)</option>
          <option value="raporX1">3. Rapor X Smt 1</option>
          <option value="raporX2">4. Rapor X Smt 2</option>
          <option value="raporXI1">5. Rapor XI Smt 3</option>
          <option value="raporXI2">6. Rapor XI Smt 4</option>
          <option value="raporXII1">7. Rapor XII Smt 5</option>
          <option value="raporXII2">8. Rapor XII Smt 6</option>
          <option value="lembar3">9. Rekap 6 Smt (Transkrip Master)</option>
        </select>

        <button
          type="button"
          onClick={handlePrint}
          className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center gap-1.5 sm:gap-2 shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak A4</span>
        </button>
      </div>

      {/* Mobile Notice Bar (Hidden on Desktop & Print) */}
      <div className="pt-14 sm:pt-4 px-3 block sm:hidden print:hidden font-sans">
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Pratinjau kertas A4 di bawah dapat digeser menyamping. Klik tombol <strong>Cetak A4</strong> di atas untuk cetak/simpan PDF resmi.</span>
        </div>
      </div>

      <div className="overflow-x-auto px-2 sm:px-0 print:overflow-visible">

      {/* ============================================================== */}
      {/* 1. LEMBAR 1 BUKU INDUK (BIODATA SISWA & ORTU)                  */}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'lembar1') && (
        <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-8 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
          <div className="flex gap-4 items-start mb-2">
            <div className="flex-1 space-y-1 text-[11px] pt-1">
              <div className="grid grid-cols-[165px_1fr_150px_1fr] items-baseline gap-1">
                <span className="text-slate-800">Nomor Induk Siswa</span>
                <div className="flex items-baseline">
                  <span className="mr-1">:</span>
                  <span className="font-bold font-mono text-[11.5px] mr-1">{student.nis}</span>
                  <span className="flex-1 border-b border-dotted border-slate-400 h-2.5" />
                </div>
                <span className="text-slate-800 pl-2">Nomor Kode Kecamatan</span>
                <div className="flex items-baseline">
                  <span className="mr-1">:</span>
                  <span className="font-bold font-mono text-[11px] mr-1">{isSampleStudent ? '0201' : '-'}</span>
                  <span className="flex-1 border-b border-dotted border-slate-400 h-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-[165px_1fr_150px_1fr] items-baseline gap-1">
                <span className="text-slate-800">Nomor Induk Siswa Nasional</span>
                <div className="flex items-baseline">
                  <span className="mr-1">:</span>
                  <span className="font-bold font-mono text-[11.5px] mr-1">{student.nisn}</span>
                  <span className="flex-1 border-b border-dotted border-slate-400 h-2.5" />
                </div>
                <span className="text-slate-800 pl-2">Nomor Kode Kab/kota</span>
                <div className="flex items-baseline">
                  <span className="mr-1">:</span>
                  <span className="font-bold font-mono text-[11px] mr-1">{isSampleStudent ? '02' : '-'}</span>
                  <span className="flex-1 border-b border-dotted border-slate-400 h-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-[165px_1fr_150px_1fr] items-baseline gap-1">
                <span className="text-slate-800">Nomor Kode Sekolah</span>
                <div className="flex items-baseline">
                  <span className="mr-1">:</span>
                  <span className="font-bold font-mono text-[11px] mr-1">{isSampleStudent ? '10258778' : '-'}</span>
                  <span className="flex-1 border-b border-dotted border-slate-400 h-2.5" />
                </div>
                <span className="text-slate-800 pl-2">Nomor Kode Provinsi</span>
                <div className="flex items-baseline">
                  <span className="mr-1">:</span>
                  <span className="font-bold font-mono text-[11px] mr-1">{isSampleStudent ? '32' : '-'}</span>
                  <span className="flex-1 border-b border-dotted border-slate-400 h-2.5" />
                </div>
              </div>
            </div>

            <div className="w-24 text-center shrink-0">
              <span className="text-[10px] text-slate-800 block mb-0.5">Nomor Urut :</span>
              <div className="border border-slate-900 h-10 flex items-center justify-center font-mono font-bold text-lg bg-slate-50">
                {student.nomor_urut || '1'}
              </div>
            </div>
          </div>

          <div className="text-center py-2.5 border-y-2 border-double border-slate-900 my-2">
            <h1 className="text-base font-extrabold tracking-wider uppercase text-slate-950">
              LEMBAR BUKU INDUK PESERTA DIDIK
            </h1>
            <p className="text-xs font-semibold text-slate-700 tracking-wide mt-0.5">
              SEKOLAH MENENGAH KEJURUAN (SMK) NEGERI 1 BERINGIN
            </p>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <div className="text-[11.5px] font-bold text-slate-950 uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                  A. KETERANGAN TENTANG DIRI PESERTA DIDIK
                </div>
                <div className="space-y-[1px]">
                  <DottedRow label="1. Nama Lengkap Peserta Didik" value={student.name} />
                  <DottedRow label="2. Nama Panggilan" value={student.nickname || '-'} />
                  <DottedRow label="3. Jenis Kelamin" value={student.gender} />
                  <DottedRow label="4. Tempat dan Tanggal Lahir" value={student.birth_place || student.birth_date ? `${student.birth_place || '-'}, ${formatIndoDate(student.birth_date)}` : '-'} />
                  <DottedRow label="5. Agama" value={student.religion || '-'} />
                  <DottedRow label="6. Kewarganegaraan" value={student.citizenship || (isSampleStudent ? 'INDONESIA' : '-')} />
                  <DottedRow label="7. Anak ke berapa" value={student.child_order || (isSampleStudent ? '1 (SATU)' : '-')} />
                  <DottedRow label="8. Jumlah Saudara Kandung" value={student.siblings_count !== undefined && student.siblings_count !== null ? `${student.siblings_count} ORANG` : (isSampleStudent ? '2 ORANG' : '-')} />
                  <DottedRow label="   Jumlah Saudara Tiri / Angkat" value={student.step_siblings_count !== undefined && student.step_siblings_count !== null ? `${student.step_siblings_count} / ${student.foster_siblings_count ?? 0} ORANG` : (isSampleStudent ? '0 / 0 ORANG' : '-')} sub />
                  <DottedRow label="9. Anak Yatim / Piatu / Yatim Piatu" value="-" />
                  <DottedRow label="10. Bahasa Sehari-hari di Rumah" value={student.daily_language || (isSampleStudent ? 'BAHASA INDONESIA' : '-')} />
                </div>
              </div>

              <div>
                <div className="text-[11.5px] font-bold text-slate-950 uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                  B. KETERANGAN TEMPAT TINGGAL
                </div>
                <div className="space-y-[1px]">
                  <DottedRow label="11. Alamat Tempat Tinggal" value={student.address || '-'} />
                  <DottedRow label="    RT / RW" value={student.rt_rw || '-'} sub />
                  <DottedRow label="    Kelurahan / Desa" value={student.village || '-'} sub />
                  <DottedRow label="    Kecamatan" value={student.district || '-'} sub />
                  <DottedRow label="    Kabupaten / Kota" value={student.regency || (isSampleStudent ? 'DELI SERDANG' : '-')} sub />
                  <DottedRow label="    Provinsi" value={student.province || (isSampleStudent ? 'SUMATERA UTARA' : '-')} sub />
                  <DottedRow label="    Kode Pos / Nomor Telepon" value={student.postal_code || student.phone ? `${student.postal_code || '-'} / ${student.phone || '-'}` : (isSampleStudent ? '20552 / 0831 8006 8288' : '-')} sub />
                  <DottedRow label="12. Tinggal dengan Siapa" value={student.residence_type || (isSampleStudent ? 'BERSAMA ORANG TUA' : '-')} />
                  <DottedRow label="13. Jarak Tempat Tinggal ke Sekolah" value={student.distance_to_school || (isSampleStudent ? '5 KM' : '-')} />
                </div>
              </div>

              <div>
                <div className="text-[11.5px] font-bold text-slate-950 uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                  C. KETERANGAN ORANG TUA KANDUNG
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="space-y-[1px]">
                    <div className="font-bold text-[11px] underline text-slate-900 mb-0.5">Ayah Kandung :</div>
                    <DottedRow labelWidth="w-[125px] shrink-0" label="14. Nama Ayah" value={parent.father_name || '-'} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="15. Tempat & Tgl Lahir" value={isSampleStudent ? "LUBUK PAKAM, 10 MEI 1978" : "-"} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="16. Agama" value={isSampleStudent ? "ISLAM" : "-"} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="17. Kewarganegaraan" value={isSampleStudent ? "INDONESIA" : "-"} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="18. Pendidikan Tertinggi" value={parent.father_education || (isSampleStudent ? 'SLTA / SEDERAJAT' : '-')} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="19. Pekerjaan" value={parent.father_job || (isSampleStudent ? 'BURUH HARIAN LEPAS' : '-')} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="20. Penghasilan Per Bulan" value={isSampleStudent ? "Rp 2.500.000,-" : "-"} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="21. Alamat / No. HP" value={student.address || parent.father_phone ? `${student.address || '-'} / ${parent.father_phone || '-'}` : (isSampleStudent ? 'DESA ARAS KABU / 0838 4341 3678' : '-')} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="22. Masih Hidup / Meninggal" value={isSampleStudent ? "MASIH HIDUP" : "-"} />
                  </div>

                  <div className="space-y-[1px]">
                    <div className="font-bold text-[11px] underline text-slate-900 mb-0.5">Ibu Kandung :</div>
                    <DottedRow labelWidth="w-[125px] shrink-0" label="23. Nama Ibu" value={parent.mother_name || '-'} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="24. Tempat & Tgl Lahir" value={isSampleStudent ? "LUBUK PAKAM, 05 AGUSTUS 1980" : "-"} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="25. Agama" value={isSampleStudent ? "ISLAM" : "-"} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="26. Kewarganegaraan" value={isSampleStudent ? "INDONESIA" : "-"} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="27. Pendidikan Tertinggi" value={parent.mother_education || (isSampleStudent ? 'SD / SEDERAJAT' : '-')} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="28. Pekerjaan" value={parent.mother_job || (isSampleStudent ? 'IBU RUMAH TANGGA' : '-')} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="29. Penghasilan Per Bulan" value="-" />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="30. Alamat / No. HP" value={student.address || parent.mother_phone ? `${student.address || '-'} / ${parent.mother_phone || '-'}` : (isSampleStudent ? 'DESA ARAS KABU / 0838 4341 3678' : '-')} />
                    <DottedRow labelWidth="w-[125px] shrink-0" label="31. Masih Hidup / Meninggal" value={isSampleStudent ? "MASIH HIDUP" : "-"} />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11.5px] font-bold text-slate-950 uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                  D. KETERANGAN TENTANG WALI
                </div>
                <div className="space-y-[1px]">
                  <DottedRow label="32. Nama Lengkap Wali" value={guardian.name || '-'} />
                  <DottedRow label="33. Pekerjaan Wali" value={guardian.job || '-'} />
                  <DottedRow label="34. Alamat Tempat Tinggal" value={guardian.address || '-'} />
                </div>
              </div>

              <div>
                <div className="text-[11.5px] font-bold text-slate-950 uppercase border-b border-slate-800 pb-0.5 mb-1 tracking-wide">
                  E. PERKEMBANGAN PESERTA DIDIK
                </div>
                <div className="space-y-[1px]">
                  <DottedRow label="35. Pendidikan Sebelumnya (SMP)" value={edu.school_name || (isSampleStudent ? 'SMP NEGERI 3 LUBUK PAKAM' : '-')} />
                  <DottedRow label="36. Tanggal dan Nomor Ijazah SMP" value={edu.certificate_number ? `${edu.certificate_date || '-'}, ${edu.certificate_number}` : (isSampleStudent ? '9 JUNI 2023, DN-07/D-SMP/K13/23/0040627' : '-')} />
                  <DottedRow label="37. Diterima di SMK Negeri 1 Beringin" value={isSampleStudent ? "KELAS X (PPLG) - TANGGAL 10 JULI 2023" : (student.current_class ? `KELAS ${student.current_class.name}` : '-')} />
                </div>
              </div>
            </div>

            {/* Kolom Pas Foto Fisik 3x4 (Sesuai Format Fisik Buku Induk SMKN 1 Beringin) */}
            <div className="w-[32mm] shrink-0 flex flex-col items-center gap-3 pt-0.5">
              {/* Box 1: Saat Masuk / Kelas X */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[30mm] h-[40mm] border border-slate-900 bg-white flex flex-col items-center justify-center p-1">
                  <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider">Pas Foto</span>
                  <span className="text-[8px] text-slate-500">Ukuran</span>
                  <span className="text-[11px] font-mono font-bold text-slate-900">3 x 4</span>
                  <span className="text-[7.5px] text-slate-500 mt-1 font-sans">(Saat Masuk)</span>
                </div>
                <p className="text-[7px] text-center text-slate-600 leading-tight w-[30mm] mt-1">
                  Cap tiga jari tengah mengenai pas photo bagian bawah
                </p>
              </div>

              {/* Box 2: Naik Kelas XI */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[30mm] h-[40mm] border border-slate-900 bg-white flex flex-col items-center justify-center p-1">
                  <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider">Pas Foto</span>
                  <span className="text-[8px] text-slate-500">Ukuran</span>
                  <span className="text-[11px] font-mono font-bold text-slate-900">3 x 4</span>
                  <span className="text-[7.5px] text-slate-500 mt-1 font-sans">(Kelas XI)</span>
                </div>
                <p className="text-[7px] text-center text-slate-600 leading-tight w-[30mm] mt-1">
                  Cap tiga jari tengah mengenai pas photo bagian bawah
                </p>
              </div>

              {/* Box 3: Naik Kelas XII */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[30mm] h-[40mm] border border-slate-900 bg-white flex flex-col items-center justify-center p-1">
                  <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider">Pas Foto</span>
                  <span className="text-[8px] text-slate-500">Ukuran</span>
                  <span className="text-[11px] font-mono font-bold text-slate-900">3 x 4</span>
                  <span className="text-[7.5px] text-slate-500 mt-1 font-sans">(Kelas XII)</span>
                </div>
                <p className="text-[7px] text-center text-slate-600 leading-tight w-[30mm] mt-1">
                  Cap tiga jari tengah mengenai pas photo bagian bawah
                </p>
              </div>

              {/* Box 4: Lulus / Ijazah */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[30mm] h-[40mm] border border-slate-900 bg-white flex flex-col items-center justify-center p-1">
                  <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wider">Pas Foto</span>
                  <span className="text-[8px] text-slate-500">Ukuran</span>
                  <span className="text-[11px] font-mono font-bold text-slate-900">3 x 4</span>
                  <span className="text-[7.5px] text-slate-500 mt-1 font-sans">(Ijazah)</span>
                </div>
                <p className="text-[7px] text-center text-slate-600 leading-tight w-[30mm] mt-1">
                  Cap tiga jari tengah mengenai pas photo bagian bawah
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. LEMBAR 2 BUKU INDUK (JASMANI 6 SMT, PRESTASI, BEASISWA)     */}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'lembar2') && (
        <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-8 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
          <div className="text-center py-2.5 border-y-2 border-double border-slate-900 mb-4">
            <h1 className="text-base font-extrabold tracking-wider uppercase text-slate-950">
              LEMBAR BUKU INDUK PESERTA DIDIK (LANJUTAN)
            </h1>
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
              <DottedRow label="21. Tamat Belajar / Lulus Tahun" value={isSampleStudent ? "2026" : (student.graduation?.academic_year || '-')} />
              <DottedRow label="    Nomor Ijazah / STTB" value={isSampleStudent ? "DN-07/M-SMK/K13/2026/0012345" : (student.graduation?.certificate_number || '-')} sub />
              <DottedRow label="    Melanjutkan ke Perguruan Tinggi" value={isSampleStudent ? "UNIVERSITAS SUMATERA UTARA (USU)" : '-'} sub />
              <DottedRow label="22. Pindah Sekolah ke" value="-" />
              <DottedRow label="23. Keluar Sekolah / Alasan" value="-" />
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
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '155 cm' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '158 cm' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '160 cm' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '162 cm' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '163 cm' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '165 cm' : '-'}</td>
                  <td className="p-1 text-[9.5px]">{isSampleStudent ? 'Pertumbuhan Baik' : '-'}</td>
                </tr>
                <tr>
                  <td className="border-r border-slate-900 p-1">2</td>
                  <td className="border-r border-slate-900 p-1 text-left font-medium">Berat Badan (kg)</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '35 kg' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '38 kg' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '42 kg' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '45 kg' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '48 kg' : '-'}</td>
                  <td className="border-r border-slate-900 p-1 font-mono">{isSampleStudent ? '50 kg' : '-'}</td>
                  <td className="p-1 text-[9.5px]">{isSampleStudent ? 'Normal & Sehat' : '-'}</td>
                </tr>
                <tr>
                  <td className="border-r border-slate-900 p-1">3</td>
                  <td className="border-r border-slate-900 p-1 text-left font-medium">Penyakit yang pernah diderita</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="p-1 text-[9.5px]">Sehat</td>
                </tr>
                <tr>
                  <td className="border-r border-slate-900 p-1">4</td>
                  <td className="border-r border-slate-900 p-1 text-left font-medium">Kelainan jika ada</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="border-r border-slate-900 p-1 font-mono">-</td>
                  <td className="p-1 text-[9.5px]">Nihil</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <div className="text-[11px] font-bold text-slate-900 mb-1">
              2. Prestasi Peserta Didik
            </div>
            <table className="w-full border border-slate-900 text-[10px] text-center border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-100 font-bold">
                  <th className="border-r border-slate-900 p-1 w-8">No</th>
                  <th className="border-r border-slate-900 p-1 w-28">Jenis Prestasi</th>
                  <th className="border-r border-slate-900 p-1 w-32">Tingkat Prestasi</th>
                  <th className="border-r border-slate-900 p-1">Nama Prestasi</th>
                  <th className="border-r border-slate-900 p-1 w-20">Tahun</th>
                  <th className="border-r border-slate-900 p-1 w-36">Penyelenggara</th>
                  <th className="p-1 w-24">Peringkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {isSampleStudent ? (
                  <>
                    <tr>
                      <td className="border-r border-slate-900 p-1">1</td>
                      <td className="border-r border-slate-900 p-1">Akademik</td>
                      <td className="border-r border-slate-900 p-1">Kabupaten/Kota</td>
                      <td className="border-r border-slate-900 p-1 text-left font-medium">Lomba Cerdas Cermat Jenjang SMK</td>
                      <td className="border-r border-slate-900 p-1 font-mono">2023</td>
                      <td className="border-r border-slate-900 p-1">Disdik Deli Serdang</td>
                      <td className="p-1 font-bold">Peserta Terbaik</td>
                    </tr>
                    <tr>
                      <td className="border-r border-slate-900 p-1">2</td>
                      <td className="border-r border-slate-900 p-1">Kejuruan</td>
                      <td className="border-r border-slate-900 p-1">Kabupaten/Kota</td>
                      <td className="border-r border-slate-900 p-1 text-left font-medium">LKS Web Technology & Mobile Design</td>
                      <td className="border-r border-slate-900 p-1 font-mono">2024</td>
                      <td className="border-r border-slate-900 p-1">MKKS SMK Deli Serdang</td>
                      <td className="p-1 font-bold">Juara II</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={7} className="p-2 text-slate-500 italic text-center">- Belum ada catatan prestasi -</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <div className="text-[11px] font-bold text-slate-900 mb-1">
              3. Beasiswa Peserta Didik
            </div>
            <table className="w-full border border-slate-900 text-[10px] text-center border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-100 font-bold">
                  <th className="border-r border-slate-900 p-1 w-36">Jenis Beasiswa</th>
                  <th className="border-r border-slate-900 p-1">Keterangan / Sumber</th>
                  <th className="border-r border-slate-900 p-1 w-28">Tahun Mulai</th>
                  <th className="p-1 w-28">Tahun Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {isSampleStudent ? (
                  <tr>
                    <td className="border-r border-slate-900 p-1 font-medium">Prestasi Siswa</td>
                    <td className="border-r border-slate-900 p-1 text-left">Beasiswa Murid Berprestasi Disdik Deli Serdang</td>
                    <td className="border-r border-slate-900 p-1 font-mono">2024</td>
                    <td className="p-1 font-mono">2025</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="p-2 text-slate-500 italic text-center">- Belum ada catatan beasiswa -</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 text-center text-xs border-t border-slate-400">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Wali Kelas {student.current_class?.name || 'X PPLG 2'}</p>
              <div className="h-16"></div>
              <p className="font-bold underline uppercase">{waliXName}</p>
              <p className="font-mono text-[10px]">NIP. {waliXNip}</p>
            </div>

            <div>
              <p>Beringin, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-semibold">Kepala SMK Negeri 1 Beringin</p>
              <div className="h-16"></div>
              <p className="font-bold underline uppercase">{principalName}</p>
              <p className="font-mono text-[10px]">NIP. {principalNip}</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. RAPOR KELAS X SEMESTER 1 GANJIL (FOTO 11 & 5 ASLI)          */}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'raporX1') && (
        <>
          {/* Halaman Depan Rapor X1 */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
              </h2>
            </div>

            <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-400">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                <span>Kelas</span><span>:</span><strong>{student.current_class?.name || (isSampleStudent ? 'X PPLG 2' : '-')}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                <span>Fase</span><span>:</span><strong>{isSampleStudent ? 'E' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Sekolah</span><span>:</span><strong>SMKN 1 BERINGIN</strong>
                <span>Semester</span><span>:</span><strong>1 (GANJIL)</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Alamat</span><span>:</span><strong>JL. PENDIDIKAN NO. 3</strong>
                <span>Tahun Pelajaran</span><span>:</span><strong>{isSampleStudent ? '2023/2024' : '-'}</strong>
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
                    <th className="border-r border-slate-900 p-0.5 w-11">Nilai Akhir</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                    <th className="p-0.5 w-10">KKTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Agama dan Budi Pekerti*</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">83</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Syu'abul iman, implementasi fikih muamalah</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Pancasila</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">82</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Penerapan nilai-nilai pancasila dalam masyarakat</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Indonesia</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">80</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Teks laporan, teks anekdot, dan hikayat</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Jasmani, Olahraga, dan Kesehatan</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">73</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Bola voli, bulu tangkis, sepak bola, basket, dan atletik</td>
                    <td className="p-0.5 text-center font-mono">70</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Sejarah</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">78</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Ilmu Sejarah dan Kerajaan Hindu Budha</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Seni Budaya**: a. Seni Musik</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">85</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Tehnik permainan alat musik dan karya musik</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">7.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Muatan Lokal**: a. Conversation</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">85</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Berkomunikasi dengan menggunakan teks naratif</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>

                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Matematika</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">80</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Barisan aritmatika, persamaan linear dan bentuk akar</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Inggris</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">83</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Teks deskriptif, recount, dan procedure</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Informatika</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">89</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Algoritma dan penggunaan aplikasi perkantoran</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Projek Ilmu Pengetahuan Alam dan Sosial****</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Perubahan fisika, kimia, dan biologi dan dinamika sosial</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Dasar-dasar Program Keahlian: a. Dasar-dasar PPLG</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">87</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Konsep dasar perangkat lunak dan gim serta budaya kerja</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>

                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">989</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-slate-700">Tuntas Seluruh Capaian Pembelajaran</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">82,41</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-blue-900">Predikat: Baik</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C. PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5) */}
            <div className="mb-2">
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">
                C. PROJEK PENGUATAN PROFIL PELAJARAN PANCASILA (P5)
              </div>
              <div className="text-[8.5px] mb-1 text-slate-800">
                Tema Projek 1 : Pembuatan Pupuk Organik (Eco Enzym) | Tema Projek 2 : Senam pagi setiap hari Jum'at | Tema Projek 3 : Kunjungan industri ke PT. Buana Mitra Nusantara
              </div>
              <table className="w-full border border-slate-900 text-[8.5px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-44 text-left">Dimensi</th>
                    <th className="border-r border-slate-900 p-0.5 w-32 text-left">Elemen</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Sub-Elemen</th>
                    <th className="p-0.5 w-32">Target Fase/Pencapaian di Akhir Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Beriman, Bertakwa kepada Tuhan YME...</td>
                    <td className="border-r border-slate-900 p-0.5">Akhlak kepada alam</td>
                    <td className="border-r border-slate-900 p-0.5">Mewujudkan dan membangun kesadaran peduli lingkungan</td>
                    <td className="p-0.5 text-center font-semibold">Mulai berkembang</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Berkebhinekaan Global</td>
                    <td className="border-r border-slate-900 p-0.5">-</td>
                    <td className="border-r border-slate-900 p-0.5">-</td>
                    <td className="p-0.5 text-center">-</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bergotong Royong</td>
                    <td className="border-r border-slate-900 p-0.5">Kolaborasi</td>
                    <td className="border-r border-slate-900 p-0.5">Bersinergi untuk kebaikan</td>
                    <td className="p-0.5 text-center font-semibold">Mulai berkembang</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mandiri</td>
                    <td className="border-r border-slate-900 p-0.5">-</td>
                    <td className="border-r border-slate-900 p-0.5">-</td>
                    <td className="p-0.5 text-center">-</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bernalar Kritis</td>
                    <td className="border-r border-slate-900 p-0.5">-</td>
                    <td className="border-r border-slate-900 p-0.5">-</td>
                    <td className="p-0.5 text-center">-</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Kreatif</td>
                    <td className="border-r border-slate-900 p-0.5">Keluwesan berpikir</td>
                    <td className="border-r border-slate-900 p-0.5">Bereksperimen secara kreatif</td>
                    <td className="p-0.5 text-center font-semibold">Mulai berkembang</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* D. EKSTRAKURIKULER */}
            <div>
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">D. EKSTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-8">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-64 text-left">Ekstrakurikuler</th>
                    <th className="p-0.5 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Praja Muda Karana (Pramuka)</td>
                    <td className="p-0.5">Aktif dalam kegiatan kepramukaan sekolah</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">PMR (Palang Merah Remaja)</td>
                    <td className="p-0.5">Melaksanakan kegiatan PMR dengan sangat baik</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Halaman Belakang Rapor X1 (Foto 5) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            {/* E. PRESTASI */}
            <div className="mb-4">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">E. PRESTASI</div>
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
                  <tr>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2 font-mono">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="p-2">-</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2 font-mono">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="p-2">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* F. KETIDAKHADIRAN & TANDA TANGAN */}
            <div className="mb-6">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
              <table className="w-full border border-slate-900 text-[10px] border-collapse">
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td rowSpan={3} className="border-r border-slate-900 p-1.5 w-40 font-semibold align-top">
                      Ketidakhadiran
                    </td>
                    <td className="border-r border-slate-900 p-1.5 w-48">Sakit</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono w-28">- hari</td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                      <p className="font-semibold text-xs">Wali Kelas</p>
                      <div className="h-14"></div>
                      <p className="font-bold underline uppercase text-xs">KUSMIARTI, S.Pd</p>
                      <p className="font-mono text-[9.5px]">NIP. 199308152025212150</p>
                    </td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                      <p className="font-semibold text-xs">Mengetahui,</p>
                      <p className="font-semibold text-xs">Kepala Sekolah</p>
                      <div className="h-12"></div>
                      <p className="font-bold underline uppercase text-xs">{principalName}</p>
                      <p className="font-mono text-[9.5px]">NIP. {principalNip}</p>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Izin</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Footnotes */}
            <div className="text-[9px] text-slate-700 space-y-0.5 border-t border-slate-400 pt-3">
              <p className="font-bold">Keterangan:</p>
              <p>* Diikuti oleh peserta didik sesuai dengan agama masing-masing.</p>
              <p>** Paling banyak 2 (dua) JP per minggu atau 72 (tujuh puluh dua) JP per tahun.</p>
              <p>*** Nama mata pelajaran merupakan nama konsentrasi keahlian.</p>
              <p>**** Nama mata pelajaran merupakan mata pelajaran yang dipilih oleh peserta didik.</p>
              <p>***** Total JP tidak termasuk mata pelajaran muatan lokal dan/atau mata pelajaran tambahan yang diselenggarakan oleh satuan pendidikan.</p>
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 4. RAPOR KELAS X SEMESTER 2 GENAP (FOTO 13 ASLI - NAIK KELAS)  */}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'raporX2') && (
        <>
          {/* Halaman Depan Rapor X2 */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
              </h2>
            </div>

            <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-400">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                <span>Kelas</span><span>:</span><strong>{student.current_class?.name || (isSampleStudent ? 'X PPLG 2' : '-')}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                <span>Fase</span><span>:</span><strong>{isSampleStudent ? 'E' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Sekolah</span><span>:</span><strong>SMKN 1 BERINGIN</strong>
                <span>Semester</span><span>:</span><strong>2 (GENAP)</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Alamat</span><span>:</span><strong>JL. PENDIDIKAN NO. 3</strong>
                <span>Tahun Pelajaran</span><span>:</span><strong>{isSampleStudent ? '2023/2024' : '-'}</strong>
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
                    <th className="border-r border-slate-900 p-0.5 w-11">Nilai Akhir</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                    <th className="p-0.5 w-10">KKTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Agama dan Budi Pekerti*</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">87</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis cabang iman dan tawakal kepadanya dengan pengamalan baik</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Pancasila</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">86</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami kolaborasi budaya yang ada di Indonesia dalam persatuan bangsa</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Indonesia</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">82</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menulis teks negosiasi, biografi, dan teks puisi dengan kaidah bahasa tepat</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Jasmani, Olahraga, dan Kesehatan</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">80</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mempraktikkan aktivitas jasmani untuk kesehatan dan kebugaran tubuh</td>
                    <td className="p-0.5 text-center font-mono">70</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Sejarah</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">81</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis kerajaan Islam dalam ruang lingkup global dan pengaruhnya</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Seni Budaya**: a. Seni Musik</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">95</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mengorganisasi pementasan seni dalam kepanitiaan secara bertanggung jawab</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">7.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Muatan Lokal**: a. Conversation</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">81</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Berinteraksi dengan lancar dan memahami pantun serta majas sastra daerah</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>

                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Matematika</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">81</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menentukan mean, median, dan modus pada data serta peluang kejadian</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Inggris</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">86</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mempresentasikan teks prosedur dan teks narasi dengan pelafalan jelas</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Informatika</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">92</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Merancang program komputer sederhana sebagai solusi persoalan sehari-hari</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Projek Ilmu Pengetahuan Alam dan Sosial****</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mempresentasikan fenomena tata surya dan interaksi sosial dengan media</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Dasar-dasar Program Keahlian: a. Dasar-dasar PPLG</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">90</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Melakukan pemrograman terstruktur perangkat lunak dan gim secara mandiri</td>
                    <td className="p-0.5 text-center font-mono">75</td>
                  </tr>

                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">1025</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-slate-700">Tuntas Seluruh Capaian Pembelajaran</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">85,42</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-blue-900">Predikat: Amat Baik</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C. P5 & D. Ekskul X2 */}
            <div className="mb-2">
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">
                C. PROJEK PENGUATAN PROFIL PELAJARAN PANCASILA (P5)
              </div>
              <div className="text-[8.5px] mb-1 text-slate-800">
                Tema Projek 1 : Pengolahan Sampah Plastik Menjadi Produk Bernilai | Tema Projek 2 : Pementasan Seni Budaya Nusantara
              </div>
              <table className="w-full border border-slate-900 text-[8.5px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-44 text-left">Dimensi</th>
                    <th className="border-r border-slate-900 p-0.5 w-32 text-left">Elemen</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Sub-Elemen</th>
                    <th className="p-0.5 w-32">Target Fase/Pencapaian di Akhir Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Beriman, Bertakwa kepada Tuhan YME...</td>
                    <td className="border-r border-slate-900 p-0.5">Akhlak pribadi</td>
                    <td className="border-r border-slate-900 p-0.5">Integritas dan tanggung jawab sosial</td>
                    <td className="p-0.5 text-center font-semibold">Berkembang Sesuai Harapan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bergotong Royong</td>
                    <td className="border-r border-slate-900 p-0.5">Kepedulian</td>
                    <td className="border-r border-slate-900 p-0.5">Tanggap terhadap lingkungan sosial</td>
                    <td className="p-0.5 text-center font-semibold">Berkembang Sesuai Harapan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Kreatif</td>
                    <td className="border-r border-slate-900 p-0.5">Karya orisinil</td>
                    <td className="border-r border-slate-900 p-0.5">Menciptakan purwarupa daur ulang sampah</td>
                    <td className="p-0.5 text-center font-semibold">Sangat Berkembang</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">D. EKSTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-8">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-64 text-left">Ekstrakurikuler</th>
                    <th className="p-0.5 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Praja Muda Karana (Pramuka)</td>
                    <td className="p-0.5">Aktif dan berdisiplin tinggi dalam perkemahan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">PMR (Palang Merah Remaja)</td>
                    <td className="p-0.5">Melaksanakan kegiatan PMR dengan sangat baik</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Halaman Belakang Rapor X2 (Foto 13 ASLI - Kenaikan Kelas ke XI) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            {/* E. PRESTASI */}
            <div className="mb-4">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">E. PRESTASI</div>
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
                  <tr>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2 font-mono">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="p-2">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* F. KETIDAKHADIRAN & KEPUTUSAN KENAIKAN KELAS (FOTO 13) */}
            <div className="mb-6">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
              <table className="w-full border border-slate-900 text-[10px] border-collapse">
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td rowSpan={4} className="border-r border-slate-900 p-1.5 w-36 font-semibold align-top">
                      Ketidakhadiran
                    </td>
                    <td className="border-r border-slate-900 p-1.5 w-40">Sakit</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono w-24">1 hari</td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                      <p className="font-semibold text-xs">Wali Kelas</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline uppercase text-xs">Adisty Wardhani, S.Pd.I</p>
                      <p className="font-mono text-[9.5px]">NIP. 19821231 201101 2 008</p>
                    </td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                      <p className="font-semibold text-xs">Mengetahui,</p>
                      <p className="font-semibold text-xs">Kepala Sekolah</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline uppercase text-xs">{principalName}</p>
                      <p className="font-mono text-[9.5px]">NIP. {principalNip}</p>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Izin</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  {/* KOTAK KEPUTUSAN KENAIKAN KELAS (FOTO 13) */}
                  <tr>
                    <td colSpan={2} className="border-r border-slate-900 p-2 bg-slate-50">
                      <p className="font-bold text-[10px]">Keputusan:</p>
                      <p className="text-[9.5px] leading-tight">Berdasarkan Hasil Belajar pada Semester 1 dan II, peserta didik ditetapkan:</p>
                      <div className="my-1 text-[11px] font-extrabold text-blue-950 uppercase border-y border-slate-800 py-0.5">
                        Naik Ke Kelas : XI PPLG 2
                      </div>
                      <p className="text-[9.5px]">Tanggal : 22 Juni 2024</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Footnotes */}
            <div className="text-[9px] text-slate-700 space-y-0.5 border-t border-slate-400 pt-3">
              <p className="font-bold">Keterangan:</p>
              <p>* Diikuti oleh peserta didik sesuai dengan agama masing-masing.</p>
              <p>** Paling banyak 2 (dua) JP per minggu atau 72 (tujuh puluh dua) JP per tahun.</p>
              <p>*** Nama mata pelajaran merupakan nama konsentrasi keahlian.</p>
              <p>**** Nama mata pelajaran merupakan mata pelajaran yang dipilih oleh peserta didik.</p>
              <p>***** Total JP tidak termasuk mata pelajaran muatan lokal dan/atau mata pelajaran tambahan yang diselenggarakan oleh satuan pendidikan.</p>
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 5. RAPOR KELAS XI SEMESTER 3 GANJIL (FOTO 6 & 9 ASLI)          */}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'raporXI1') && (
        <>
          {/* Halaman Depan Rapor XI 1 (Foto 6) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
              </h2>
            </div>

            <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-400">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                <span>Kelas</span><span>:</span><strong>{isSampleStudent ? 'XI PPLG 2' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                <span>Fase</span><span>:</span><strong>{isSampleStudent ? 'F' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Sekolah</span><span>:</span><strong>SMKN 1 BERINGIN</strong>
                <span>Semester</span><span>:</span><strong>3 (GANJIL)</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Alamat</span><span>:</span><strong>JL. PENDIDIKAN NO. 3</strong>
                <span>Tahun Pelajaran</span><span>:</span><strong>{isSampleStudent ? '2024/2025' : '-'}</strong>
              </div>
            </div>

            {/* B. INTRAKURIKULER XI 1 (Foto 6) */}
            <div className="mb-2">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                    <th className="border-r border-slate-900 p-0.5 w-11">Nilai Akhir</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                    <th className="p-0.5 w-10">KKTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Agama dan Budi Pekerti*</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">88</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menjelaskan hukum rukun ilmu kalam, khusur makna dakwah/khutbah/tablig</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Pancasila</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">85</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menjelaskan tentang akar sejarah konstitusi RI dan penerapan nilai-nilai Pancasila</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Indonesia</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami teks argumentasi, teks berita dan teks cerpen</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Jasmani, Olahraga, dan Kesehatan</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">85</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mempraktikkan latihan kebugaran jasmani dan keterampilan gerak</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Sejarah</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis teks proklamasi dan tokoh-tokoh proklamasi</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Muatan Lokal**: a. Conversation</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Berkomunikasi bahasa asing terapan industri dengan percaya diri</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>

                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Matematika</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">81</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menjelaskan konsep notasi dan elemen matriks, fungsi komposisi fungsi invers</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Inggris</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mempresentasikan teks deskriptif, teks analytical exposition dan teks prosedur</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran (Konsentrasi Keahlian)***</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">83</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Membuat website dan pemahaman konsep dasar CSS</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Projek Kreatif dan Kewirausahaan</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">85</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mengembangkan multimedia analog dan digital, memahami konsep peluang dan risiko usaha</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran Pilihan****: a. Desain UI/UX</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami alur kerja perancangan UI/UX, prototyping visual, user testing dan literasi digital</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran Pilihan****: b. Pemrograman Gim</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">79</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami dasar pemrograman berbasis teks dan grafis</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>

                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">922</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-slate-700">Tuntas Seluruh Capaian Pembelajaran</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">84,00</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-blue-900">Predikat: Baik</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C. P5 & D. Ekskul XI 1 (Foto 6) */}
            <div className="mb-2">
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">
                C. PROJEK PENGUATAN PROFIL PELAJARAN PANCASILA (P5)
              </div>
              <div className="text-[8.5px] mb-1 text-slate-800">
                Tema Projek 1 : Sehat Jasmani | Tema Projek 2 : Siap Bekerja | Tema Projek 3 : Siap Berkarya
              </div>
              <table className="w-full border border-slate-900 text-[8.5px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-44 text-left">Dimensi</th>
                    <th className="border-r border-slate-900 p-0.5 w-32 text-left">Elemen</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Sub-Elemen</th>
                    <th className="p-0.5 w-32">Target Fase/Pencapaian di Akhir Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Beriman, Bertakwa kepada Tuhan YME...</td>
                    <td className="border-r border-slate-900 p-0.5">Akhlak kepada manusia</td>
                    <td className="border-r border-slate-900 p-0.5">Melakukan perbuatan baik kepada orang lain</td>
                    <td className="p-0.5 text-center font-semibold">Berkembang Sesuai Harapan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bergotong Royong</td>
                    <td className="border-r border-slate-900 p-0.5">Kolaborasi</td>
                    <td className="border-r border-slate-900 p-0.5">Menjalin kerjasama bersinergi</td>
                    <td className="p-0.5 text-center font-semibold">Sedang Berkembang</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Kreatif</td>
                    <td className="border-r border-slate-900 p-0.5">Gagasan orisinil</td>
                    <td className="border-r border-slate-900 p-0.5">Melahirkan gagasan berdasarkan pemikiran sendiri</td>
                    <td className="p-0.5 text-center font-semibold">Sedang Berkembang</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">D. EKSTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-8">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-64 text-left">Ekstrakurikuler</th>
                    <th className="p-0.5 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Praja Muda Karana (Pramuka)</td>
                    <td className="p-0.5">Aktif dan mandiri dalam kegiatan penegak</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">PMR (Palang Merah Remaja)</td>
                    <td className="p-0.5">Melaksanakan kegiatan PMR dengan sangat baik</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Halaman Belakang Rapor XI 1 (Foto 9) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="mb-4">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">E. PRESTASI</div>
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
                  <tr>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2 font-mono">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="p-2">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-6">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
              <table className="w-full border border-slate-900 text-[10px] border-collapse">
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td rowSpan={3} className="border-r border-slate-900 p-1.5 w-40 font-semibold align-top">
                      Ketidakhadiran
                    </td>
                    <td className="border-r border-slate-900 p-1.5 w-48">Sakit</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono w-28">- hari</td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                      <p className="font-semibold text-xs">Wali Kelas</p>
                      <div className="h-14"></div>
                      <p className="font-bold underline uppercase text-xs">Novayanti, S.Pd.I</p>
                      <p className="font-mono text-[9.5px]">NIP. 19880721 201503 2 004</p>
                    </td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                      <p className="font-semibold text-xs">Mengetahui,</p>
                      <p className="font-semibold text-xs">Kepala Sekolah</p>
                      <div className="h-12"></div>
                      <p className="font-bold underline uppercase text-xs">{principalName}</p>
                      <p className="font-mono text-[9.5px]">NIP. {principalNip}</p>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Izin</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
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
        </>
      )}

      {/* ============================================================== */}
      {/* 6. RAPOR KELAS XI SEMESTER 4 GENAP (FOTO 10 & 8 ASLI - NAIK XII)*/}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'raporXI2') && (
        <>
          {/* Halaman Depan Rapor XI 2 (Foto 10) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
              </h2>
            </div>

            <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-400">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                <span>Kelas</span><span>:</span><strong>{isSampleStudent ? 'XI PPLG 2' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                <span>Fase</span><span>:</span><strong>{isSampleStudent ? 'F' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Sekolah</span><span>:</span><strong>SMKN 1 BERINGIN</strong>
                <span>Semester</span><span>:</span><strong>4 (GENAP)</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Alamat</span><span>:</span><strong>JL. PENDIDIKAN NO. 3</strong>
                <span>Tahun Pelajaran</span><span>:</span><strong>{isSampleStudent ? '2024/2025' : '-'}</strong>
              </div>
            </div>

            {/* B. INTRAKURIKULER XI 2 (Foto 10) */}
            <div className="mb-2">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                    <th className="border-r border-slate-900 p-0.5 w-11">Nilai Akhir</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                    <th className="p-0.5 w-10">KKTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Agama dan Budi Pekerti*</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">89</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Membaca dan menganalisis QS Yunus/10:40-41 dan QS Al Maidah/5:32</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Pancasila</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">88</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis penanganan konflik di tengah keragaman masyarakat Indonesia</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Indonesia</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">90</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menemukan tema dan pesan yang menginspirasi dalam karya sastra</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Jasmani, Olahraga, dan Kesehatan</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">95</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mempraktikkan berbagai keterampilan gerak dan kebugaran jasmani pribadi</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Sejarah</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis secara kritis dan kreatif mengenai dinamika perlawanan bangsa</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Muatan Lokal**: a. Conversation</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">87</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mampu melakukan interview kerja teknis dalam percakapan Bahasa Inggris</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>

                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Matematika</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">86</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menentukan determinan dan invers matriks maksimal ordo 3x3</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Inggris</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">88</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mengidentifikasi ciri-ciri kebahasaan teks narrative dan teks recount</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran (Konsentrasi Keahlian)***</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">87</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menunjukkan penguasaan yang baik dalam menerapkan konsep dasar CSS</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Projek Kreatif dan Kewirausahaan</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">91</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menyusun rancangan prototype produk perangkat lunak bernilai jual</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran Pilihan****: a. Design UI/UX</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">87</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menjelaskan desain UI untuk berbagai ukuran layar, responsive layout dan media queries</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran Pilihan****: b. Pemrograman Gim</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">82</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Mengintegrasikan objek statis dan dinamis ke dalam gim engine</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>

                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">967</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-slate-700">Tuntas Seluruh Capaian Pembelajaran</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">87,90</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-blue-900">Predikat: Amat Baik</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C. P5 & D. Ekskul XI 2 */}
            <div className="mb-2">
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">
                C. PROJEK PENGUATAN PROFIL PELAJARAN PANCASILA (P5)
              </div>
              <div className="text-[8.5px] mb-1 text-slate-800">
                Tema Projek 1 : Festival Makanan Tradisional | Tema Projek 2 : Menulis dan mempraktikkan Profesi Impian
              </div>
              <table className="w-full border border-slate-900 text-[8.5px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-44 text-left">Dimensi</th>
                    <th className="border-r border-slate-900 p-0.5 w-32 text-left">Elemen</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Sub-Elemen</th>
                    <th className="p-0.5 w-32">Target Fase/Pencapaian di Akhir Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Beriman, Bertakwa kepada Tuhan YME...</td>
                    <td className="border-r border-slate-900 p-0.5">Akhlak kepada manusia</td>
                    <td className="border-r border-slate-900 p-0.5">Melakukan perbuatan baik kepada orang lain</td>
                    <td className="p-0.5 text-center font-semibold">Berkembang Sesuai Harapan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Berkebhinekaan Global</td>
                    <td className="border-r border-slate-900 p-0.5">Berkeadilan sosial</td>
                    <td className="border-r border-slate-900 p-0.5">Memahami konsep hak dan kewajiban bersama</td>
                    <td className="p-0.5 text-center font-semibold">Berkembang Sesuai Harapan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bergotong Royong</td>
                    <td className="border-r border-slate-900 p-0.5">Berkolaborasi</td>
                    <td className="border-r border-slate-900 p-0.5">Menyelaraskan kapasitas kelompok</td>
                    <td className="p-0.5 text-center font-semibold">Berkembang Sesuai Harapan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mandiri</td>
                    <td className="border-r border-slate-900 p-0.5">Kemandirian diri</td>
                    <td className="border-r border-slate-900 p-0.5">Mempunyai komitmen tinggi pada tugas pribadi</td>
                    <td className="p-0.5 text-center font-semibold">Sangat Berkembang</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bernalar Kritis</td>
                    <td className="border-r border-slate-900 p-0.5">Memperoleh & memproses informasi</td>
                    <td className="border-r border-slate-900 p-0.5">Mengajukan pertanyaan mendalam</td>
                    <td className="p-0.5 text-center font-semibold">Sangat Berkembang</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">D. EKSTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-8">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-64 text-left">Ekstrakurikuler</th>
                    <th className="p-0.5 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Praja Muda Karana (Pramuka)</td>
                    <td className="p-0.5">Aktif dan berdedikasi dalam kegiatan kepanduan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">PMR (Palang Merah Remaja)</td>
                    <td className="p-0.5">Melaksanakan kegiatan PMR dengan sangat baik</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Halaman Belakang Rapor XI 2 (Foto 8 ASLI - Kenaikan ke XII) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="mb-4">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">E. PRESTASI</div>
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
                  <tr>
                    <td className="border-r border-slate-900 p-2">Kejuruan</td>
                    <td className="border-r border-slate-900 p-2">Kabupaten/Kota</td>
                    <td className="border-r border-slate-900 p-2 text-left font-semibold">LKS Web Technology & Mobile Design</td>
                    <td className="border-r border-slate-900 p-2 font-mono">2024</td>
                    <td className="border-r border-slate-900 p-2">MKKS Deli Serdang</td>
                    <td className="p-2 font-bold">Juara II</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* F. KETIDAKHADIRAN & KEPUTUSAN KENAIKAN KE XII (FOTO 8) */}
            <div className="mb-6">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
              <table className="w-full border border-slate-900 text-[10px] border-collapse">
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td rowSpan={4} className="border-r border-slate-900 p-1.5 w-36 font-semibold align-top">
                      Ketidakhadiran
                    </td>
                    <td className="border-r border-slate-900 p-1.5 w-40">Sakit</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono w-24">- hari</td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                      <p className="font-semibold text-xs">Wali Kelas</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline uppercase text-xs">Novayanti, S.Pd.I</p>
                      <p className="font-mono text-[9.5px]">NIP. 19880721 201503 2 004</p>
                    </td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                      <p className="font-semibold text-xs">Mengetahui,</p>
                      <p className="font-semibold text-xs">Kepala Sekolah</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline uppercase text-xs">{principalName}</p>
                      <p className="font-mono text-[9.5px]">NIP. {principalNip}</p>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Izin</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  {/* KOTAK KEPUTUSAN KENAIKAN KELAS KE XII (FOTO 8) */}
                  <tr>
                    <td colSpan={2} className="border-r border-slate-900 p-2 bg-slate-50">
                      <p className="font-bold text-[10px]">Keputusan:</p>
                      <p className="text-[9.5px] leading-tight">Berdasarkan Hasil Belajar pada Semester 1 dan II, peserta didik ditetapkan:</p>
                      <div className="my-1 text-[11px] font-extrabold text-blue-950 uppercase border-y border-slate-800 py-0.5">
                        Naik Ke Kelas : XII PPLG 2
                      </div>
                      <p className="text-[9.5px]">Tanggal : 21 Juni 2025</p>
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
        </>
      )}

      {/* ============================================================== */}
      {/* 7. RAPOR KELAS XII SEMESTER 5 GANJIL (FOTO 7 ASLI - PKL)       */}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'raporXII1') && (
        <>
          {/* Halaman Depan Rapor XII 1 (Foto 7) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
              </h2>
            </div>

            <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-400">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                <span>Kelas</span><span>:</span><strong>{isSampleStudent ? 'XII PPLG 2' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                <span>Fase</span><span>:</span><strong>{isSampleStudent ? 'F' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Sekolah</span><span>:</span><strong>SMKN 1 BERINGIN</strong>
                <span>Semester</span><span>:</span><strong>5 (GANJIL)</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Alamat</span><span>:</span><strong>JL. PENDIDIKAN NO. 3</strong>
                <span>Tahun Pelajaran</span><span>:</span><strong>{isSampleStudent ? '2025/2026' : '-'}</strong>
              </div>
            </div>

            {/* B. INTRAKURIKULER XII 1 (Foto 7) */}
            <div className="mb-2">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                    <th className="border-r border-slate-900 p-0.5 w-11">Nilai Akhir</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                    <th className="p-0.5 w-10">KKTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Agama dan Budi Pekerti*</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">91</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis terjemahan mengenai sikap sabar dalam menghadapi ujian</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Pancasila</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">90</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menerapkan nilai Pancasila</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Indonesia</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">91</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menemukan dan menggunakan informasi ide kewirausahaan, fenomena AI</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Muatan Lokal**: a. Conversation</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">85</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Berkomunikasi lisan dalam konteks industri kerja profesional</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>

                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Matematika</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">84</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis dan mengolah permutasi</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Inggris</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">86</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis teks naratif dan argumentatif</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran (Konsentrasi Keahlian)***</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">94</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami konsep bahasa pemrograman serta pembuatannya</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Projek Kreatif dan Kewirausahaan</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">97</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami dasar hukum HAKI</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Praktik Kerja Lapangan (PKL Industri)****</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">88</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Melaksanakan magang industri di PT Buana Mitra Nusantara secara disiplin</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran Pilihan****: a. Design UI/UX</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">94</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Merancang platform</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">7.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran Pilihan****: b. Pengembangan Gim</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">89</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menggunakan game engine Unity</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>

                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">979</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-slate-700">Tuntas Seluruh Capaian Pembelajaran</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">89,00</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-blue-900">Predikat: Amat Baik</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C. P5 & D. Ekskul XII 1 */}
            <div className="mb-2">
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">
                C. PROJEK PENGUATAN PROFIL PELAJARAN PANCASILA (P5)
              </div>
              <div className="text-[8.5px] mb-1 text-slate-800">
                Tema Projek 1 : Kebekerjaan & Budaya Kerja Industri | Tema Projek 2 : Rekayasa Teknologi Perangkat Lunak
              </div>
              <table className="w-full border border-slate-900 text-[8.5px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-44 text-left">Dimensi</th>
                    <th className="border-r border-slate-900 p-0.5 w-32 text-left">Elemen</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Sub-Elemen</th>
                    <th className="p-0.5 w-32">Target Fase/Pencapaian di Akhir Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mandiri</td>
                    <td className="border-r border-slate-900 p-0.5">Regulasi diri</td>
                    <td className="border-r border-slate-900 p-0.5">Mengendalikan diri dan disiplin kerja industri</td>
                    <td className="p-0.5 text-center font-semibold">Sangat Berkembang</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bernalar Kritis</td>
                    <td className="border-r border-slate-900 p-0.5">Refleksi pemikiran</td>
                    <td className="border-r border-slate-900 p-0.5">Menyelesaikan permasalahan teknis secara logis</td>
                    <td className="p-0.5 text-center font-semibold">Sangat Berkembang</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">D. EKSTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-8">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-64 text-left">Ekstrakurikuler</th>
                    <th className="p-0.5 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Praja Muda Karana (Pramuka)</td>
                    <td className="p-0.5">Penegak Bantara aktif</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Halaman Belakang Rapor XII 1 */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="mb-4">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">E. PRESTASI</div>
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
                  <tr>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="border-r border-slate-900 p-2 font-mono">-</td>
                    <td className="border-r border-slate-900 p-2">-</td>
                    <td className="p-2">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-6">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">F. KETIDAKHADIRAN</div>
              <table className="w-full border border-slate-900 text-[10px] border-collapse">
                <tbody>
                  <tr className="border-b border-slate-900">
                    <td rowSpan={3} className="border-r border-slate-900 p-1.5 w-40 font-semibold align-top">
                      Ketidakhadiran
                    </td>
                    <td className="border-r border-slate-900 p-1.5 w-48">Sakit</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono w-28">- hari</td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                      <p className="font-semibold text-xs">Wali Kelas</p>
                      <div className="h-14"></div>
                      <p className="font-bold underline uppercase text-xs">{waliXIIName}</p>
                      <p className="font-mono text-[9.5px]">NIP. {waliXIINip}</p>
                    </td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={3}>
                      <p className="font-semibold text-xs">Mengetahui,</p>
                      <p className="font-semibold text-xs">Kepala Sekolah</p>
                      <div className="h-12"></div>
                      <p className="font-bold underline uppercase text-xs">{principalName}</p>
                      <p className="font-mono text-[9.5px]">NIP. {principalNip}</p>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Izin</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-1.5">Tanpa Keterangan</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
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
        </>
      )}

      {/* ============================================================== */}
      {/* 8. RAPOR KELAS XII SEMESTER 6 GENAP (FOTO 4 & 1 ASLI - LULUS)  */}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'raporXII2') && (
        <>
          {/* Halaman Depan Rapor XII 2 (Foto 4) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="text-center py-1.5 border-b-2 border-slate-900 mb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
                LAPORAN HASIL PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
              </h2>
            </div>

            <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-400">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
                <span>Kelas</span><span>:</span><strong>{isSampleStudent ? 'XII PPLG 2' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
                <span>Fase</span><span>:</span><strong>{isSampleStudent ? 'F' : '-'}</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Nama Sekolah</span><span>:</span><strong>SMKN 1 BERINGIN</strong>
                <span>Semester</span><span>:</span><strong>6 (GENAP)</strong>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
                <span>Alamat</span><span>:</span><strong>JL. PENDIDIKAN NO. 3</strong>
                <span>Tahun Pelajaran</span><span>:</span><strong>{isSampleStudent ? '2025/2026' : '-'}</strong>
              </div>
            </div>

            {/* B. INTRAKURIKULER XII 2 (Foto 4) */}
            <div className="mb-2">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">B. INTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Mata Pelajaran</th>
                    <th className="border-r border-slate-900 p-0.5 w-11">Nilai Akhir</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Capaian Kompetensi Pembelajaran</th>
                    <th className="p-0.5 w-10">KKTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">A. Kelompok Mata Pelajaran Umum</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Agama dan Budi Pekerti*</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">90</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami ilmu kalam</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Pendidikan Pancasila</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">89</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menganalisis identitas kelompok lokal, regional</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Indonesia</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">91</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami isi teks cerita</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Muatan Lokal**: a. Conversation</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">86</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Wawancara kerja teknis dan presentasi portofolio industri dengan lancar</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>

                  <tr className="bg-slate-100/70 font-bold text-left">
                    <td colSpan={5} className="p-0.5 pl-1.5 text-[9.5px]">B. Kelompok Mata Pelajaran Kejuruan</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Matematika</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">85</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menyelesaikan masalah fungsi aljabar dan anuitas</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Bahasa Inggris</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">87</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menulis dan mempresentasikan hortatory exposition text</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran (Konsentrasi Keahlian)***</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">95</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Pemrograman SQL, PBO, GUI dan pembuatan web statis</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">4.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Projek Kreatif dan Kewirausahaan</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">98</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Membuat produk website toko online layak jual</td>
                    <td className="p-0.5 text-center font-mono">80</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">5.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Praktik Kerja Lapangan / UKK****</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">90</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Uji Kompetensi Keahlian Kejuruan Bersertifikat Kompeten BNSP</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">6.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran Pilihan****: a. Design UI/UX</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">90</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Menerapkan standar WCAG dan praktik terbaik mobile UI</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">7.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mata Pelajaran Pilihan****: b. Pemrograman Gim</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold">89</td>
                    <td className="border-r border-slate-900 p-0.5 text-[8.5px]">Memahami source code dan melakukan pembaruan gim</td>
                    <td className="p-0.5 text-center font-mono">78</td>
                  </tr>

                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Jumlah Nilai</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">990</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-slate-700">Tuntas Seluruh Capaian Pembelajaran</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border-r border-slate-900 p-0.5 text-left pl-2">Rata-rata</td>
                    <td className="border-r border-slate-900 p-0.5 text-center font-mono font-bold text-[10px]">90,00</td>
                    <td colSpan={2} className="p-0.5 text-left pl-2 text-[9px] text-blue-900">Predikat: Amat Baik (Lulus UKK)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C. P5 & D. Ekskul XII 2 (Foto 4) */}
            <div className="mb-2">
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">
                C. PROJEK PENGUATAN PROFIL PELAJARAN PANCASILA (P5)
              </div>
              <div className="text-[8.5px] mb-1 text-slate-800">
                Tema Projek 1 : Portofolio Digital Kelulusan | Tema Projek 2 : Edukasi Hak Cipta Perangkat Lunak
              </div>
              <table className="w-full border border-slate-900 text-[8.5px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-6">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-44 text-left">Dimensi</th>
                    <th className="border-r border-slate-900 p-0.5 w-32 text-left">Elemen</th>
                    <th className="border-r border-slate-900 p-0.5 text-left">Sub-Elemen</th>
                    <th className="p-0.5 w-32">Target Fase/Pencapaian di Akhir Bulan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Beriman, Bertakwa kepada Tuhan YME...</td>
                    <td className="border-r border-slate-900 p-0.5">Akhlak bernegara</td>
                    <td className="border-r border-slate-900 p-0.5">Mendukung integritas karya dan hukum HAKI</td>
                    <td className="p-0.5 text-center font-semibold">Sangat Berkembang</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">2.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Mandiri</td>
                    <td className="border-r border-slate-900 p-0.5">Percaya diri</td>
                    <td className="border-r border-slate-900 p-0.5">Mampu menyajikan portofolio karya profesional</td>
                    <td className="p-0.5 text-center font-semibold">Sangat Berkembang</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">3.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Kreatif</td>
                    <td className="border-r border-slate-900 p-0.5">Karya aplikatif</td>
                    <td className="border-r border-slate-900 p-0.5">Mempublikasikan aplikasi bernilai ekonomi</td>
                    <td className="p-0.5 text-center font-semibold">Sangat Berkembang</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div className="font-bold text-[10px] uppercase text-slate-900 mb-0.5">D. EKSTRAKURIKULER</div>
              <table className="w-full border border-slate-900 text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 font-bold text-center">
                    <th className="border-r border-slate-900 p-0.5 w-8">No.</th>
                    <th className="border-r border-slate-900 p-0.5 w-64 text-left">Ekstrakurikuler</th>
                    <th className="p-0.5 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="border-r border-slate-900 p-0.5 text-center">1.</td>
                    <td className="border-r border-slate-900 p-0.5 font-medium">Praja Muda Karana (Pramuka)</td>
                    <td className="p-0.5">Penegak Garuda / Berkelakuan Baik</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Halaman Belakang Rapor XII 2 (Foto 1 ASLI - KEPUTUSAN KELULUSAN & IJAZAH) */}
          <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
            <div className="mb-4">
              <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-1">E. PRESTASI</div>
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
                  <tr>
                    <td className="border-r border-slate-900 p-2">Sertifikasi BNSP</td>
                    <td className="border-r border-slate-900 p-2">Nasional</td>
                    <td className="border-r border-slate-900 p-2 text-left font-semibold">Uji Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak</td>
                    <td className="border-r border-slate-900 p-2 font-mono">2026</td>
                    <td className="border-r border-slate-900 p-2">LSP-P1 SMKN 1 Beringin / BNSP</td>
                    <td className="p-2 font-bold">KOMPETEN</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono w-24">- hari</td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                      <div className="mb-2">
                        <span className="font-bold block text-xs">STATUS AKHIR</span>
                        <span className="text-sm font-black underline uppercase text-emerald-800">L U L U S</span>
                      </div>
                      <p className="text-[10px] text-slate-600 mb-1">Tanggal : 5 Mei 2026</p>
                      <p className="font-semibold text-xs mt-3">Wali Kelas</p>
                      <div className="h-10"></div>
                      <p className="font-bold underline uppercase text-xs">{waliXIIName}</p>
                      <p className="font-mono text-[9.5px]">NIP. {waliXIINip}</p>
                    </td>
                    <td className="p-2 w-56 text-center align-top" rowSpan={4}>
                      <p className="font-semibold text-xs">Mengetahui,</p>
                      <p className="font-semibold text-xs">Kepala Sekolah</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline uppercase text-xs">{principalName}</p>
                      <p className="font-mono text-[9.5px]">NIP. {principalNip}</p>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Izin</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  <tr className="border-b border-slate-900">
                    <td className="border-r border-slate-900 p-1.5">Tanpa Kehadiran</td>
                    <td className="border-r border-slate-900 p-1.5 text-center font-mono">- hari</td>
                  </tr>
                  {/* KOTAK KEPUTUSAN KELULUSAN & NO IJAZAH (FOTO 1 ASLI) */}
                  <tr>
                    <td colSpan={2} className="border-r border-slate-900 p-2 bg-slate-50">
                      <p className="font-bold text-[10px]">Keputusan:</p>
                      <p className="text-[9.5px] leading-tight">
                        Berdasarkan Hasil Belajar yang dicapai Peserta Didik ditetapkan: <strong>LULUS</strong>
                      </p>
                      <div className="mt-1 space-y-0.5 text-[9.5px]">
                        <div>No. Ijazah : <strong className="font-mono">DN-07/M-SMK/K13/2026/0012345</strong></div>
                        <div>No. SKHUS : <strong className="font-mono">DN-07/D-SMK/2026/0054321</strong></div>
                        <div>Tgl / Bln / Thn : <strong className="font-mono">05 / 05 / 2026</strong></div>
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
        </>
      )}

      {/* ============================================================== */}
      {/* 9. HALAMAN TERAKHIR: REKAPITULASI HASIL BELAJAR 6 SEMESTER     */}
      {/* (FOTO 3 ASLI: LAPORAN HASIL AKHIR PEMBELAJARAN KURIKULUM MERDEKA)*/}
      {/* ============================================================== */}
      {(selectedView === 'all' || selectedView === 'lembar3') && (
        <div className="bi-sheet max-w-[210mm] mx-auto bg-white p-7 print:p-6 border border-slate-400 print:border-none mb-8 print:mb-0 print:break-after-page min-h-[297mm]">
          <div className="text-center py-2 border-b-2 border-slate-900 mb-2">
            <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-950">
              LAPORAN HASIL AKHIR PEMBELAJARAN PESERTA DIDIK KURIKULUM MERDEKA
            </h2>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
              (REKAPITULASI NILAI 6 SEMESTER - TRANSKRIP MASTER KELULUSAN)
            </p>
          </div>

          <div className="text-[10px] space-y-0.5 mb-2 pb-1 border-b border-slate-400">
            <div className="font-bold text-[10.5px] uppercase text-slate-900 mb-0.5">A. IDENTITAS PESERTA DIDIK</div>
            <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
              <span>Nama Peserta Didik</span><span>:</span><strong className="uppercase">{student.name}</strong>
              <span>Kelas</span><span>:</span><strong>{isSampleStudent ? 'XII PPLG 2' : '-'}</strong>
            </div>
            <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
              <span>NISN / NIS</span><span>:</span><strong className="font-mono">{student.nisn} / {student.nis}</strong>
              <span>Fase</span><span>:</span><strong>{isSampleStudent ? 'F' : '-'}</strong>
            </div>
            <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
              <span>Nama Sekolah</span><span>:</span><strong>SMKN 1 BERINGIN</strong>
              <span>Semester</span><span>:</span><strong>1 s.d. 6 (LULUS)</strong>
            </div>
            <div className="grid grid-cols-[140px_10px_1fr_100px_10px_1fr] items-baseline">
              <span>Alamat</span><span>:</span><strong>JL. PENDIDIKAN NO. 3</strong>
              <span>Tahun Pelajaran</span><span>:</span><strong>{isSampleStudent ? '2023/2024 s.d. 2025/2026' : '-'}</strong>
            </div>
          </div>

          {/* B. INTRAKURIKULER TABEL 6 SEMESTER LENGKAP (FOTO 3 ASLI) */}
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
                  <th className="border-r border-slate-900 p-0.5 w-8">Semester Ganjil Nilai Akhir</th>
                  <th className="border-r border-slate-900 p-0.5 w-8">Semester Genap Nilai Akhir</th>
                  <th className="border-r border-slate-900 p-0.5 w-8">Rata-rata</th>
                  <th className="border-r border-slate-900 p-0.5 w-8">Semester Ganjil Nilai Akhir</th>
                  <th className="border-r border-slate-900 p-0.5 w-8">Semester Genap Nilai Akhir</th>
                  <th className="border-r border-slate-900 p-0.5 w-8">Rata-rata</th>
                  <th className="border-r border-slate-900 p-0.5 w-8">Semester Ganjil Nilai Akhir</th>
                  <th className="border-r border-slate-900 p-0.5 w-8">Semester Genap Nilai Akhir</th>
                  <th className="border-r border-slate-900 p-0.5 w-8">Rata-rata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
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
              </tbody>
            </table>
          </div>

          {/* Tanda Tangan Transkrip Akhir (Kepala Sekolah & Cap) */}
          <div className="grid grid-cols-2 gap-8 pt-6 mt-4 text-center text-xs">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala Program Keahlian PPLG</p>
              <div className="h-16"></div>
              <p className="font-bold underline uppercase">Budi Santoso, S.Kom</p>
              <p className="font-mono text-[10px]">NIP. 19850312 201402 1 003</p>
            </div>

            <div>
              <p>Beringin, 6 Mei 2026</p>
              <p className="font-semibold">Kepala SMK Negeri 1 Beringin</p>
              <div className="h-16"></div>
              <p className="font-bold underline uppercase">{principalName}</p>
              <p className="font-mono text-[10px]">NIP. {principalNip}</p>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Bottom Paging Navigation Bar (Fixed Floating, print:hidden) */}
      <div className="fixed bottom-3 inset-x-0 z-50 px-4 pointer-events-none print:hidden">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-slate-300 p-3 sm:p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 pointer-events-auto font-sans">
          <button
            type="button"
            onClick={handlePrevView}
            disabled={currentIndex <= 0 && selectedView !== 'all'}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
            {currentIndex > 0 && (
              <span className="hidden sm:inline text-[11px] font-normal text-slate-500">
                ({sheetOrder[currentIndex - 1]?.shortLabel})
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-mono">
              {selectedView === 'all'
                ? '📖 Semua Berkas (15 Hal)'
                : `${currentIndex + 1} / 9: ${sheetOrder[currentIndex]?.shortLabel}`}
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Berkas Ini</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleNextView}
            disabled={currentIndex >= sheetOrder.length - 1 && selectedView !== 'all'}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Halaman Selanjutnya"
          >
            {currentIndex < sheetOrder.length - 1 && (
              <span className="hidden sm:inline text-[11px] font-normal text-blue-100">
                ({sheetOrder[currentIndex + 1]?.shortLabel})
              </span>
            )}
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
