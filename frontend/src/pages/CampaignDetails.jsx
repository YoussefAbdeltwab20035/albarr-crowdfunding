import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import RewardSection from '../components/RewardSection';
import PledgeDrawer from '../components/PledgeDrawer';
import CampaignCommunity from '../components/CampaignCommunity';
import ImpactCalculator from '../components/ImpactCalculator';
import { 
  CheckCircle2, Clock, Users, Share2, Heart, 
  MapPin, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle, Sparkles
} from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80";

const getFieldText = (field, lang = 'ar') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.ar || field.en || '';
};

export default function CampaignDetails({ 
  lang, 
  campaigns = [], 
  transactions = [], 
  onPledge, 
  onToast 
}) {
  const { id } = useParams();
  const isAr = lang === 'ar';
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState(500);

  const campaign = campaigns.find((c) => String(c.id) === String(id)) || campaigns[0];
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  if (!campaign) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-500 font-bold">{isAr ? 'لم يتم العثور على الحملة' : 'Campaign not found'}</p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-brand-emerald text-white text-xs font-bold">
          {isAr ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </div>
    );
  }

  const raisedAmount = Number(campaign.raised) || 0;
  const goalAmount = Number(campaign.goal) || 1;
  const percentage = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);
  const isCompleted = raisedAmount >= goalAmount;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    if (onToast) {
      onToast(isAr ? 'تم نسخ رابط الحملة إلى الحافظة بنجاح!' : 'Campaign link copied to clipboard!');
    }
  };

  const handleApplyFromCalculator = (amount) => {
    if (isCompleted) return;
    const num = Number(amount) || 500;
    setPledgeAmount(num);
    setIsDrawerOpen(true);
  };

  const handleSelectReward = (reward) => {
    if (isCompleted) return;
    const num = Number(reward.amount) || 500;
    setPledgeAmount(num);
    setIsDrawerOpen(true);
  };

  const handleOpenQuickPledge = () => {
    if (isCompleted) return;
    setPledgeAmount(500);
    setIsDrawerOpen(true);
  };

  return (
    <div className="pb-24 bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-emerald dark:text-slate-400 dark:hover:text-brand-emerald transition-colors">
          <BackArrow className="w-4 h-4" />
          <span>{isAr ? 'العودة للمشاريع' : 'Back to campaigns'}</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Body (70%) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Media Canvas */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
              <img 
                src={campaign.image || FALLBACK_IMAGE} 
                alt={getFieldText(campaign.title, lang)} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 start-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-emerald shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'حملة موثقة' : 'Verified Campaign'}</span>
              </div>

              {isCompleted && (
                <div className="absolute top-4 end-4 bg-emerald-600/95 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{isAr ? 'تم تحقيق الهدف بنجاح 100%' : '100% Fully Funded'}</span>
                </div>
              )}
            </div>

            {/* Campaign Headline */}
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-lg bg-brand-50 dark:bg-emerald-950/60 dark:border dark:border-emerald-800 text-brand-emerald font-bold text-xs">
                {getFieldText(campaign.category, lang)}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {getFieldText(campaign.title, lang)}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {getFieldText(campaign.description, lang)}
              </p>
            </div>

            {/* Creator Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-800 border border-brand-100 dark:border-slate-700 flex items-center justify-center font-bold text-brand-emerald text-sm">
                  {getFieldText(campaign.author, lang)?.charAt(0) || 'م'}
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-sm text-slate-900 dark:text-white">
                    <span>{getFieldText(campaign.author, lang)}</span>
                    {campaign.author?.verified && <CheckCircle2 className="w-4 h-4 text-brand-emerald" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
                    <span>•</span>
                    <span>{isAr ? 'مبادرة معتمدة' : 'Verified Initiative'}</span>
                  </div>
                </div>
              </div>
              <button 
                type="button"
                className="text-xs font-bold px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                {isAr ? 'متابعة' : 'Follow'}
              </button>
            </div>

            {/* Project Story */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isAr ? 'عن المشروع والقصة' : 'About the Project'}</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {getFieldText(campaign.description, lang)}
              </p>
              
              <div className="bg-brand-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border-s-4 border-brand-emerald text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                {isAr 
                  ? '«كل خطوة مساهمة تصنع أثراً حقيقياً ومستداماً على أرض الواقع.»'
                  : '"Every pledge creates a tangible, long-term impact on the ground."'}
              </div>
            </div>

            {/* Interactive Impact Calculator - يعطّل التأثير إذا كان المشروع مكتملاً */}
            {!isCompleted ? (
              <ImpactCalculator 
                lang={lang} 
                category={getFieldText(campaign.category, lang)} 
                onApplyAmount={handleApplyFromCalculator} 
              />
            ) : (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-brand-emerald mx-auto" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'تم تحقيق كامل الأثر المخطط لهذا المشروع بنجاح!' : 'The target impact has been achieved!'}
                </p>
              </div>
            )}

            {/* Rewards Embedded */}
            {!isCompleted && (
              <RewardSection 
                lang={lang} 
                onSelectReward={handleSelectReward} 
              />
            )}

            {/* Community, Updates & FAQ */}
            <CampaignCommunity 
              lang={lang} 
              campaign={campaign} 
              transactions={transactions} 
            />
          </div>

          {/* Sticky Sidebar (30%) */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 transition-colors">
              
              {/* Progress Tracker */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{raisedAmount.toLocaleString()}</span>
                  <span className="text-xs font-bold text-slate-400">EGP</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'تم جمعها من أصل هدف' : 'raised of'}{' '}
                  <strong className="text-slate-700 dark:text-slate-200">{goalAmount.toLocaleString()} EGP</strong>
                </p>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-brand-emerald rounded-full transition-all duration-700" 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
                <div className="flex justify-between text-xs font-bold pt-1">
                  <span className="text-brand-emerald">%{percentage} {isAr ? 'مكتمل' : 'funded'}</span>
                  <span className="text-slate-500 dark:text-slate-400">{campaign.daysLeft || 0} {isAr ? 'أيام متبقية' : 'days left'}</span>
                </div>
              </div>

              {/* Stats Mini Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <span className="block text-xl font-black text-slate-900 dark:text-white">{campaign.backers || 0}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                    {isAr ? 'داعم' : 'backers'}
                  </span>
                </div>
                <div className="border-s border-slate-100 dark:border-slate-800">
                  <span className="block text-xl font-black text-slate-900 dark:text-white">{campaign.daysLeft || 0}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {isAr ? 'يوم' : 'days'}
                  </span>
                </div>
              </div>

              {/* Pledge Actions: تعطيل الدفع وتوجيه التبرع إذا كان مكتملاً */}
              <div className="space-y-2.5">
                {isCompleted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-brand-emerald/30 text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-brand-emerald font-black text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>{isAr ? 'اكتمل تمويل هذا المشروع 100%' : 'Campaign 100% Funded'}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isAr 
                        ? 'شكراً لكل من ساهم! تم إيقاف استقبال المساهمات لتوجيه الدعم للمشاريع الأخرى التي ما زالت بحاجة لتمويل.' 
                        : 'Thank you! Contributions are closed to direct support towards active initiatives.'}
                    </p>
                    <Link
                      to="/"
                      className="w-full bg-brand-emerald hover:bg-brand-emeraldDark text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-emerald/20"
                    >
                      <span>{isAr ? 'استكشف مشاريع أخرى بحاجة لدعمك' : 'Explore Other Causes'}</span>
                      <BackArrow className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <button 
                      type="button"
                      onClick={handleOpenQuickPledge}
                      className="w-full bg-brand-emerald hover:bg-brand-emeraldDark text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-brand-emerald/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{isAr ? 'ادعم هذا المشروع (تبرع سريع)' : 'Quick Pledge'}</span>
                    </button>

                    <Link
                      to={`/checkout/${campaign.id}`}
                      className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>{isAr ? 'الدفع الكامل واختيار مكافأة' : 'Full Checkout & Rewards'}</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Share */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button 
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isAr ? 'مشاركة الحملة' : 'Share'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Drawer */}
      {!isCompleted && (
        <PledgeDrawer
          key={`${isDrawerOpen}-${pledgeAmount}`}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          campaign={campaign}
          lang={lang}
          onPledge={onPledge}
          initialAmount={pledgeAmount}
        />
      )}
    </div>
  );
}