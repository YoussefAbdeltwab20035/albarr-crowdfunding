import { useState, useEffect } from 'react';
import { HeartHandshake, X } from 'lucide-react';

export default function LiveDonationTicker({ lang, transactions = [] }) {
  const isAr = lang === 'ar';
  const [currentTxn, setCurrentTxn] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed || transactions.length === 0) return;

    // عرض تبرع كل 9 ثوانٍ ويختفي بعد 4.5 ثوانٍ
    const interval = setInterval(() => {
      const randomTxn = transactions[Math.floor(Math.random() * transactions.length)];
      if (randomTxn) {
        setCurrentTxn(randomTxn);
        setIsVisible(true);

        const hideTimeout = setTimeout(() => {
          setIsVisible(false);
        }, 4500);

        return () => clearTimeout(hideTimeout);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [transactions, isDismissed]);

  if (!currentTxn || !isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 start-4 z-40 max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-emerald-950/60 text-brand-emerald flex items-center justify-center shrink-0 border border-brand-100 dark:border-emerald-800">
        <HeartHandshake className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 text-xs">
        <p className="font-bold text-slate-800 dark:text-slate-100 truncate">
          {isAr ? 'مساهمة جديدة مباركة!' : 'New Community Pledge!'}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
          <strong className="text-brand-emerald font-black">
            {Number(currentTxn.amount).toLocaleString()} EGP
          </strong>{' '}
          {isAr ? 'من' : 'from'}{' '}
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {currentTxn.donorName || (isAr ? 'فاعل خير' : 'Anonymous')}
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}