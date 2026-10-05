import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AuditLog, PaginatedData } from '@/Types';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  User, 
  Activity, 
  ChevronDown, 
  ChevronRight,
  Database,
  Globe
} from 'lucide-react';

interface Props {
  logs: PaginatedData<AuditLog>;
  filters: { search?: string };
}

export default function AuditLogsIndex({ logs, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/audit-logs', { search }, { preserveState: true });
  };

  const toggleExpand = (id: number) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <AppLayout>
      <Head title="Audit Trail & Log Aktivitas - SIDATA Siswa" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>Keamanan Sistem</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Audit Trail Log</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              Audit Log & Rekam Jejak Sistem
            </h1>
            <p className="text-sm text-slate-500">
              Pencatatan riwayat setiap tindakan penting, pergantian wali kelas, mutasi, dan perubahan data siswa.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aktivitas, nama pengguna, atau model data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <div className="text-xs text-slate-500">
            Total Tercatat: <strong className="text-slate-900">{logs.total}</strong> Aktivitas
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 w-10"></th>
                  <th className="px-3 py-3 w-40">Waktu & Tanggal</th>
                  <th className="px-3 py-3 w-48">Pengguna (Aktor)</th>
                  <th className="px-3 py-3">Tindakan (Action)</th>
                  <th className="px-3 py-3 w-40">Objek Data (Model)</th>
                  <th className="px-3 py-3 w-32">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.data.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  const hasChanges = log.old_values || log.new_values;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => hasChanges && toggleExpand(log.id)}
                        className={`transition-colors ${
                          hasChanges ? 'cursor-pointer hover:bg-slate-50' : ''
                        }`}
                      >
                        <td className="px-3 py-3 text-center text-slate-400">
                          {hasChanges && (
                            isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )
                          )}
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(log.created_at).toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{log.user_name || 'System Auto'}</p>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-700">
                                {log.user_role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-semibold text-slate-900">{log.action}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700">
                            {log.model_type?.split('\\').pop() || 'Entity'} #{log.model_id}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-500 text-[11px]">
                          {log.ip_address || '127.0.0.1'}
                        </td>
                      </tr>

                      {/* Detail Drawer for Changes */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80">
                          <td colSpan={6} className="px-6 py-4 border-t border-b border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {log.old_values && (
                                <div className="space-y-1">
                                  <p className="font-bold text-rose-800">Nilai Sebelum (Old Values):</p>
                                  <pre className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 text-rose-900">
                                    {JSON.stringify(log.old_values, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.new_values && (
                                <div className="space-y-1">
                                  <p className="font-bold text-emerald-800">Nilai Sesudah (New Values):</p>
                                  <pre className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 text-emerald-900">
                                    {JSON.stringify(log.new_values, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {logs.links && logs.links.length > 3 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs bg-slate-50/50">
              <span className="text-slate-500">
                Menampilkan {logs.from || 0} - {logs.to || 0} dari {logs.total} data
              </span>
              <div className="flex items-center gap-1">
                {logs.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url || '#'}
                    preserveScroll
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      link.active
                        ? 'bg-blue-600 text-white border-blue-600'
                        : link.url
                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
