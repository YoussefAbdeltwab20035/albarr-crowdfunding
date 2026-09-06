import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero({ lang }) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-emerald text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-brand-emerald" />
              <span>{isAr ? 'منصة موثوقة • تمويل الكل أو لا شيء' : 'Trusted platform • Reward-based funding'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.25]">
              {isAr ? (
                <>وصّل فكرتك لبر الأمان، <span className="text-brand-emerald">بدعم من يثق بك.</span></>
              ) : (
                <>Turn your idea into reality, <span className="text-brand-emerald">safely ashore.</span></>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              {isAr
                ? 'أول منصة تمويل جماعي قائمة على المكافآت مصممة للسوق المصري ومجتمع رواد الأعمال. ادعم المشاريع التي تؤمن بها واحصل على مكافآت حصرية.'
                : 'A crowdfunding platform built for Egypt and the MENA region. Back the projects you believe in and earn exclusive rewards.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="bg-brand-emerald hover:bg-brand-emeraldDark text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-brand-emerald/20 transition-all transform active:scale-95">
                {isAr ? 'ابدأ حملتك الآن' : 'Start Campaign'}
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-3.5 rounded-full text-sm font-bold transition-all">
                <span>{isAr ? 'استكشف الحملات' : 'Explore Campaigns'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/80">
              <div>
                <span className="block text-2xl lg:text-3xl font-extrabold text-slate-900">2,400</span>
                <span className="text-xs text-slate-500 font-medium">{isAr ? 'حملة مكتملة التمويل' : 'Campaigns funded'}</span>
              </div>
              <div>
                <span className="block text-2xl lg:text-3xl font-extrabold text-slate-900">58,000</span>
                <span className="text-xs text-slate-500 font-medium">{isAr ? 'داعم نشط' : 'Active backers'}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400">EGP</span>
                <span className="block text-2xl lg:text-3xl font-extrabold text-slate-900 leading-none">19M+</span>
                <span className="text-xs text-slate-500 font-medium">{isAr ? 'إجمالي الدعم المالي' : 'Total raised'}</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase (Fixed aspect-ratio to prevent CLS) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
                alt="Al-Barr Campaign Impact"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 start-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center font-bold text-brand-emerald text-sm">
                  98%
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{isAr ? 'نسبة نجاح الحملات' : 'Campaigns funded'}</p>
                  <p className="text-[11px] text-slate-500">{isAr ? 'بفضل دعم المجتمع المستمر' : 'Backed by the community'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}