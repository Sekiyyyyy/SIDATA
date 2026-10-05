import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { 
  Search, 
  Calendar, 
  LogOut, 
  CheckCircle2, 
  ChevronDown, 
  UserCircle2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { SharedProps } from '@/Types';
import { cn } from '@/Utils/cn';
import ThemeToggle from '@/Components/ThemeToggle';
import Logo from '@/Components/Logo';

interface NavbarProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function Navbar({ isMinimized = false, onToggleMinimize }: NavbarProps) {
  const { auth, activeAcademicYear, activeSemester, school } = usePage<SharedProps>().props;
  const [search, setSearch] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.get('/students', { search: search.trim() });
    }
  };

  const handleSwitchRole = (role: 'admin' | 'operator' | 'wali_kelas') => {
    router.post('/quick-login', { role });
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-18 w-full items-center justify-between border-b border-[var(--neu-border)] bg-[var(--neu-bg)]/90 px-3 sm:px-6 lg:px-8 backdrop-blur-md transition-colors duration-200 font-sans">
      {/* Left: Mobile Brand OR Desktop Minimize & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Brand (Replaces hamburger menu since BottomNav is used) */}
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <Logo size="sm" withBezel={true} />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight font-display">
              SIDATA
            </span>
            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
              SMKN 1 BERINGIN
            </span>
          </div>
        </Link>

        {/* Desktop Sidebar Toggle */}
        {onToggleMinimize && (
          <button
            type="button"
            onClick={onToggleMinimize}
            className="hidden lg:inline-flex neu-icon-pill p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl transition cursor-pointer"
            title={isMinimized ? "Perluas Sidebar" : "Perkecil (Minimize) Sidebar"}
            aria-label="Toggle Sidebar"
          >
            {isMinimized ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Global Search Bar (Tablet / Desktop) */}
        <form onSubmit={handleGlobalSearch} className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari siswa (Nama, NISN, NIS)..."
            className="neu-input w-full pl-10 pr-4 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </form>
      </div>

      {/* Right: Academic Year, Theme Switcher & Role Quick-Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Active Academic Year Badge (Desktop) */}
        <div className="neu-flat-sm hidden md:flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span>Tahun: {activeAcademicYear?.name || '2024/2025'}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">Sem. {activeSemester?.type || 'Ganjil'}</span>
        </div>

        {/* Theme Switcher */}
        <div className="hidden sm:block">
          <ThemeToggle variant="segmented" />
        </div>
        <div className="sm:hidden">
          <ThemeToggle variant="compact" />
        </div>

        {/* Quick Role Switcher Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="neu-btn flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            aria-label="Ganti Role Akun"
          >
            <UserCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="hidden md:inline">Role:</span>
            <span className="uppercase text-blue-600 dark:text-blue-400 font-extrabold text-[11px] sm:text-xs">
              {auth.user?.role?.replace('_', ' ')}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </button>

          {roleDropdownOpen && (
            <div className="neu-card absolute right-0 mt-2 w-64 rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Ganti Akun Demo (1-Click)
              </div>
              <button
                onClick={() => handleSwitchRole('admin')}
                className={cn(
                  'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition-all mb-1 cursor-pointer',
                  auth.user?.role === 'admin'
                    ? 'neu-inset text-purple-600 dark:text-purple-400 font-bold'
                    : 'neu-btn text-slate-700 dark:text-slate-300'
                )}
              >
                <div>
                  <p className="font-bold">1. Administrator</p>
                  <p className="text-[10px] text-slate-400">admin@sidata.test</p>
                </div>
                {auth.user?.role === 'admin' && <CheckCircle2 className="h-4 w-4 text-purple-500" />}
              </button>

              <button
                onClick={() => handleSwitchRole('operator')}
                className={cn(
                  'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition-all mb-1 cursor-pointer',
                  auth.user?.role === 'operator'
                    ? 'neu-inset text-blue-600 dark:text-blue-400 font-bold'
                    : 'neu-btn text-slate-700 dark:text-slate-300'
                )}
              >
                <div>
                  <p className="font-bold">2. Operator</p>
                  <p className="text-[10px] text-slate-400">operator@sidata.test</p>
                </div>
                {auth.user?.role === 'operator' && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
              </button>

              <button
                onClick={() => handleSwitchRole('wali_kelas')}
                className={cn(
                  'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-left transition-all cursor-pointer',
                  auth.user?.role === 'wali_kelas'
                    ? 'neu-inset text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'neu-btn text-slate-700 dark:text-slate-300'
                )}
              >
                <div>
                  <p className="font-bold">3. Wali Kelas (X PPLG 2)</p>
                  <p className="text-[10px] text-slate-400">walikelas@sidata.test</p>
                </div>
                {auth.user?.role === 'wali_kelas' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </button>
            </div>
          )}
        </div>

        {/* Logout Button (Desktop) */}
        <Link
          href="/logout"
          method="post"
          as="button"
          className="neu-icon-pill hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition cursor-pointer"
          title="Keluar Akun"
        >
          <LogOut className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
