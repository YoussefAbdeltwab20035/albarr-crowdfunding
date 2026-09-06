import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Users, Clock, ArrowRight, ArrowLeft, 
  SlidersHorizontal, CheckCircle2, Flame, Sparkles, Timer,
  Droplets, Sprout, GraduationCap, HeartHandshake, ShieldCheck,
  TrendingUp, ArrowDown, Award, Zap, Compass
} from 'lucide-react';
import CampaignSkeleton from '../components/CampaignSkeleton';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80";

// دالة مساعدة معرّفة خارج المكون لتفادي إعادة الإنشاء وتحذيرات useMemo
const getFieldText = (field, lang = 'ar') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.ar || field.en || '';
};

export default function Home({ lang, searchQuery = '', campaigns = [] }) {
  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);

  // التصنيفات مع إحصاءات وألوان دلالية
  const categories = [
    {
      id: 'all',
      name: { ar: 'كافة المجالات', en: 'All Causes' },
      icon: Compass,
      gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
      accent: 'text-brand-emerald border-brand-emerald/30'
    },
    {
      id: 'مياه وإغاثة',
      name: { ar: 'مياه وإغاثة', en: 'Water & Relief' },
      desc: { ar: 'توصيل مياه الشرب وحفر الآبار', en: 'Clean water & sanitation' },
      icon: Droplets,
      gradient: 'from-blue-500/15 via-cyan-500/10 to-transparent',
      accent: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60'
    },
    {
      id: 'زراعة وتنمية',
      name: { ar: 'زراعة وتنمية', en: 'Agriculture' },
      desc: { ar: 'استصلاح الأراضي والطاقة النظيفة', en: 'Farming & clean energy' },
      icon: Sprout,
      gradient: 'from-emerald-500/15 via-green-500/10 to-transparent',
      accent: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
    },
    {
      id: 'تعليم وتكنولوجيا',
      name: { ar: 'تعليم وتكنولوجيا', en: 'Tech & Education' },
      desc: { ar: 'معامل البرمجة ودعم الطلاب', en: 'Coding labs & scholarships' },
      icon: GraduationCap,
      gradient: 'from-indigo-500/15 via-purple-500/10 to-transparent',
      accent: 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60'
    },
    {
      id: 'مجتمعي وخيري',
      name: { ar: 'مجتمعي وخيري', en: 'Community' },
      desc: { ar: 'تأهيل الورش وإعمار البيوت', en: 'Housing & livelihood' },
      icon: HeartHandshake,
      gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
      accent: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
    }
  ];

  // إظهار جميع المشاريع النشطة دون حجب المشاريع المضافة حديثاً
  // إظهار المشاريع النشطة فقط والتي لم تكتمل بعد (أقل من 100%)
