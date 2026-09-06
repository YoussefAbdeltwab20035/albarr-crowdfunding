import { useState } from 'react';
import { Calculator, Droplets, TreePine, Sparkles, Heart } from 'lucide-react';

export default function ImpactCalculator({ lang, category = '', onApplyAmount }) {
  const isAr = lang === 'ar';
  const [pledgeValue, setPledgeValue] = useState(500);

  // حساب الأثر الميداني بناءً على نوع المشروع
  const calculateImpact = (val) => {
    const cat = category.toLowerCase();
    if (category.includes('مياه') || cat.includes('water')) {
      const liters = val * 20;
      const families = Math.max(1, Math.floor(val / 200));
      return {
        icon: <Droplets className="w-5 h-5 text-blue-500" />,
        headline: isAr ? `توفير حوالي ${liters.toLocaleString()} لتر مياه نقية` : `Provides ~${liters.toLocaleString()} Liters of Clean Water`,
        subline: isAr ? `تكفي لتغطية الاحتياج اليومي لـ ${families} أسر بالكامل` : `Covers drinking water for ${families} local households`
      };
    }

    if (category.includes('زراعة') || cat.includes('agriculture')) {
      const trees = Math.max(1, Math.floor(val / 100));
      return {
        icon: <TreePine className="w-5 h-5 text-emerald-600" />,
        headline: isAr ? `غرس ورعاية ${trees} شتلات نخيل مثمرة` : `Plants & sustains ${trees} productive palm trees`,
        subline: isAr ? `تدعم دخل المزارعين المحليين لسنوات قادمة` : `Sustaining smallholder farmers' livelihoods`
      };
    }

    // افتراضي للمشاريع المجتمعية والتعليمية
    const students = Math.max(1, Math.floor(val / 250));
    return {
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      headline: isAr ? `دعم حقيبة تدريبية وأدوات لـ ${students} مستفيدين` : `Supplies training kits for ${students} beneficiaries`,
      subline: isAr ? `تأهيل مباشر لدخول سوق العمل وبناء مستقبل مستدام` : `Direct enablement towards employment readiness`
    };
  };

  const impact = calculateImpact(pledgeValue);

  return (
    <div className="bg-gradient-to-br from-brand-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 rounded-3xl border border-brand-100 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
          <Calculator className="w-4 h-4 text-brand-emerald" />
          <span>{isAr ? 'حاسبة الأثر المجتمعي التفاعلية' : 'Interactive Impact Calculator'}</span>
        </div>
        <span className="text-[11px] font-bold text-brand-emerald bg-brand-50 dark:bg-emerald-950/60 dark:border dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
          {isAr ? 'حساب حي ومباشر' : 'Live Calculator'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-bold">{isAr ? 'حجم تبرعك المقترح:' : 'Your hypothetical pledge:'}</span>
          <span className="font-black text-slate-900 dark:text-white text-base">
            {pledgeValue.toLocaleString()} <span className="text-xs text-brand-emerald font-bold">EGP</span>
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={pledgeValue}
          onChange={(e) => setPledgeValue(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
          <span>100 EGP</span>
          <span>2,500 EGP</span>
          <span>5,000 EGP</span>
        </div>
      </div>

      {/* Calculated Result Box */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
          {impact.icon}
        </div>
        <div className="space-y-0.5 flex-1 min-w-0">
          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{impact.headline}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{impact.subline}</p>
        </div>
      </div>

      {onApplyAmount && (
        <button
          type="button"
          onClick={() => onApplyAmount(pledgeValue)}
          className="w-full py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-emerald/15 cursor-pointer active:scale-95"
        >
          <Heart className="w-3.5 h-3.5 fill-white" />
          <span>{isAr ? `اعتماد مبلغ ${pledgeValue.toLocaleString()} ج.م والمتابعة` : `Pledge ${pledgeValue.toLocaleString()} EGP now`}</span>
        </button>
      )}
    </div>
  );
}