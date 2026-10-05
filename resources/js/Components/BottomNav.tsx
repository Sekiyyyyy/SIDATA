import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  Award,
  Layers, 
  Menu, 
  X, 
  ShieldCheck, 
  TrendingUp, 
  LogOut, 
  UserCircle2, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { SharedProps } from '@/Types';
import { cn } from '@/Utils/cn';
import ThemeToggle from '@/Components/ThemeToggle';

export default function BottomNav() {
  const { auth, activeAcademicYear, activeSemester, school } = usePage<SharedProps>().props;
  const currentPath = window.location.pathname;
  const role = auth.user?.role || 'wali_kelas';

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleSwitchRole = (newRole: 'admin' | 'operator' | 'wali_kelas') => {
    router.post('/quick-login', { role: newRole });
    setMoreMenuOpen(false);
  };

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: currentPath === '/dashboard',
    },
    {
      title: role === 'wali_kelas' ? 'Kelas Saya' : 'Data Siswa',
      href: '/students',
      icon: Users,
      active: currentPath.startsWith('/students'),
    },
    {
      title: 'Laporan A4',
      href: '/reports',
      icon: FileSpreadsheet,
      active: currentPath.startsWith('/reports'),
    },
  ];

  return (
    <>
      {/* ============================================================== */}
      {/* FLOATING NEUMORPHIC MOBILE NAVIGATION DOCK                    */}
      {/* ============================================================== */}
      <div className="fixed bottom-3 inset-x-3 sm:bottom-4 z-40 lg:hidden flex justify-center pointer-events-none select-none">
        <nav 
          className="w-full max-w-sm sm:max-w-md neu-floating-dock px-3 py-1.5 pointer-events-auto transition-all duration-300"
          aria-label="Navigasi Bawah Mobile Floating Neumorphism"
        >
          <div className="flex items-center justify-around gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 min-h-[48px]",
                    item.active
                      ? "text-blue-600 dark:text-blue-400 font-extrabold"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-semibold"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center relative",
                    item.active 
                      ? "bg-[#ebf0f7] dark:bg-[#151a24] text-blue-600 dark:text-blue-400 shadow-[inset_2.5px_2.5px_5px_#c2cde0,inset_-2.5px_-2.5px_5px_#ffffff] dark:shadow-[inset_2.5px_2.5px_5px_#080a0f,inset_-2px_-2px_4px_#242c3d] scale-105" 
                      : "hover:bg-slate-200/40 dark:hover:bg-slate-800/40"
                  )}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[9.5px] mt-0.5 tracking-tight truncate max-w-[60px] text-center leading-tight">
                    {item.title}
                  </span>
                  {item.active && (
                    <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
                  )}
                </Link>
              );
            })}

            {/* More Menu Button */}
            <button
              type="button"
              onClick={() => setMoreMenuOpen(true)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 min-h-[48px] cursor-pointer",
                moreMenuOpen
                  ? "text-blue-600 dark:text-blue-400 font-extrabold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-semibold"
              )}
              aria-label="Buka Menu Lainnya"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center",
                moreMenuOpen 
                  ? "bg-[#ebf0f7] dark:bg-[#151a24] text-blue-600 dark:text-blue-400 shadow-[inset_2.5px_2.5px_5px_#c2cde0,inset_-2.5px_-2.5px_5px_#ffffff] dark:shadow-[inset_2.5px_2.5px_5px_#080a0f,inset_-2px_-2px_4px_#242c3d] scale-105"
                  : "hover:bg-slate-200/40 dark:hover:bg-slate-800/40"
              )}>
                <Menu className="h-4.5 w-4.5" />
              </div>
              <span className="text-[9.5px] mt-0.5 tracking-tight truncate max-w-[60px] text-center leading-tight">
                Menu
              </span>
              {moreMenuOpen && (
                <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* FLOATING NEUMORPHIC MORE MENU MODAL / SHEET                   */}
      {/* ============================================================== */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMoreMenuOpen(false)}
          />

          {/* Floating Sheet Panel */}
          <div className="fixed bottom-18 sm:bottom-20 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-sm sm:max-w-md w-full max-h-[80vh] overflow-y-auto bg-[#ebf0f7] dark:bg-[#151a24] border border-white/80 dark:border-white/10 rounded-3xl p-5 shadow-[10px_10px_30px_#c2cde0,-10px_-10px_30px_#ffffff] dark:shadow-[10px_10px_30px_#080a0f,-6px_-6px_20px_#242c3d] animate-in zoom-in-95 duration-200 flex flex-col font-sans">
            {/* Grab Bar */}
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-3" />

            {/* Header with User Info & Close */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--neu-border)]">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={auth.user?.avatar || '/assets/aditya.jpg'}
                  alt={auth.user?.name || 'User'}
                  className="h-10 w-10 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {auth.user?.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] uppercase font-mono font-bold text-blue-600 dark:text-blue-400 neu-badge px-1.5 py-0.5 rounded-md">
                      {role.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {school?.name || 'SMKN 1 Beringin'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                className="neu-icon-pill p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 rounded-xl"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* School & Academic Period Pill */}
            <div className="my-2.5 neu-inset-sm p-2.5 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                <span>T.A. {activeAcademicYear?.name || '2024/2025'}</span>
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold neu-badge px-2 py-0.5 rounded-lg text-[10px]">
                Sem. {activeSemester?.type || 'Ganjil'}
              </span>
            </div>

            {/* Quick Actions / Role Switcher */}
            <div className="space-y-1.5 py-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Ganti Role Demo (1-Click)
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSwitchRole('admin')}
                  className={cn(
                    "p-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center gap-0.5 cursor-pointer",
                    role === 'admin'
                      ? "neu-inset text-purple-600 dark:text-purple-400 font-black border border-purple-400/30"
                      : "neu-btn text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span className="text-[10px] uppercase">Admin</span>
                  {role === 'admin' && <CheckCircle2 className="h-3 w-3 text-purple-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchRole('operator')}
                  className={cn(
                    "p-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center gap-0.5 cursor-pointer",
                    role === 'operator'
                      ? "neu-inset text-blue-600 dark:text-blue-400 font-black border border-blue-400/30"
                      : "neu-btn text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span className="text-[10px] uppercase">Operator</span>
                  {role === 'operator' && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchRole('wali_kelas')}
                  className={cn(
                    "p-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center gap-0.5 cursor-pointer",
                    role === 'wali_kelas'
                      ? "neu-inset text-emerald-600 dark:text-emerald-400 font-black border border-emerald-400/30"
                      : "neu-btn text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span className="text-[10px] uppercase">Wali Kelas</span>
                  {role === 'wali_kelas' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                </button>
              </div>
            </div>

            {/* Additional Nav Links for Admin/Operator */}
            {role !== 'wali_kelas' && (
              <div className="space-y-1 py-1.5 border-t border-[var(--neu-border)] mt-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-1">
                  Menu Tambahan
                </div>

                <Link
                  href="/promotions"
                  onClick={() => setMoreMenuOpen(false)}
                  className="neu-btn flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span>Kenaikan Kelas & Kelulusan</span>
                  </div>
                  <span className="neu-badge text-[9px] text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
                    Prioritas
                  </span>
                </Link>

                <Link
                  href="/audit-logs"
                  onClick={() => setMoreMenuOpen(false)}
                  className="neu-btn flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-purple-500" />
                    <span>Audit Log Sistem</span>
                  </div>
                </Link>
              </div>
            )}

            {/* Theme Toggle & Logout */}
            <div className="pt-2.5 border-t border-[var(--neu-border)] mt-1.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tema:</span>
                <ThemeToggle variant="compact" />
              </div>

              <Link
                href="/logout"
                method="post"
                as="button"
                className="neu-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar Akun</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