const approvedCampaigns = useMemo(() => {
  return campaigns.filter((camp) => {
    if (!camp || camp.status === 'rejected') return false;
    
    const raised = Number(camp.raised) || 0;
    const goal = Number(camp.goal) || 1;
    const isCompleted = raised >= goal;

    // استبعاد الحملات المكتملة ليتوجه الدعم للمشاريع المحتاجة
    return !isCompleted;
  });
}, [campaigns]);
  // إحصائيات المنصة
  const platformStats = useMemo(() => {
    const totalRaised = approvedCampaigns.reduce((acc, c) => acc + (Number(c.raised) || 0), 0);
    const totalBackers = approvedCampaigns.reduce((acc, c) => acc + (Number(c.backers) || 0), 0);
    return {
      totalRaised,
      totalBackers,
      campaignsCount: approvedCampaigns.length
    };
  }, [approvedCampaigns]);

  // المشروع الأبرز
  const spotlightCampaign = useMemo(() => {
    if (approvedCampaigns.length === 0) return null;
    return approvedCampaigns.find((c) => (Number(c.raised) / (Number(c.goal) || 1)) >= 0.25) || approvedCampaigns[0];
  }, [approvedCampaigns]);

  const smoothScrollTo = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId) => {
    setIsLoading(true);
    setSelectedCategory(catId);
    setTimeout(() => {
      setIsLoading(false);
      smoothScrollTo('explore');
    }, 250);
  };

  const handleSortChange = (newSort) => {
    setIsLoading(true);
    setSortBy(newSort);
    setTimeout(() => setIsLoading(false), 200);
  };

  // فلترة وترتيب الحملات
  const filteredCampaigns = useMemo(() => {
    return approvedCampaigns
      .filter((camp) => {
        const q = (searchQuery || '').toLowerCase().trim();
        const title = getFieldText(camp.title, lang).toLowerCase();
        const desc = getFieldText(camp.description, lang).toLowerCase();
        const author = getFieldText(camp.author, lang).toLowerCase();
        const matchesSearch = !q || title.includes(q) || desc.includes(q) || author.includes(q);

        const campCat = getFieldText(camp.category, lang).toLowerCase();
        const targetCat = selectedCategory.toLowerCase();
        const matchesCategory = selectedCategory === 'all' || 
          campCat === targetCat ||
          campCat.includes(targetCat);

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'funded') {
          const percentA = (Number(a.raised) || 0) / (Number(a.goal) || 1);
          const percentB = (Number(b.raised) || 0) / (Number(b.goal) || 1);
          return percentB - percentA;
        }
        if (sortBy === 'ending_soon') {
          return (Number(a.daysLeft) || 0) - (Number(b.daysLeft) || 0);
        }
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [approvedCampaigns, searchQuery, selectedCategory, sortBy, lang]);

  return (
    <div className="min-h-screen pb-24 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 space-y-20">
      
      {/* 1. HERO SLIDE */}
      <section id="hero" className="relative pt-10 pb-12 overflow-hidden">
        <div className="absolute -top-20 start-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-brand-emerald/15 to-emerald-400/5 dark:from-brand-emerald/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-10">
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-brand-emerald/30 text-brand-emerald text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'منصة تمويل جماعي مصرية موثقة' : 'Verified Egyptian Crowdfunding'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {isAr ? (
                <>معاً نحو <span className="text-brand-emerald">بَرّ الأمان</span> والمستقبل</>
              ) : (
                <>Together Towards <span className="text-brand-emerald">Safe Harbor</span></>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {isAr 
                ? 'ندعم المبادرات المجتمعية الملموسة في مياه الشرب، التنمية الزراعية، والتعليم الرقمي مع إمكانية التحويل عبر InstaPay والبطاقات البنكية بإيصالات رقمية فورية.'
                : 'Back sustainable community initiatives across Egypt with verified direct tracking, InstaPay support, and transparent progress.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => smoothScrollTo('explore')}
                className="px-8 py-3.5 rounded-2xl bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-emerald/25 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer group"
              >
                <span>{isAr ? 'استكشف المشاريع المعتمدة' : 'Explore Projects'}</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => smoothScrollTo('categories')}
                className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-800 shadow-sm transition-all cursor-pointer"
              >
                {isAr ? 'تصفح حسب التصنيف' : 'Browse Categories'}
              </button>
            </div>
          </div>

          {/* Platform Live Stats Card */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 text-center">
            <div className="space-y-1">
              <div className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white">
                {platformStats.totalRaised.toLocaleString()} <span className="text-xs font-bold text-brand-emerald">EGP</span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold block">
                {isAr ? 'إجمالي التمويل المحصل' : 'Total Raised'}
              </span>
            </div>

            <div className="space-y-1 border-x border-slate-100 dark:border-slate-800">
              <div className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white">
                {platformStats.totalBackers}
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold block">
                {isAr ? 'داعم ومساهم موثق' : 'Backers'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-lg sm:text-3xl font-black text-brand-emerald">
                {platformStats.campaignsCount}
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold block">
                {isAr ? 'مبادرة معتمدة ونشطة' : 'Active Projects'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPOTLIGHT SHOWCASE CARD */}
      {spotlightCampaign && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-inner group">
                <img 
                  src={spotlightCampaign.image || FALLBACK_IMAGE} 
                  alt={getFieldText(spotlightCampaign.title, lang)} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-3.5 start-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAr ? 'مشروع الأسبوع المميز' : 'Featured of the Week'}</span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5 text-start">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-brand-emerald bg-brand-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                    {getFieldText(spotlightCampaign.category, lang)}
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {getFieldText(spotlightCampaign.title, lang)}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {getFieldText(spotlightCampaign.description, lang)}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-emerald rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(Math.round(((Number(spotlightCampaign.raised) || 0) / (Number(spotlightCampaign.goal) || 1)) * 100), 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span className="text-slate-900 dark:text-white">
                      {Number(spotlightCampaign.raised || 0).toLocaleString()} <span className="text-[10px] text-slate-400">EGP</span>
                      <span className="text-slate-400 font-normal ms-1">
                        / {Number(spotlightCampaign.goal || 0).toLocaleString()} EGP
                      </span>
                    </span>
                    <span className="text-brand-emerald font-black">
                      %{Math.min(Math.round(((Number(spotlightCampaign.raised) || 0) / (Number(spotlightCampaign.goal) || 1)) * 100), 100)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Link
                    to={`/campaign/${spotlightCampaign.id}`}
                    className="flex-1 py-3.5 rounded-2xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-md shadow-brand-emerald/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>{isAr ? 'المساهمة والتفاصيل الكاملة' : 'Support Campaign'}</span>
                    <Arrow className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => smoothScrollTo('explore')}
                    className="px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? 'تصفح الكل' : 'View All'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. CATEGORIES SECTION */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isAr ? 'مجالات التأثير المجتمعي' : 'Impact Categories'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'اختر مجالاً لفرز المشاريع تلقائياً والانتقال المباشر للحملات التابعة له' : 'Select a category to filter campaigns'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900 group hover:-translate-y-1.5 hover:shadow-lg ${
                  isSelected 
                    ? 'border-brand-emerald ring-4 ring-brand-emerald/10 shadow-md' 
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-brand-emerald/50'
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center border ${cat.accent} transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                    {cat.name[lang] || cat.name.ar}
                  </h3>
                  {cat.desc && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug hidden sm:block">
                      {cat.desc[lang]}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-brand-emerald pt-1">
                  <span>{isAr ? 'عرض المشاريع' : 'Browse'}</span>
                  <Arrow className="w-3 h-3 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. EXPLORE SECTION */}
      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isAr ? 'استكشف المبادرات المعتمدة' : 'Explore Verified Campaigns'}
            </h2>
            <p className="text-xs text-slate-400">
              {isAr ? `إجمالي المشاريع المتاحة (${filteredCampaigns.length} مبادرة)` : `Available initiatives (${filteredCampaigns.length})`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {isAr ? 'عرض كل التصنيفات ✕' : 'Reset Category ✕'}
              </button>
            )}

            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="newest">{isAr ? 'الأحدث أولاً' : 'Newest'}</option>
                <option value="funded">{isAr ? 'الأكثر تمويلاً' : 'Most Funded'}</option>
                <option value="ending_soon">{isAr ? 'أوشك على الانتهاء' : 'Ending Soon'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            <CampaignSkeleton />
            <CampaignSkeleton />
            <CampaignSkeleton />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
              {isAr ? 'لا توجد مشاريع بهذا التصنيف حالياً' : 'No campaigns found in this category'}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-brand-emerald hover:underline cursor-pointer"
            >
              {isAr ? 'عرض كافة المشاريع المعتمدة' : 'View all campaigns'}
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all">
            {filteredCampaigns.map((campaign) => {
              const percentage = Math.min(Math.round(((Number(campaign.raised) || 0) / (Number(campaign.goal) || 1)) * 100), 100);
              const isEndingSoon = (Number(campaign.daysLeft) || 0) <= 5;
              const isNearTarget = percentage >= 80;

              return (
                <div 
                  key={campaign.id} 
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-emerald/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={campaign.image || FALLBACK_IMAGE}
                      alt={getFieldText(campaign.title, lang)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-3.5 start-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                      {getFieldText(campaign.category, lang)}
                    </div>

                    {isEndingSoon ? (
                      <div className="absolute top-3.5 end-3.5 bg-red-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Timer className="w-3.5 h-3.5" />
                        <span>{isAr ? 'أيام متبقية' : 'Ending'}</span>
                      </div>
                    ) : isNearTarget ? (
                      <div className="absolute top-3.5 end-3.5 bg-amber-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{isAr ? 'أوشك على الاكتمال' : 'Almost'}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <span>{getFieldText(campaign.author, lang)}</span>
                        {campaign.author?.verified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />}
                      </div>

                      <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-emerald transition-colors">
                        {getFieldText(campaign.title, lang)}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {getFieldText(campaign.description, lang)}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-emerald rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>

                      <div className="flex justify-between items-baseline text-xs">
                        <div>
                          <span className="font-black text-slate-900 dark:text-white">{Number(campaign.raised || 0).toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 font-bold ms-1">EGP</span>
                        </div>
                        <span className="font-black text-brand-emerald">%{percentage}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{campaign.backers || 0} {isAr ? 'داعم' : 'backers'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{campaign.daysLeft || 30} {isAr ? 'أيام متبقية' : 'days left'}</span>
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/campaign/${campaign.id}`}
                      className="w-full py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-emerald hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-200/80 dark:border-slate-700 group-hover:border-brand-emerald"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تفاصيل ودعم الحملة' : 'View Campaign'}</span>
                      <Arrow className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. TRUST BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-sm grid md:grid-cols-3 gap-8 text-center sm:text-start">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{isAr ? 'رقابة وتدقيق 100%' : '100% Audited'}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAr ? 'كل مشروع يخضع لمراجعة الهوية ومستندات الإثبات قبل النشر.' : 'Every project undergoes rigorous verification before launch.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{isAr ? 'إيصال دفع رسمي فوري' : 'Instant Digital Receipt'}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAr ? 'تحصل على رقم إيصال فريد وكود تتبع لمساهمتك المالية.' : 'Get a unique reference TXN code for your contribution.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{isAr ? 'تحديثات أثر حية' : 'Live Impact Updates'}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAr ? 'متابعة ميدانية بالصور والتقارير لكل مرحلة إنجاز في الحملة.' : 'Photo & video progress reports for every funding milestone.'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}