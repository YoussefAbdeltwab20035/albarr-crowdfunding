import { useState } from 'react';
import { Check, Sparkles, Users, Calendar, Clock } from 'lucide-react';

export default function RewardSection({ lang, onSelectReward }) {
  const isAr = lang === 'ar';
  const [selectedRewardId, setSelectedRewardId] = useState(3); // القيمة الافتراضية محددة

  const rewards = [
    {
      id: 1,
      title: isAr ? 'داعم' : 'Backer',
      amount: 250,
      backersCount: 640,
      description: isAr 
        ? 'شكر شخصي وإدراج اسمك في لوحة الشرف الرقمية لداعمي المشروع.'
        : 'Personal appreciation and digital honor board listing.',
      features: [
        isAr ? 'بطاقة شكر رقمية مخصصة' : 'Custom digital thank-you card',
        isAr ? 'تحديثات حصرية ومباشرة عن مسار الحملة' : 'Exclusive updates on campaign milestones'
      ],
      deliveryDate: 'Jul 2026',
      isLimited: false
    },
    {
      id: 2,
      title: isAr ? 'مناصر' : 'Advocate',
      amount: 750,
      backersCount: 218,
      description: isAr 
        ? 'جميع مزايا الداعم، بالإضافة إلى هدية تذكارية يدوية الصنع من مخرجات المشروع.'
        : 'All backer perks plus a handcrafted project souvenir.',
      features: [
        isAr ? 'كافة مميزات فئة داعم' : 'All Backer perks included',
        isAr ? 'هدية يدوية تذكارية حصرية' : 'Exclusive handmade souvenir',
        isAr ? 'شهادة مساهمة موثقة' : 'Verified certificate of contribution'
      ],
      deliveryDate: 'Aug 2026',
      isLimited: true,
      remaining: 40
    },
    {
      id: 3,
      title: isAr ? 'شريك الأثر' : 'Impact Partner',
      amount: 2500,
      backersCount: 32,
      description: isAr 
        ? 'دعوة لحضور افتتاح المشروع ووضع اسمك محفوراً على اللوحة التذكارية في الموقع.'
        : 'Opening ceremony invitation and name engraved on site plaque.',
      features: [
        isAr ? 'كافة مميزات الفئات السابقة' : 'All previous tier perks',
        isAr ? 'زيارة ميدانية وحضور حفل الافتتاح' : 'Field visit & ceremony pass',
        isAr ? 'لوحة شرف تذكارية باسمك في الموقع' : 'Permanent recognition plaque on-site'
      ],
      deliveryDate: 'Sep 2026',
      isLimited: true,
      remaining: 3
    }
  ];

  const handleSelect = (reward) => {
    setSelectedRewardId(reward.id);
    if (onSelectReward) {
      onSelectReward(reward);
    }
  };

  return (
    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="text-start space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {isAr ? 'اختر مكافأتك' : 'Select Your Reward'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          {isAr ? 'كل مساهمة تقرب المشروع خطوة نحو بر الأمان' : 'Every contribution brings this project closer to reality'}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rewards.map((reward) => {
          const isSelected = selectedRewardId === reward.id;

          return (
            <div
              key={reward.id}
              onClick={() => handleSelect(reward)}
              className={`relative rounded-3xl p-6 transition-all flex flex-col justify-between cursor-pointer border-2 bg-white dark:bg-slate-900 shadow-sm ${
                isSelected 
                  ? 'border-brand-emerald ring-2 ring-brand-emerald/20 shadow-lg' 
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Limited Badge */}
              {reward.isLimited && (
                <div className="absolute -top-3 start-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isAr ? 'كمية محدودة' : 'Limited'}</span>
                </div>
              )}

              <div className="space-y-4">
                
                {/* Price & Backers */}
                <div className="flex items-baseline justify-between pt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {reward.amount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-400">EGP</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>{reward.backersCount} {isAr ? 'داعم' : 'backers'}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed min-h-[36px]">
                    {reward.description}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {reward.features.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Footer & Action */}
              <div className="pt-6 space-y-4">
                
                {/* Delivery & Remaining info */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {reward.remaining ? (
                    <span className="px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{reward.remaining} {isAr ? 'متبقي فقط' : 'left'}</span>
                    </span>
                  ) : <span />}

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{isAr ? 'التسليم المتوقع:' : 'Est. Delivery:'} {reward.deliveryDate}</span>
                  </span>
                </div>

                {/* Button */}
                <button
                  type="button"
                  className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/25'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isAr ? 'تم الاختيار' : 'Selected'}</span>
                    </>
                  ) : (
                    <span>{isAr ? 'اختر وادعم' : 'Select Reward'}</span>
                  )}
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}