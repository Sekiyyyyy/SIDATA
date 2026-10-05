import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { SchoolClass, SharedProps } from '@/Types';
import { 
  ArrowLeft, 
  Save, 
  UserPlus
} from 'lucide-react';

interface Props {
  classes: SchoolClass[];
  defaultClassId?: number | null;
  managedClass?: SchoolClass | null;
}

export default function StudentCreate({ classes, defaultClassId, managedClass }: Props) {
  const { auth } = usePage<SharedProps>().props;
  const isWaliKelas = auth.user?.role === 'wali_kelas';

  // Form input pokok: hanya data esensial pencatatan siswa
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    nis: '',
    nisn: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    current_class_id: managedClass ? String(managedClass.id) : (defaultClassId ? String(defaultClassId) : (classes.length > 0 ? String(classes[0].id) : '')),
    birth_place: '',
    birth_date: '',
    religion: '',
    action: 'save' as 'save' | 'save_and_new',
  });

  const handleSubmit = (actionType: 'save' | 'save_and_new') => {
    setData('action', actionType);
    post('/students', {
      data: {
        ...data,
        action: actionType,
      },
      onSuccess: () => {
        if (actionType === 'save_and_new') {
          reset('name', 'nis', 'nisn', 'birth_place', 'birth_date', 'religion');
        }
      },
    });
  };

  return (
    <AppLayout title="Tambah Siswa Baru">
      <Head title="Tambah Siswa Baru" />

      <div className="max-w-3xl mx-auto space-y-6 pb-24 font-sans">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/students"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              title="Kembali ke Daftar Siswa"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                  Data Pokok Siswa
                </span>
                {isWaliKelas && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                    Wali Kelas
                  </span>
                )}
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Tambah Siswa Baru
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Masukkan identitas siswa untuk didaftarkan ke rombel. Data orang tua dan berkas lengkap dapat diisi nanti.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/students"
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Batal
            </Link>
          </div>
        </div>

        {/* FORM IDENTITAS POKOK */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('save'); }} className="space-y-5">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nama Lengkap Siswa */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ADITYA CANDRA SITEPU"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value.toUpperCase())}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name}</p>
                )}
              </div>

              {/* NIS */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Nomor Induk Siswa (NIS) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 28354"
                  value={data.nis}
                  onChange={(e) => setData('nis', e.target.value)}
                  className="w-full text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                />
                {errors.nis && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.nis}</p>
                )}
              </div>

              {/* NISN */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Nomor Induk Siswa Nasional (NISN 10 Digit) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="Contoh: 0082081407"
                  value={data.nisn}
                  onChange={(e) => setData('nisn', e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                />
                {errors.nisn && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.nisn}</p>
                )}
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Jenis Kelamin <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setData('gender', 'Laki-laki')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      data.gender === 'Laki-laki'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Laki-laki
                  </button>
                  <button
                    type="button"
                    onClick={() => setData('gender', 'Perempuan')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      data.gender === 'Perempuan'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Perempuan
                  </button>
                </div>
                {errors.gender && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.gender}</p>
                )}
              </div>

              {/* Rombel / Kelas Masuk */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Rombel / Kelas {!(isWaliKelas && managedClass) && <span className="text-rose-600">*</span>}
                </label>
                {isWaliKelas && managedClass ? (
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200">
                    <span className="text-xs font-extrabold font-mono">
                      {managedClass.name} ({managedClass.grade_level} - {managedClass.major})
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-200/80 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                      Kelas Binaan Anda
                    </span>
                  </div>
                ) : (
                  <select
                    value={data.current_class_id}
                    onChange={(e) => setData('current_class_id', e.target.value)}
                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.grade_level} - {c.major})
                      </option>
                    ))}
                  </select>
                )}
                {errors.current_class_id && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.current_class_id}</p>
                )}
              </div>

              {/* Tempat Lahir */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  placeholder="Contoh: LUBUK PAKAM"
                  value={data.birth_place}
                  onChange={(e) => setData('birth_place', e.target.value.toUpperCase())}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                />
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={data.birth_date}
                  onChange={(e) => setData('birth_date', e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                />
              </div>

              {/* Agama */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Agama
                </label>
                <select
                  value={data.religion}
                  onChange={(e) => setData('religion', e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                >
                  <option value="">-- Pilih Agama (Opsional) --</option>
                  <option value="ISLAM">ISLAM</option>
                  <option value="KRISTEN PROTESTAN">KRISTEN PROTESTAN</option>
                  <option value="KATOLIK">KATOLIK</option>
                  <option value="HINDU">HINDU</option>
                  <option value="BUDDHA">BUDDHA</option>
                  <option value="KHONGHUCU">KHONGHUCU</option>
                </select>
              </div>

            </div>
          </div>

          {/* FIXED FLOATING ACTION BAR AT BOTTOM */}
          <div className="fixed bottom-3 inset-x-0 lg:left-72 z-40 px-4 sm:px-6 pointer-events-none">
            <div className="max-w-3xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-slate-700 p-3 sm:p-3.5 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 pointer-events-auto font-sans">
              
              <Link
                href="/students"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Batal
              </Link>

              <div className="flex items-center gap-2">
                {/* Simpan & Tambah Lainnya */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleSubmit('save_and_new')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                  title="Simpan data siswa ini dan lanjutkan input siswa baru berikutnya"
                >
                  <UserPlus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span>Simpan & Tambah Lainnya</span>
                </button>

                {/* Simpan & Buka Buku Induk */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleSubmit('save')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                  title="Simpan dan langsung buka buku induk siswa untuk lihat atau cicil kelengkapan"
                >
                  <Save className="w-4 h-4" />
                  <span>{processing ? 'Menyimpan...' : 'Simpan Siswa'}</span>
                </button>
              </div>

            </div>
          </div>

        </form>
      </div>
    </AppLayout>
  );
}
