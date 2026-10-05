import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { 
  Search, 
  LogOut, 
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

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.get('/students', { search: search.trim() });
    }
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

      {/* Right: Theme Switcher & Role Badge */}
      <div className="flex items-center gap-1.5 sm:gap-3">

        {/* Theme Switcher */}
        <div className="hidden sm:block">
          <ThemeToggle variant="segmented" />
        </div>
        <div className="sm:hidden">
          <ThemeToggle variant="compact" />
        </div>

        {/* Current User Role Badge */}
        <div className="neu-flat-sm flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-200">
          <UserCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="hidden md:inline text-slate-500 dark:text-slate-400 font-medium">Role:</span>
          <span className="uppercase text-blue-600 dark:text-blue-400 font-extrabold text-[11px] sm:text-xs">
            {auth.user?.role?.replace('_', ' ')}
          </span>
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
