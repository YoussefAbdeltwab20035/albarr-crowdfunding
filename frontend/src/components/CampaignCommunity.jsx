import { useState, useMemo } from 'react';
import { MessageSquare, Users, HelpCircle, ChevronDown, Clock, HeartHandshake } from 'lucide-react';

export default function CampaignCommunity({ lang, campaign, transactions = [] }) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState('backers');
  const [openFaq, setOpenFaq] = useState(null);

  // الداعمون الافتراضيون للحملة التجريبية الأولى فقط
  const defaultBackers = useMemo(() => {
    if (String(campaign?.id) !== '1') return [];
    return [
      { 
        name: isAr ? 'فاعل خير' : 'Anonymous Backer', 
        amount: 2500, 
        time: isAr ? 'منذ يومين' : '2 days ago', 
        cheer: isAr ? 'بارك الله في كل القائمين على هذا المشروع الطيب.' : 'May this bring immense benefit to the community.' 
      },
      { 
        name: isAr ? 'م. كريم محمود' : 'Eng. Karim Mahmoud', 
        amount: 1000, 
        time: isAr ? 'منذ 3 أيام' : '3 days ago', 
        cheer: isAr ? 'خطوة ممتازة وبالتوفيق في مراحل التنفيذ القادمة!' : 'Great initiative, wishing you total success!' 
      },
      { 
        name: isAr ? 'سارة أحمد' : 'Sara Ahmed', 
        amount: 500, 
        time: isAr ? 'منذ أسبوع' : '1 week ago',
        cheer: isAr ? 'فخورة بدعم مثل هذه المبادرات المستدامة.' : 'Proud to support such sustainable initiatives.' 
      }
    ];
  }, [campaign?.id, isAr]);

  // تصفية المعاملات الحية وتحديثها فورياً مع أي تبرع جديد
  const allBackers = useMemo(() => {
    const liveBackers = transactions
      .filter((t) => String(t.campaignId) === String(campaign?.id))
      .map((t) => ({
        name: t.donorName || (isAr ? 'فاعل خير' : 'Anonymous Backer'),
        amount: Number(t.amount) || 0,
        time: isAr ? 'الآن' : 'Just now',
        cheer: t.cheerMessage || ''
      }));

    return [...liveBackers, ...defaultBackers];
  }, [transactions, campaign?.id, defaultBackers, isAr]);

  // تحديثات الحملة
  const updates = [
    {
      id: 1,
      date: '2026-08-28',
      title: isAr ? 'بدء فحص وتوريد المعدات الميدانية' : 'Field Inspection & Equipment Sourcing',
      body: isAr 
        ? 'تم بحمد الله توقيع الاتفاق المبدئي مع الموردين لبدء أعمال الصيانة فور اكتمال النصف الأول من التمويل.'
        : 'Initial supply agreements have been signed to initiate maintenance once 50% funding is secured.'
    },
    {
      id: 2,
      date: '2026-08-15',
      title: isAr ? 'إطلاق الحملة واستقبال الدعم الأولي' : 'Campaign Launch & Initial Support',
      body: isAr
        ? 'انطلقت الحملة رسمياً بدعم من فريق المتطوعين وشركائنا الميدانيين في المحافظة.'
        : 'The campaign has officially launched with strong community backing and field volunteers.'
    }
  ];

  // الأسئلة الشائعة
  const faqs = [
    {
      q: isAr ? 'كيف يتم التحقق من وصول التبرعات لمستحقيها؟' : 'How is donation delivery verified?',
      a: isAr 
        ? 'تخضع جميع الحملات على منصة عَ البَرّ لتدقيق الهوية، وتُصرف المبالغ المجمعة على دفعات مرحلية مرتبطة بفواتير وتقارير إنجاز مصورة.'
        : 'All campaigns undergo ID and milestone verification. Funds are disbursed in phases tied to photographic progress reports.'
    },
    {
      q: isAr ? 'هل تقتطع المنصة أي نسبة من تبرعي؟' : 'Does the platform charge any fee?',
      a: isAr 
        ? 'لا، منصة عَ البَرّ تتيح التبرع بنسبة 0% رسوم منصة، وتصل المساهمة بنسبة 100% إلى الحملة.'
        : 'No, Al-Barr operates with 0% platform fee, ensuring 100% of your pledge goes to the cause.'
    },
    {
      q: isAr ? 'هل يمكنني استرداد مساهمتي إذا لم تكتمل الحملة؟' : 'Can I request a refund if the goal is not met?',
      a: isAr 
        ? 'في حال عدم بلوغ الحد الأدنى للتنفيذ بعد انتهاء المدة، يُعاد المبلغ بالكامل لمحفظتك أو حسابك البنكي وفق شروط الشفافية.'
        : 'If the campaign fails to reach its minimum execution threshold by deadline, pledges are refunded per platform policy.'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('backers')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'backers' 
              ? 'border-brand-emerald text-brand-emerald' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isAr ? 'الداعمون ورسائل التشجيع' : 'Backers & Cheers'}</span>
          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] flex items-center justify-center font-mono">
            {allBackers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('updates')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'updates' 
              ? 'border-brand-emerald text-brand-emerald' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isAr ? 'التحديثات الدورية' : 'Updates'}</span>
          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] flex items-center justify-center font-mono">
            {updates.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'faq' 
              ? 'border-brand-emerald text-brand-emerald' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</span>
        </button>
      </div>

      {/* Tab Content: Backers */}
      {activeTab === 'backers' && (
        <div className="space-y-3">
          {allBackers.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6 space-y-2">
              <HeartHandshake className="w-8 h-8 text-brand-emerald mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'كن أول داعم لهذا المشروع واترك بصمتك ورسالتك التشجيعية!' : 'Be the first to back this campaign!'}
              </p>
            </div>
          ) : (
            allBackers.map((b, i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-2 transition-colors animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-emerald font-black flex items-center justify-center text-xs border border-brand-100 dark:border-slate-700">
                      {b.name?.charAt(0) || 'ف'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{b.name}</span>
                      <span className="text-[10px] text-slate-400">{b.time}</span>
                    </div>
                  </div>
                  <div className="font-black text-brand-emerald">
                    {Number(b.amount).toLocaleString()} <span className="text-[10px]">EGP</span>
                  </div>
                </div>

                {b.cheer && (
                  <div className="ps-12 flex items-start gap-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed italic">
                    <HeartHandshake className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                    <span>«{b.cheer}»</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Updates */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          {updates.map((up) => (
            <div key={up.id} className="relative ps-6 border-s-2 border-brand-emerald/30 space-y-1.5">
              <div className="absolute -start-[7px] top-0 w-3 h-3 rounded-full bg-brand-emerald ring-4 ring-brand-50 dark:ring-slate-800" />
              <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {up.date}
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{up.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{up.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: FAQ Accordion */}
      {activeTab === 'faq' && (
        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-start font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-emerald' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/40 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}