import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, ArrowRight, ArrowLeft, Heart, CreditCard, 
  Building2, Store, Smartphone, CheckCircle2, Copy, UploadCloud, FileCheck, X 
} from 'lucide-react';
import { mockCampaigns } from '../data/mockData';
import Confetti from '../components/Confetti';

export default function Checkout({ lang, campaigns = mockCampaigns, onPledge, onToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isAr = lang === 'ar';

  const campaign = campaigns.find((c) => String(c.id) === String(id)) || campaigns[0] || mockCampaigns[0];

  const [amount, setAmount] = useState('500');
  const [selectedReward, setSelectedReward] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [donorInfo, setDonorInfo] = useState({
    name: 'يوسف عبد التواب',
    email: 'youssef@example.com',
    phone: '01012345678',
    isAnonymous: false,
    cheerMessage: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnDetails, setTxnDetails] = useState(null);

  const presetAmounts = [100, 250, 500, 1000, 2500];
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const rewards = [
    {
      id: 1,
      title: { ar: 'شكر وتقدير رسمي في قائمة الداعمين', en: 'Official Backer Recognition' },
      minAmount: 250
    },
    {
      id: 2,
      title: { ar: 'تقرير إنجاز مصور دوري مع درع رقمي تذكاري', en: 'Digital Impact Certificate & Updates' },
      minAmount: 1000
    }
  ];

  const handleRewardSelect = (reward) => {
    if (selectedReward?.id === reward.id) {
      setSelectedReward(null);
    } else {
      setSelectedReward(reward);
      if (Number(amount) < reward.minAmount) {
        setAmount(reward.minAmount.toString());
      }
    }
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyReceipt = () => {
    if (!txnDetails) return;
    navigator.clipboard.writeText(txnDetails.id);
    if (onToast) {
      onToast(isAr ? 'تم نسخ رقم الإيصال إلى الحافظة!' : 'Receipt ID copied to clipboard!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = Number(amount);
    if (!finalAmount || finalAmount <= 0) return;

    const pm = paymentMethod === 'instapay' 
      ? 'InstaPay' 
      : paymentMethod === 'fawry' 
        ? 'Fawry' 
        : paymentMethod === 'wallet' 
          ? 'Smart Wallet' 
          : 'Credit Card';

    const finalName = donorInfo.isAnonymous 
      ? (isAr ? 'فاعل خير' : 'Anonymous Backer') 
      : donorInfo.name;

    if (onPledge) {
      onPledge(campaign.id, finalAmount, pm, donorInfo.cheerMessage, finalName);
    }

    const generatedTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: finalAmount,
      date: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      campaignTitle: campaign.title[lang],
      method: pm
    };

    setTxnDetails(generatedTxn);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-[90vh] py-10 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/campaign/${campaign.id}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-emerald dark:text-slate-400 dark:hover:text-brand-emerald transition-colors"
          >
            <BackIcon className="w-4 h-4" />
            <span>{isAr ? 'العودة لتفاصيل الحملة' : 'Back to Campaign'}</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
          {isAr ? 'إتمام المساهمة والدعم' : 'Complete Your Pledge'}
        </h1>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Select Amount */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-emerald flex items-center justify-center text-xs">1</span>
                <span>{isAr ? 'حدد مبلغ المساهمة' : 'Choose Pledge Amount'}</span>
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset.toString());
                      if (selectedReward && preset < selectedReward.minAmount) {
                        setSelectedReward(null);
                      }
                    }}
                    className={`py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                      Number(amount) === preset
                        ? 'border-brand-emerald bg-brand-50 dark:bg-emerald-950/40 text-brand-emerald shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {preset} {isAr ? 'ج.م' : 'EGP'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={isAr ? 'مبلغ مخصص...' : 'Custom amount...'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-slate-900 dark:text-white font-bold text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                  required
                />
                <span className="absolute top-1/2 -translate-y-1/2 end-4 text-xs font-bold text-slate-400 pointer-events-none">
                  {isAr ? 'ج.م' : 'EGP'}
                </span>
              </div>

              {/* Rewards */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                  {isAr ? 'اختر مكافأة تقديرية (اختياري):' : 'Select a Reward (Optional):'}
                </span>
                {rewards.map((rew) => (
                  <div
                    key={rew.id}
                    onClick={() => handleRewardSelect(rew)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      selectedReward?.id === rew.id
                        ? 'border-brand-emerald bg-brand-50/50 dark:bg-emerald-950/30 ring-1 ring-brand-emerald'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{rew.title[lang]}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr ? `للداعمين بمبلغ ${rew.minAmount} ج.م أو أكثر` : `For pledges of ${rew.minAmount} EGP or more`}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedReward?.id === rew.id ? 'border-brand-emerald bg-brand-emerald text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {selectedReward?.id === rew.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Payment Methods */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-emerald flex items-center justify-center text-xs">2</span>
                <span>{isAr ? 'اختر وسيلة الدفع' : 'Payment Method'}</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'instapay'
                    ? 'border-brand-emerald bg-brand-50/60 dark:bg-emerald-950/40 ring-1 ring-brand-emerald'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}>
                  <input
                    type="radio"
                    name="checkout_pm"
                    checked={paymentMethod === 'instapay'}
                    onChange={() => setPaymentMethod('instapay')}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{isAr ? 'إنستاباي (InstaPay)' : 'InstaPay'}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{isAr ? 'تحويل فوري بدون عمولة' : 'Instant Zero-Fee Transfer'}</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'fawry'
                    ? 'border-brand-emerald bg-brand-50/60 dark:bg-emerald-950/40 ring-1 ring-brand-emerald'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}>
                  <input
                    type="radio"
                    name="checkout_pm"
                    checked={paymentMethod === 'fawry'}
                    onChange={() => setPaymentMethod('fawry')}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{isAr ? 'فوري (Fawry)' : 'Fawry Pay'}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{isAr ? 'الدفع برقم مرجعي من أي منفذ' : 'Reference code payment'}</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-brand-emerald bg-brand-50/60 dark:bg-emerald-950/40 ring-1 ring-brand-emerald'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}>
                  <input
                    type="radio"
                    name="checkout_pm"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{isAr ? 'محفظة إلكترونية' : 'Smart Wallets'}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{isAr ? 'فودافون كاش، وي باي، أورانج' : 'Vodafone, Orange, WE Pay'}</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-emerald bg-brand-50/60 dark:bg-emerald-950/40 ring-1 ring-brand-emerald'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}>
                  <input
                    type="radio"
                    name="checkout_pm"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-brand-emerald flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{isAr ? 'بطاقة بنكية / ميزة' : 'Debit / Credit / Meeza'}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{isAr ? 'فيزا، ماستركارد، ميزة' : 'Visa & Mastercard'}</span>
                  </div>
                </label>
              </div>

              {/* تحويل مباشر مع رفع سكرين شوت الإيصال لـ إنستاباي والمحافظ */}
              {(paymentMethod === 'instapay' || paymentMethod === 'wallet') && (
                <div className="mt-4 p-4 rounded-2xl bg-brand-50/40 dark:bg-emerald-950/20 border border-brand-100 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{isAr ? 'بيانات التحويل المباشر:' : 'Direct Transfer Details:'}</span>
                    <span className="text-brand-emerald font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-brand-100 dark:border-slate-700">
                      {paymentMethod === 'instapay' ? 'albarr@instapay' : '01012345678'}
                    </span>
                  </div>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-brand-200 dark:border-emerald-800/80 hover:border-brand-emerald rounded-xl p-4 text-center cursor-pointer bg-white/80 dark:bg-slate-900/60 transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                    {receiptPreview ? (
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 text-brand-emerald font-bold text-xs">
                          <FileCheck className="w-4 h-4" />
                          <span>{isAr ? 'تم إرفاق إيصال التحويل بنجاح' : 'Receipt attached'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReceiptPreview(null);
                          }}
                          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <UploadCloud className="w-5 h-5 text-brand-emerald" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {isAr ? 'اضغط لرفع سكرين شوت إيصال التحويل (اختياري للتحقق)' : 'Upload receipt screenshot (Optional)'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Donor Info & Cheer Message */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-emerald flex items-center justify-center text-xs">3</span>
                <span>{isAr ? 'بيانات المساهم' : 'Contributor Details'}</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                    required
                  />
                </div>
              </div>

              {/* Cheer Message Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'رسالة تشجيع لصاحب الحملة (تظهر في قائمة الداعمين - اختياري)' : 'Words of Encouragement (Optional)'}
                </label>
                <textarea
                  rows="2"
                  value={donorInfo.cheerMessage}
                  onChange={(e) => setDonorInfo({ ...donorInfo, cheerMessage: e.target.value })}
                  placeholder={isAr ? 'اكتب كلمة دعم أو دعوة طيبة لأصحاب المشروع...' : 'Write an inspiring cheer message...'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={donorInfo.isAnonymous}
                  onChange={(e) => setDonorInfo({ ...donorInfo, isAnonymous: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-700 text-brand-emerald focus:ring-brand-emerald w-4 h-4"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {isAr ? 'تبرع كفاعل خير (إخفاء اسمي من قائمة المساهمين العلنية)' : 'Make this pledge anonymously'}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-emerald hover:bg-brand-emeraldDark text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-brand-emerald/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isAr ? `تأكيد ودفع ${Number(amount || 0).toLocaleString()} ج.م` : `Confirm & Pay ${Number(amount || 0).toLocaleString()} EGP`}</span>
            </button>
          </form>

          {/* Sticky Campaign Summary */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                {isAr ? 'ملخص المساهمة' : 'Pledge Summary'}
              </span>

              <div className="flex gap-3 items-center">
                <img src={campaign.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-brand-emerald bg-brand-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {campaign.category[lang]}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">{campaign.title[lang]}</h3>
                  <p className="text-[11px] text-slate-400">{campaign.author[lang]}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isAr ? 'مبلغ الدعم' : 'Pledge Amount'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{Number(amount || 0).toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isAr ? 'رسوم المنصة' : 'Platform Fee'}</span>
                  <span className="font-bold text-brand-emerald">{isAr ? '0 ج.م (مجاناً)' : '0 EGP (Free)'}</span>
                </div>
                {selectedReward && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isAr ? 'المكافأة' : 'Reward'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{selectedReward.title[lang]}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">{isAr ? 'الإجمالي المطلوب' : 'Total Due'}</span>
                <span className="text-xl font-black text-brand-emerald">{Number(amount || 0).toLocaleString()} <span className="text-xs">EGP</span></span>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
                <span>{isAr ? 'دفع آمن ومحمي بأعلى معايير التشفير' : 'Secure & Encrypted Checkout'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Success Modal + Confetti */}
      {isSuccess && txnDetails && (
        <>
          <Confetti />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-slate-800 text-brand-emerald flex items-center justify-center mx-auto ring-8 ring-brand-50/50 dark:ring-slate-800/50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {isAr ? 'تمت المساهمة بنجاح!' : 'Pledge Successful!'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isAr ? 'شكراً لدعمك وصناعة أثر حقيقي ومستدام.' : 'Thank you for making a real difference.'}
                </p>
              </div>

              {/* Receipt Box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-xs space-y-2.5 text-slate-700 dark:text-slate-300 text-start border border-slate-200/70 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'رقم الإيصال' : 'Receipt ID'}:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{txnDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'الحملة' : 'Campaign'}:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{txnDetails.campaignTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'المبلغ المدفوع' : 'Amount'}:</span>
                  <span className="font-black text-brand-emerald text-sm">{txnDetails.amount.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'وسيلة الدفع' : 'Method'}:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{txnDetails.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'التاريخ' : 'Date'}:</span>
                  <span>{txnDetails.date}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopyReceipt}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نسخ الإيصال' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 py-3 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold transition-all shadow-md shadow-brand-emerald/20 cursor-pointer"
                >
                  {isAr ? 'الانتقال لملفي' : 'Go to Profile'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}