import { ShieldCheck, Target, HeartHandshake, Sparkles, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks({ lang }) {
  const isAr = lang === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const steps = [
    {
      num: '01',
      title: isAr ? 'أطلق فكرتك وحدد هدفك' : 'Launch & Set Target',
      desc: isAr 
        ? 'قدّم مشروعك التنموي أو الحرفي أو المجتمعي، وحدد الهدف المالي المطلوب والمدة الزمنية وخطة الإنفاق الشفافة.' 
        : 'Submit your community, craft, or social initiative with a clear budget, milestones, and timeline.',
      icon: <Target className="w-6 h-6 text-brand-emerald" />
    },
    {
      num: '02',
      title: isAr ? 'توثيق الحملة والمراجعة' : 'Verification & Trust',
      desc: isAr 
        ? 'يقوم فريق المنصة بالتحقق من الهوية وصحة البيانات لضمان أعلى معايير الشفافية والمصداقية لكل داعم.' 
        : 'Our team verifies IDs and project feasibility to ensure total trust and accountability for every backer.',
      icon: <ShieldCheck className="w-6 h-6 text-brand-emerald" />
    },
    {
      num: '03',
      title: isAr ? 'دعم المجتمع وتوسيع الأثر' : 'Community Backing',
      desc: isAr 
        ? 'يتفاعل المجتمع مع حملتك بالدعم المالي المباشر عبر وسائل الدفع المحلية الموثوقة (إنستاباي، فوري، والمحافظ).' 
        : 'Supporters pledge directly using verified local Egyptian gateways like InstaPay, Fawry, and Smart Wallets.',
      icon: <HeartHandshake className="w-6 h-6 text-brand-emerald" />
    },
    {
      num: '04',
      title: isAr ? 'تحقيق الإنجاز والتقارير' : 'Execution & Reports',
      desc: isAr 
        ? 'بعد اكتمال التمويل، يتم تحويل المبالغ على دفعات مرحلية مرتبطة بنشر تقارير مصورة للداعمين حتى اكتمال المشروع.' 
        : 'Funds are disbursed by verified milestone completion with transparent updates sent to every backer.',
      icon: <Sparkles className="w-6 h-6 text-brand-emerald" />
    }
  ];

  return (
    <div className="min-h-[85vh] py-12 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-emerald mb-2">
            <BackIcon className="w-4 h-4" />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? 'التمويل الجماعي.. بضمان وشفافية' : 'Crowdfunding Built on Trust'}
          </h1>
          <p className="text-xs sm:text-base text-slate-600 font-medium leading-relaxed">
            {isAr 
              ? 'صممنا منصة "عَ البَرّ" لتكون الجسر الموثوق بين أصحاب المبادرات التنموية ورواد الأعمال في مصر، وبين كل شخص يؤمن بقوة العطاء والمشاركة.' 
              : 'Al-Barr is built to bridge ambitious social creators with backers across Egypt with transparency.'}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="text-2xl font-black text-slate-200">{s.num}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Guarantees Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-brand-50 px-3 py-1 rounded-full">
              {isAr ? 'ضمانات المنصة' : 'Our Guarantees'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isAr ? 'لماذا يثق بنا الداعمون وأصحاب المشاريع؟' : 'Why Creators and Backers Trust Us'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isAr 
                ? 'نحن لا نجمع التبرعات العشوائية، بل نوفر منظومة واضحة تحمي أموالك وتضمن وصول كل جنيه للمسار الصحيح.' 
                : 'We provide an audited crowdfunding environment safeguarding funds and tracking project outcomes.'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              isAr ? 'التحقق الصارم من بطاقات الرقم القومي والسجل الرسمي' : 'Strict ID and organization registry verification',
              isAr ? 'دعم محلي فوري 100% عبر إنستاباي، فوري، والمحافظ الذكية' : 'Instant local checkout via InstaPay, Fawry, and Wallets',
              isAr ? 'صرف أموال الحملات على مراحل مرتبطة بتقارير تنفيذية مصورة' : 'Milestone-based fund disbursement with photo proof',
              isAr ? 'استرداد كامل للأموال في حال عدم وصول الحملة لهدفها الأدنى' : 'All-or-nothing guarantee protects your donations'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs font-bold text-slate-700">
                <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-4">
          <h3 className="text-xl font-bold text-slate-900">{isAr ? 'جاهز لتحويل فكرتك لمشروع حقيقي؟' : 'Ready to start your journey?'}</h3>
          <Link
            to="/create-campaign"
            className="inline-block bg-brand-emerald hover:bg-brand-emeraldDark text-white px-8 py-3.5 rounded-full text-xs font-bold shadow-lg shadow-brand-emerald/20 transition-all active:scale-95"
          >
            {isAr ? 'ابدأ حملتك الآن مجاناً' : 'Start Your Campaign Now'}
          </Link>
        </div>

      </div>
    </div>
  );
}