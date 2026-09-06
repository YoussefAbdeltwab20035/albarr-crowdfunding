import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  return (
    <aside aria-label="الإشعارات" className="fixed top-24 end-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm w-full">
      <div className="bg-white text-slate-800 p-4 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex items-center gap-3 relative overflow-hidden">
        {/* شريط تقدم زمني جمالي بالأسفل */}
        <div className="absolute bottom-0 start-0 end-0 h-1 bg-brand-emerald/20">
          <div className="h-full bg-brand-emerald animate-[shrink_3.5s_linear_forwards]" />
        </div>

        {icons[toast.type || 'info']}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 leading-snug">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}