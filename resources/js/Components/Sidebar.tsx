import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  LogOut
} from 'lucide-react';
import { SharedProps } from '@/Types';
import { cn } from '@/Utils/cn';
import Logo from '@/Components/Logo';

interface SidebarProps {
  isMinimized: boolean;
  onToggleMinimize?: () => void;
}

export default function Sidebar({ isMinimized }: SidebarProps) {
  const { auth, school } = usePage<SharedProps>().props;
  const currentPath = window.location.pathname;

  const role = auth.user?.role || 'wali_kelas';

  // Navigation Items (Presensi & Nilai removed as requested: directly edited in student detail)
  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'operator', 'wali_kelas'],
      active: currentPath === '/dashboard',
    },
    {
      title: role === 'wali_kelas' ? 'Siswa Kelas Saya' : 'Data Siswa',
      href: '/students',
      icon: Users,
      roles: ['admin', 'operator', 'wali_kelas'],
      active: currentPath.startsWith('/students'),
    },
    {
      title: 'Kelas & Wali Kelas',
      href: '/classes',
      icon: Layers,
      roles: ['admin', 'operator'],
      active: currentPath.startsWith('/classes'),
    },
    {
      title: 'Kenaikan Kelas',
      href: '/promotions',
      icon: TrendingUp,
      roles: ['admin', 'operator'],
      active: currentPath.startsWith('/promotions'),
      badge: 'Prioritas',
    },
    {
      title: 'Laporan & Cetak A4',
      href: '/reports',
      icon: FileSpreadsheet,
      roles: ['admin', 'operator', 'wali_kelas'],
      active: currentPath.startsWith('/reports'),
    },
    {
      title: 'Audit Log Sistem',
      href: '/audit-logs',
      icon: ShieldCheck,
      roles: ['admin', 'operator'],
      active: currentPath.startsWith('/audit-logs'),
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed top-0 bottom-0 left-0 z-40 flex-col border-r border-[var(--neu-border)] bg-[var(--neu-bg)] transition-all duration-300 ease-in-out font-sans",
        isMinimized ? "w-20" : "w-72"
      )}
    >
      {/* Brand Header with School Logo & Kolaborasi Sumut Berkah */}
      <div className={cn(
        "flex flex-col justify-center border-b border-[var(--neu-border)] transition-all duration-300",
        isMinimized ? "h-20 items-center px-2" : "py-3 px-4"
      )}>
        {isMinimized ? (
          <Link href="/dashboard" className="flex items-center justify-center" title="SIDATA Siswa SMKN 1 Beringin">
            <Logo size="md" withBezel={true} withGlow={true} />
          </Link>
        ) : (
          <Link 
            href="/dashboard" 
            className="flex flex-col gap-2 min-w-0 w-full group select-none" 
            title="SIDATA Siswa SMKN 1 Beringin"
          >
            {/* Row 1: Dual Logos side by side (School Logo + Kolaborasi Sumut Berkah) */}
            <div className="flex items-center gap-2.5">
              <Logo size="sm" withBezel={true} withGlow={true} />
              <div className="h-5 w-[1.5px] bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="neu-flat-sm py-1 px-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 flex items-center shadow-xs">
                <img
                  src="/assets/kolaborasi-sumut-berkah.png"
                  alt="Kolaborasi Sumut Berkah"
                  className="h-4.5 w-auto object-contain dark:brightness-110 select-none pointer-events-none"
                  style={{ maxHeight: '18px' }}
                />
              </div>
            </div>

            {/* Row 2: Brand Identity (Full width, zero overlap) */}
            <div className="flex flex-col min-w-0 pl-0.5">
              <div className="flex items-center gap-1.5 font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                <span className="text-base font-black tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  SIDATA
                </span>
                <span className="neu-badge rounded-md px-1.5 py-0.5 text-[9px] font-black text-blue-600 dark:text-blue-400">
                  SISWA
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {school?.name || 'SMK NEGERI 1 BERINGIN'}
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Role Badge Indicator */}
      <div className={cn(
        "py-3 border-b border-[var(--neu-border)] transition-all duration-300",
        isMinimized ? "px-2 flex justify-center" : "px-5"
      )}>
        {isMinimized ? (
          <div 
            className="neu-inset-sm p-2 rounded-xl flex items-center justify-center cursor-default"
            title={`Hak Akses: ${role.replace('_', ' ').toUpperCase()}`}
          >
            <span className={cn(
              "h-2.5 w-2.5 rounded-full animate-pulse",
              role === 'admin' && "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
              role === 'operator' && "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]",
              role === 'wali_kelas' && "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            )} />
          </div>
        ) : (
          <div className="neu-inset-sm flex items-center justify-between rounded-xl px-3 py-2 animate-in fade-in duration-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Hak Akses:
            </span>
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide",
              role === 'admin' && "neu-badge text-purple-600 dark:text-purple-400",
              role === 'operator' && "neu-badge text-blue-600 dark:text-blue-400",
              role === 'wali_kelas' && "neu-badge text-emerald-600 dark:text-emerald-400"
            )}>
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {role.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className={cn(
        "flex-1 space-y-1.5 overflow-y-auto py-4 scrollbar-thin transition-all duration-300",
        isMinimized ? "px-2" : "px-4"
      )}>
        {!isMinimized && (
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-in fade-in duration-200">
            Navigasi Utama
          </div>
        )}

        {filteredNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isMinimized ? item.title : undefined}
              className={cn(
                "group flex items-center rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer",
                isMinimized 
                  ? "justify-center p-3" 
                  : "justify-between px-3.5 py-2.5",
                item.active
                  ? "neu-inset text-slate-900 dark:text-white font-black border-l-4 border-slate-700 dark:border-slate-300 bg-slate-200/60 dark:bg-slate-800/70"
                  : "neu-btn text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  item.active ? "text-slate-900 dark:text-slate-100" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                )} />
                {!isMinimized && (
                  <span className="truncate">{item.title}</span>
                )}
              </div>

              {!isMinimized && item.badge && (
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                  item.active ? "bg-slate-300/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200" : "neu-badge text-slate-500 dark:text-slate-400"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card in Footer */}
      <div className={cn(
        "border-t border-[var(--neu-border)] transition-all duration-300",
        isMinimized ? "p-2 flex flex-col items-center gap-2" : "p-4"
      )}>
        {isMinimized ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={auth.user?.avatar || '/assets/aditya.jpg'}
              alt={auth.user?.name || 'User'}
              title={`${auth.user?.name} (${auth.user?.email})`}
              className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-xs"
            />
            <Link
              href="/logout"
              method="post"
              as="button"
              className="neu-icon-pill p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl transition cursor-pointer"
              title="Keluar Akun"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="neu-flat-sm flex items-center justify-between rounded-2xl p-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={auth.user?.avatar || '/assets/aditya.jpg'}
                alt={auth.user?.name || 'User'}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
                  {auth.user?.name}
                </p>
                <p className="truncate text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {auth.user?.email}
                </p>
              </div>
            </div>
            <Link
              href="/logout"
              method="post"
              as="button"
              className="neu-icon-pill p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl transition cursor-pointer shrink-0"
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
