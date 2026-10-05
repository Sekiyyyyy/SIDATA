import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Logo from '@/Components/Logo';
import ThemeToggle from '@/Components/ThemeToggle';
import NeumorphicAlert from '@/Components/NeumorphicAlert';
import { cn } from '@/Utils/cn';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-[var(--neu-bg)] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300 relative overflow-hidden select-none">
      <Head title="Masuk ke Sistem" />

      {/* Subtle Ambient Depth Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Main Single Centered Neumorphic Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="neu-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          
          {/* Top Bar inside Card: Mini Pill & Theme Switcher */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full neu-inset-sm text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif
            </span>

            {/* Tactile Neumorphic Theme Switcher (Light / System / Dark) */}
            <ThemeToggle variant="segmented" />
          </div>

          {/* School Brand & Logo (Everything inside the Card!) */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative group">
              <Logo size="lg" withBezel={true} withGlow={true} className="mb-3 hover:scale-105 transition-transform" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                SIDATA
              </h1>
              <span className="neu-badge px-2 py-0.5 rounded-lg text-xs font-black tracking-wide text-blue-600 dark:text-blue-400">
                SISWA
              </span>
            </div>

            <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              SMK NEGERI 1 BERINGIN
            </p>
          </div>

          {/* Neumorphic Error Alert inside Card */}
          {hasErrors && (
            <div className="mb-5">
              <NeumorphicAlert variant="error" title="Gagal Masuk">
                {errors.email || errors.password || 'Email atau kata sandi tidak sesuai.'}
              </NeumorphicAlert>
            </div>
          )}

          {/* Minimalist Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                  placeholder="Email pengguna..."
                  className="neu-input w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  required
                  placeholder="Kata sandi..."
                  className="neu-input w-full pl-10 pr-11 py-3 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  aria-label="Lihat sandi"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="h-4 w-4 rounded-md accent-blue-600 cursor-pointer"
                />
                <span>Ingat saya</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="neu-btn-primary w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-xs font-bold tracking-wide disabled:opacity-50 cursor-pointer"
            >
              <span>{processing ? 'Memproses...' : 'Masuk ke Sistem'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Production Footer Note */}
          <div className="mt-6 pt-4 border-t border-[var(--neu-border)] text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Sistem Informasi Buku Induk & Raport Resmi
            </p>
            <p className="text-[10px] text-slate-400/80 dark:text-slate-600 mt-0.5">
              &copy; {new Date().getFullYear()} SMK Negeri 1 Beringin. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
