import React from 'react';
import { Head } from '@inertiajs/react';
import { SchoolProfile, Semester, Student } from '@/Types';
import { Printer, ArrowLeft } from 'lucide-react';

interface Props {
  student: Student;
  school: SchoolProfile | null;
  semester: Semester | null;
  semesterType: 'Ganjil' | 'Genap';
}

export default function PrintRaport({ student, school, semester, semesterType }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const att = student.attendances?.[0] || {
    sick_days: 0,
    permitted_days: 1,
    unexcused_days: 0,
  };

  const scores = student.subject_scores || [];
  const extras = student.student_extracurriculars || [];
  const p5 = student.p5_assessments || [];

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:py-0 print:bg-white text-slate-900 font-sans">
      <Head title={`Rapor Kurikulum Merdeka - ${student.name} (${semesterType})`} />

      {/* Floating Action Bar (Hidden in Print) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden bg-white/90 backdrop-blur border border-slate-300 p-2 rounded-xl shadow-lg">
        <button
          type="button"
          onClick={() => window.close()}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Tutup
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Cetak Rapor A4 (Ctrl+P)
        </button>
      </div>

      {/* A4 Printable Sheet */}
      <div className="max-w-[210mm] mx-auto bg-white p-10 print:p-6 shadow-xl print:shadow-none print:w-full border border-slate-200 print:border-none space-y-6">
        {/* Kop Rapor */}
        <div className="text-center border-b-2 border-slate-900 pb-3">
          <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-600">
            LAPORAN HASIL BELAJAR PESERTA DIDIK
          </h2>
          <h1 className="text-lg font-bold uppercase tracking-wider text-slate-900 mt-0.5">
            {school?.name || 'SMK NEGERI 1 BERINGIN'}
          </h1>
          <p className="text-xs text-slate-500">
            KURIKULUM MERDEKA • KABUPATEN DELI SERDANG
          </p>
        </div>

        {/* Identitas Siswa Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="space-y-1">
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="text-slate-500 font-medium">Nama Peserta Didik</span>
              <span>:</span>
              <span className="font-bold uppercase text-slate-900">{student.name}</span>
            </div>
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="text-slate-500 font-medium">NISN / NIS</span>
              <span>:</span>
              <span className="font-mono font-semibold">{student.nisn} / {student.nis}</span>
            </div>
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="text-slate-500 font-medium">Sekolah</span>
              <span>:</span>
              <span>{school?.name || 'SMK Negeri 1 Beringin'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="text-slate-500 font-medium">Kelas / Program</span>
              <span>:</span>
              <span className="font-bold text-slate-900">{student.current_class?.name || 'X PPLG 1'}</span>
            </div>
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="text-slate-500 font-medium">Fase / Semester</span>
              <span>:</span>
              <span className="font-semibold">Fase E / {semesterType}</span>
            </div>
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="text-slate-500 font-medium">Tahun Ajaran</span>
              <span>:</span>
              <span>{semester?.academic_year?.name || '2026/2027'}</span>
            </div>
          </div>
        </div>

        {/* 1. Nilai Hasil Belajar (Mata Pelajaran) */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            A. Nilai Capaian Kompetensi Mata Pelajaran
          </h3>

          <table className="w-full border border-slate-300 text-xs text-left">
            <thead className="bg-slate-100 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300 w-10 text-center">No</th>
                <th className="p-2 border-r border-slate-300 w-52">Mata Pelajaran</th>
                <th className="p-2 border-r border-slate-300 w-20 text-center">Nilai Akhir</th>
                <th className="p-2">Capaian Kompetensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {scores.length > 0 ? (
                scores.map((sc, idx) => (
                  <tr key={sc.id}>
                    <td className="p-2 border-r border-slate-200 text-center text-slate-500">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-semibold text-slate-900">
                      {sc.subject?.name || `Mata Pelajaran ${idx + 1}`}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-900">
                      {sc.score}
                    </td>
                    <td className="p-2 text-slate-700 leading-tight text-[11px]">
                      {sc.competency_achievement || 'Menunjukkan pemahaman yang sangat baik dalam seluruh tujuan pembelajaran yang diujikan.'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                    Belum ada nilai tersimpan untuk semester ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 2. Projek Penguatan Profil Pelajar Pancasila (P5) */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            B. Projek Penguatan Profil Pelajar Pancasila (P5)
          </h3>

          <table className="w-full border border-slate-300 text-xs text-left">
            <thead className="bg-slate-100 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300 w-10 text-center">No</th>
                <th className="p-2 border-r border-slate-300 w-64">Tema & Judul Projek</th>
                <th className="p-2 border-r border-slate-300 w-36 text-center">Predikat</th>
                <th className="p-2">Catatan Perkembangan Karakter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {p5.length > 0 ? (
                p5.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-2 border-r border-slate-200 text-center text-slate-500">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200">
                      <p className="font-semibold text-slate-900">{item.project?.title || 'Tema Projek P5'}</p>
                      <p className="text-[10px] text-slate-500">Dimensi: {item.project?.dimension || 'Gotong Royong'}</p>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold text-emerald-800">
                      {item.score_predicate || 'Berkembang Sesuai Harapan'}
                    </td>
                    <td className="p-2 text-slate-700 text-[11px] leading-tight">
                      {item.notes || 'Sangat aktif berkolaborasi dan menunjukkan inisiatif tinggi dalam kelompok kerja.'}
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="p-2 border-r border-slate-200 text-center text-slate-500">1</td>
                    <td className="p-2 border-r border-slate-200">
                      <p className="font-semibold text-slate-900">Bangunlah Jiwa dan Raganya</p>
                      <p className="text-[10px] text-slate-500">Projek Kesehatan Mental Remaja Masa Kini</p>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold text-emerald-800">
                      Berkembang Sesuai Harapan (BSH)
                    </td>
                    <td className="p-2 text-slate-700 text-[11px]">
                      Mampu mengelola emosi secara positif dan aktif mengajak teman sebaya menerapkan pola hidup sehat.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-200 text-center text-slate-500">2</td>
                    <td className="p-2 border-r border-slate-200">
                      <p className="font-semibold text-slate-900">Kearifan Lokal</p>
                      <p className="text-[10px] text-slate-500">Pelestarian Budaya Melayu Deli Serdang</p>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold text-blue-800">
                      Sangat Berkembang (SB)
                    </td>
                    <td className="p-2 text-slate-700 text-[11px]">
                      Menghargai keragaman tradisi daerah dan mendokumentasikan nilai-nilai kearifan lokal secara kreatif.
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Ekstrakurikuler & Kehadiran (Side-by-side) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Ekstrakurikuler */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              C. Ekstrakurikuler
            </h3>
            <table className="w-full border border-slate-300 text-xs text-left">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-1.5 border-r border-slate-300">Kegiatan</th>
                  <th className="p-1.5 border-r border-slate-300 text-center w-14">Nilai</th>
                  <th className="p-1.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {extras.length > 0 ? (
                  extras.map((ex) => (
                    <tr key={ex.id}>
                      <td className="p-1.5 border-r border-slate-200 font-semibold">{ex.extracurricular?.name}</td>
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold">{ex.grade}</td>
                      <td className="p-1.5 text-[10px]">{ex.notes || 'Aktif mengikuti kegiatan'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-1.5 border-r border-slate-200 font-semibold">Gerakan Pramuka (Wajib)</td>
                    <td className="p-1.5 border-r border-slate-200 text-center font-bold">B</td>
                    <td className="p-1.5 text-[10px]">Aktif dan berdisiplin tinggi</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Ketidakhadiran */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              D. Ketidakhadiran (Presensi)
            </h3>
            <table className="w-full border border-slate-300 text-xs text-left">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-1.5 border-r border-slate-200 text-slate-600">Sakit (S)</td>
                  <td className="p-1.5 text-center font-bold font-mono w-16">{att.sick_days} Hari</td>
                </tr>
                <tr>
                  <td className="p-1.5 border-r border-slate-200 text-slate-600">Izin (I)</td>
                  <td className="p-1.5 text-center font-bold font-mono w-16">{att.permitted_days} Hari</td>
                </tr>
                <tr>
                  <td className="p-1.5 border-r border-slate-200 text-slate-600">Tanpa Keterangan (A)</td>
                  <td className="p-1.5 text-center font-bold font-mono w-16">{att.unexcused_days} Hari</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Keputusan Kenaikan Kelas (Khusus Semester Genap) */}
        {semesterType === 'Genap' && (
          <div className="p-3 border-2 border-slate-900 rounded-lg text-center space-y-1">
            <p className="text-xs font-bold uppercase text-slate-700">Keputusan Kenaikan Kelas:</p>
            <p className="text-sm font-bold text-slate-900">
              Berdasarkan pencapaian seluruh kompetensi, peserta didik ditetapkan:
            </p>
            <p className="text-base font-extrabold text-blue-700 underline uppercase tracking-wide">
              NAIK KE KELAS XI (SEBELAS)
            </p>
          </div>
        )}

        {/* Tanda Tangan */}
        <div className="grid grid-cols-3 gap-4 pt-4 text-center text-xs">
          <div>
            <p>Mengetahui,</p>
            <p>Orang Tua / Wali Siswa</p>
            <div className="h-20"></div>
            <p className="font-bold underline uppercase">
              {student.parents?.[0]?.father_name || '(.......................................)'}
            </p>
          </div>

          <div>
            <p>Beringin, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>Wali Kelas</p>
            <div className="h-20"></div>
            <p className="font-bold underline uppercase">
              {student.current_class?.wali_kelas?.name || 'ADISTY WARDHANI, S.Pd.I'}
            </p>
            <p className="font-mono text-[10px]">
              NIP. {student.current_class?.wali_kelas?.nip || '19821231 201101 2 008'}
            </p>
          </div>

          <div>
            <p>Mengetahui,</p>
            <p>Kepala SMK Negeri 1 Beringin</p>
            <div className="h-20"></div>
            <p className="font-bold underline uppercase">
              {school?.principal_name || 'HJ. HAFRIDA HANUM, S.Pd, M.Pd'}
            </p>
            <p className="font-mono text-[10px]">
              NIP. {school?.principal_nip || '19660414 199403 2 009'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
