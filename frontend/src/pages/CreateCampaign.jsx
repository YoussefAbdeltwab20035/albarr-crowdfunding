import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, UploadCloud, 
  ImageIcon, Trash2, AlertCircle, Eye, Users, Clock, ShieldCheck 
} from 'lucide-react';

export default function CreateCampaign({ lang, onAddCampaign }) {
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    categoryAr: 'مجتمعي وخيري',
    categoryEn: 'Community',
    targetAmount: '',
    durationDays: '30',
    descriptionAr: '',
    descriptionEn: '',
    creatorName: '',
    creatorEmail: '',
    image: null,
    imagePreview: ''
  });

  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const NextIcon = isAr ? ArrowLeft : ArrowRight;

  const handleChange = (e) => {
    setErrorMsg('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // معالجة وضغط الصورة باستخدام Canvas وتخزينها بصيغة Base64 خفيفة ومستقرة
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(isAr ? 'حجم الملف كبير، يرجى اختيار صورة أقل من 10 ميجابايت' : 'File too large, select under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // تحويل الصورة المضغوطة بجودة 0.72 لتظل بحجم أقل من 100KB
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.72);

        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: compressedBase64
        }));
        setErrorMsg('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null, imagePreview: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // التحقق من الخطوة الأولى
  const handleNextStep1 = () => {
    if (!formData.titleAr.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال عنوان الحملة بالعربية على الأقل' : 'Please provide a title');
      return;
    }
    if (!formData.imagePreview) {
      setErrorMsg(isAr ? 'يرجى رفع صورة الغلاف للمشروع للمتابعة' : 'Please upload a cover image to continue');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  // التحقق من الخطوة الثانية
  const handleNextStep2 = () => {
    const target = Number(formData.targetAmount);
    if (!target || target < 1000) {
      setErrorMsg(isAr ? 'المبلغ المستهدف يجب ألا يقل عن 1,000 ج.م' : 'Target amount must be at least 1,000 EGP');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  // إنهاء النموذج
  const handleFinish = (e) => {
    e.preventDefault();
    if (!formData.creatorName.trim() || !formData.descriptionAr.trim()) {
      setErrorMsg(isAr ? 'يرجى إكمال اسم المنظم وقصة المشروع' : 'Please fill creator name and project story');
      return;
    }

    const newCampaign = {
      id: Date.now().toString(),
      title: {
        ar: formData.titleAr,
        en: formData.titleEn.trim() || formData.titleAr
      },
      description: {
        ar: formData.descriptionAr,
        en: formData.descriptionEn.trim() || formData.descriptionAr
      },
      category: {
        ar: formData.categoryAr,
        en: formData.categoryEn
      },
      raised: 0,
      goal: Number(formData.targetAmount),
      backers: 0,
      daysLeft: Number(formData.durationDays) || 30,
      image: formData.imagePreview,
      author: {
        ar: formData.creatorName,
        en: formData.creatorName,
        verified: true
      },
      createdAt: new Date().toISOString()
    };

    onAddCampaign(newCampaign);
    navigate('/');
  };

  // بيانات المعاينة الحية
  const previewTitle = (isAr ? formData.titleAr : (formData.titleEn || formData.titleAr)) || (isAr ? 'عنوان المشروع سيظهر هنا...' : 'Project title preview...');
  const previewDesc = (isAr ? formData.descriptionAr : (formData.descriptionEn || formData.descriptionAr)) || (isAr ? 'قصة وأهداف المشروع ستظهر هنا لمساعدة الداعمين في فهم الأثر المجتمعي...' : 'Campaign description and impact overview will be previewed here...');
  const previewCategory = isAr ? formData.categoryAr : formData.categoryEn;
  const previewAuthor = formData.creatorName || (isAr ? 'اسم المنظم' : 'Creator name');
  const previewGoal = Number(formData.targetAmount) || 50000;

  return (
    <div className="min-h-screen py-10 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-emerald dark:text-slate-400 dark:hover:text-brand-emerald transition-colors">
            <BackIcon className="w-4 h-4" />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to home'}</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'ابدأ حملتك على عَ البَرّ' : 'Start Your Campaign'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {isAr ? 'حوّل فكرتك إلى واقع بخطوات بسيطة وشفافة مدعومة من المجتمع' : 'Bring your project to life with community trust and transparency'}
          </p>
        </div>

        {/* Stepper Header */}
        <div className="max-w-xl mx-auto flex items-center justify-between mb-8 px-4">
          {[
            { num: 1, labelAr: 'البيانات الأساسية', labelEn: 'Basics' },
            { num: 2, labelAr: 'التمويل والهدف', labelEn: 'Funding' },
            { num: 3, labelAr: 'القصة والصانع', labelEn: 'Story' }
          ].map((item, idx) => (
            <div key={item.num} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === item.num
                    ? 'bg-brand-emerald text-white ring-4 ring-brand-emerald/20 shadow-md'
                    : step > item.num
                      ? 'bg-brand-50 dark:bg-emerald-950 text-brand-emerald border border-brand-emerald'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {step > item.num ? <CheckCircle2 className="w-4 h-4" /> : item.num}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${step === item.num ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {isAr ? item.labelAr : item.labelEn}
                </span>
              </div>
              {idx < 2 && <div className={`flex-1 h-0.5 mx-3 transition-colors ${step > item.num ? 'bg-brand-emerald' : 'bg-slate-200 dark:bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="max-w-xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Grid: Form (7 Cols) + Live Preview (5 Cols) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'عنوان الحملة (بالعربية) *' : 'Campaign Title (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    name="titleAr"
                    value={formData.titleAr}
                    onChange={handleChange}
                    placeholder={isAr ? 'مثال: محطة طاقة شمسية لإنارة قرية النور' : 'Title in Arabic'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'عنوان الحملة (بالإنجليزية - اختياري)' : 'Campaign Title (English - Optional)'}
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    value={formData.titleEn}
                    onChange={handleChange}
                    placeholder="e.g. Solar Power Grid for Al-Nour Village"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'التصنيف الرئيسي' : 'Primary Category'}
                  </label>
                  <select
                    name="categoryAr"
                    value={formData.categoryAr}
                    onChange={(e) => {
                      const arVal = e.target.value;
                      const enVal = arVal === 'مجتمعي وخيري' ? 'Community' : arVal === 'مياه وإغاثة' ? 'Water & Relief' : arVal === 'زراعة وتنمية' ? 'Agriculture' : 'Tech & Education';
                      setFormData({ ...formData, categoryAr: arVal, categoryEn: enVal });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                  >
                    <option value="مجتمعي وخيري">{isAr ? 'مجتمعي وخيري' : 'Community & Social'}</option>
                    <option value="مياه وإغاثة">{isAr ? 'مياه وإغاثة' : 'Water & Relief'}</option>
                    <option value="زراعة وتنمية">{isAr ? 'زراعة وتنمية' : 'Agriculture & Development'}</option>
                    <option value="تعليم وتكنولوجيا">{isAr ? 'تعليم وتكنولوجيا' : 'Tech & Education'}</option>
                  </select>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'صورة الغلاف الرئيسية *' : 'Campaign Cover Image *'}
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {!formData.imagePreview ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-emerald rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-emerald flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{isAr ? 'اضغط لاختيار صورة من جهازك' : 'Click to select an image'}</p>
                      <p className="text-[11px] text-slate-400 mt-1">يدعم PNG, JPG حتى 10 ميجابايت (يتم ضغطها آلياً للحفظ الدائم)</p>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="w-full h-52 object-cover" 
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{isAr ? 'تغيير' : 'Change'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'حذف' : 'Remove'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep1}
                    className="bg-brand-emerald hover:bg-brand-emeraldDark text-white px-7 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-emerald/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{isAr ? 'التالي: التمويل والمدة' : 'Next: Funding & Target'}</span>
                    <NextIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Funding */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'المبلغ المستهدف بالجنيه المصري (الحد الأدنى 1,000) *' : 'Target Goal in EGP *'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      placeholder="150,000"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-black text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                    />
                    <span className="absolute top-1/2 -translate-y-1/2 end-4 text-xs font-bold text-slate-400 pointer-events-none">EGP</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'مدة استمرار الحملة' : 'Campaign Duration'}
                  </label>
                  <select
                    name="durationDays"
                    value={formData.durationDays}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                  >
                    <option value="15">15 {isAr ? 'يوماً' : 'Days'}</option>
                    <option value="30">30 {isAr ? 'يوماً (موصى به)' : 'Days (Recommended)'}</option>
                    <option value="45">45 {isAr ? 'يوماً' : 'Days'}</option>
                    <option value="60">60 {isAr ? 'يوماً' : 'Days'}</option>
                  </select>
                </div>

                <div className="p-4 bg-brand-50/50 dark:bg-emerald-950/30 rounded-2xl border border-brand-100/60 dark:border-emerald-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  💡 {isAr 
                    ? 'نصيحة: الحملات التي تتراوح مدتها بين 30 إلى 45 يوماً تحقق أعلى نسب نجاح في تحقيق أهدافها المالية وفقاً لإحصائيات المنصة.' 
                    : 'Tip: Campaigns lasting between 30 to 45 days achieve the highest success rate in reaching their goals.'}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(''); setStep(1); }}
                    className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BackIcon className="w-4 h-4" />
                    <span>{isAr ? 'السابق' : 'Back'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep2}
                    className="bg-brand-emerald hover:bg-brand-emeraldDark text-white px-7 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-emerald/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{isAr ? 'التالي: القصة والصانع' : 'Next: Story & Creator'}</span>
                    <NextIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Narrative & Creator */}
            {step === 3 && (
              <form onSubmit={handleFinish} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'اسم المنظم أو المبادرة / المؤسسة *' : 'Creator / Initiative Name *'}
                  </label>
                  <input
                    type="text"
                    name="creatorName"
                    value={formData.creatorName}
                    onChange={handleChange}
                    placeholder={isAr ? 'مثال: جمعية سنابل الخير' : 'Creator or Entity name'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'البريد الإلكتروني الرسمي للتواصل والمتابعة *' : 'Official Email Address *'}
                  </label>
                  <input
                    type="email"
                    name="creatorEmail"
                    value={formData.creatorEmail}
                    onChange={handleChange}
                    placeholder="contact@organization.org"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {isAr ? 'قصة المشروع وخطة التنفيذ بالتفصيل *' : 'Project Story & Roadmap *'}
                  </label>
                  <textarea
                    name="descriptionAr"
                    rows="5"
                    value={formData.descriptionAr}
                    onChange={handleChange}
                    placeholder={isAr ? 'اشرح بالتفصيل أين سيتم إنفاق التبرعات، والأثر المستهدف، ومراحل التنفيذ...' : 'Explain milestone execution and fund allocation...'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(''); setStep(2); }}
                    className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BackIcon className="w-4 h-4" />
                    <span>{isAr ? 'السابق' : 'Back'}</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-emerald hover:bg-brand-emeraldDark text-white px-8 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-emerald/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'نشر وإطلاق الحملة الآن' : 'Publish Campaign'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Live Preview Side (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Eye className="w-4 h-4 text-brand-emerald" />
              <span>{isAr ? 'معاينة حية للكارت كما سيظهر للمستخدمين' : 'Live Card Preview'}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col pointer-events-none select-none transition-colors">
              
              {/* Media Preview */}
              <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-2">
                    <ImageIcon className="w-10 h-10 stroke-1" />
                    <span className="text-[11px] font-bold">{isAr ? 'صورة الغلاف ستظهر هنا' : 'Cover image preview'}</span>
                  </div>
                )}
                
                <div className="absolute top-3 start-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 dark:text-white shadow-sm">
                  {previewCategory}
                </div>

                <div className="absolute top-3 end-3 bg-white dark:bg-slate-900 text-brand-emerald px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                  <span>{isAr ? 'حملة جديدة' : 'New'}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-slate-400 block truncate">
                    {previewAuthor}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                    {previewTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {previewDesc}
                  </p>
                </div>

                {/* Metric Bars */}
                <div className="space-y-2 pt-2">
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-emerald rounded-full w-[5%]" />
                  </div>

                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <span className="font-black text-slate-900 dark:text-white">0</span>
                      <span className="text-[10px] text-slate-400 font-bold ms-1">EGP</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {isAr ? 'الهدف:' : 'Goal:'} {previewGoal.toLocaleString()} EGP
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>0 {isAr ? 'داعم' : 'backers'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formData.durationDays} {isAr ? 'يوم متبقي' : 'days left'}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}