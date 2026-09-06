import { useState } from 'react';
import { X, Heart, CreditCard, Building2, Store, Smartphone, ShieldCheck } from 'lucide-react';

export default function PledgeDrawer({ 
  isOpen, 
  onClose, 
  campaign, 
  lang, 
  onPledge,
  initialAmount = 500
}) {
  const isAr = lang === 'ar';
  const presetAmounts = [100, 500, 1000, 5000];

  // 1. استدعاء جميع الـ Hooks في بداية المكون بدون أي شروط قبلها
  const defaultNum = Number(initialAmount) || 500;
  const [selectedAmount, setSelectedAmount] = useState(defaultNum);
  const [customAmount, setCustomAmount] = useState(String(defaultNum));
  const [paymentMethod, setPaymentMethod] = useState('instapay');

  const handleSelectPreset = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setSelectedAmount(Number(val) || 0);
  };

  const handleConfirmPledge = () => {
    const numericAmount = Number(customAmount) || 0;
    if (numericAmount <= 0) return;

    if (onPledge && campaign?.id) {
      onPledge(campaign.id, numericAmount, paymentMethod);
    }

    onClose();
  };

  // 2. التحقق من الفتح والإغلاق يأتي بعد تعريف الـ Hooks وليس قبلها
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in slide-in-from-bottom duration-300 border border-slate-100 dark:border-slate-800 transition-colors">
        
        {/* Handle bar on mobile */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'ادعم الحملة' : 'Support Campaign'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {campaign?.title?.[lang] || (isAr ? 'مساهمة في مشروع' : 'Campaign pledge')}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Amount Selection */}
        <div className="space-y-4 mb-6">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {isAr ? 'اختر مبلغ المساهمة' : 'Select Pledge Amount'}
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleSelectPreset(amount)}
                className={`py-3 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                  selectedAmount === amount
                    ? 'border-brand-emerald bg-brand-50 dark:bg-emerald-950/60 text-brand-emerald shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                }`}
              >
                {amount} {isAr ? 'ج.م' : 'EGP'}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomChange}
              placeholder={isAr ? 'مبلغ آخر...' : 'Other amount...'}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white font-bold text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
            />
            <span className="absolute top-1/2 -translate-y-1/2 end-4 text-xs font-bold text-slate-400 pointer-events-none">
              {isAr ? 'ج.م' : 'EGP'}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {isAr ? 'طريقة الدفع' : 'Payment Method'}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* InstaPay */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'instapay' 
                ? 'border-brand-emerald bg-brand-50/60 dark:bg-emerald-950/40 ring-1 ring-brand-emerald' 
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800'
            }`}>
              <input 
                type="radio" 
                name="drawer_pm" 
                checked={paymentMethod === 'instapay'} 
                onChange={() => setPaymentMethod('instapay')}
                className="sr-only" 
              />
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{isAr ? 'إنستاباي' : 'InstaPay'}</span>
            </label>

            {/* Fawry */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'fawry' 
                ? 'border-brand-emerald bg-brand-50/60 dark:bg-emerald-950/40 ring-1 ring-brand-emerald' 
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800'
            }`}>
              <input 
                type="radio" 
                name="drawer_pm" 
                checked={paymentMethod === 'fawry'} 
                onChange={() => setPaymentMethod('fawry')}
                className="sr-only" 
              />
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{isAr ? 'فوري' : 'Fawry'}</span>
            </label>

            {/* Mobile Wallet */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'wallet' 
                ? 'border-brand-emerald bg-brand-50/60 dark:bg-emerald-950/40 ring-1 ring-brand-emerald' 
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800'
            }`}>
              <input 
                type="radio" 
                name="drawer_pm" 
                checked={paymentMethod === 'wallet'} 
                onChange={() => setPaymentMethod('wallet')}
                className="sr-only" 
              />
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{isAr ? 'محفظة إلكترونية' : 'Smart Wallet'}</span>
            </label>

            {/* Credit Card */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'card' 
                ? 'border-brand-emerald bg-brand-50/60 dark:bg-emerald-950/40 ring-1 ring-brand-emerald' 
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800'
            }`}>
              <input 
                type="radio" 
                name="drawer_pm" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')}
                className="sr-only" 
              />
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-brand-emerald flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{isAr ? 'بطاقة بنكية' : 'Bank Card'}</span>
            </label>

          </div>
        </div>

        {/* Total & Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{isAr ? 'إجمالي المساهمة:' : 'Total Pledge:'}</span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {Number(customAmount || 0).toLocaleString()} <span className="text-xs font-bold text-brand-emerald">{isAr ? 'ج.م' : 'EGP'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmPledge}
            className="w-full bg-brand-emerald hover:bg-brand-emeraldDark text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-emerald/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            <span>{isAr ? 'تأكيد التبرع الآن' : 'Confirm Pledge'}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
            <span>{isAr ? 'معاملة آمنة ومشفرة 100%' : '100% Secure & Encrypted Transaction'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}