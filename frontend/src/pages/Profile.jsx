import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, FolderPlus, Receipt, ArrowUpRight, CheckCircle2, 
  Trash2, Mail, Phone, MapPin, Calendar, Plus, Wallet, 
  TrendingUp, Users, Copy, ExternalLink, Edit3, Camera, 
  X, Lock 
} from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80";

export default function Profile({ 
  lang, 
  campaigns = [], 
  transactions = [], 
  currentUser,
  onUpdateProfile,
  onDeleteCampaign,
  onToast 
}) {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('backed'); // 'backed' | 'my_campaigns' | 'transactions'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State لتعديل البروفايل
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || 'يوسف عبد التواب',
    email: currentUser?.email || 'youssef@example.com',
    phone: currentUser?.phone || '+20 101 234 5678',
    location: currentUser?.location || 'القاهرة، مصر',
    bio: currentUser?.bio || 'مهندس برمجيات وناشط في دعم المبادرات البيئية والتعليمية المستدامة.',
    avatar: currentUser?.avatar || ''
  });

  // إدارة الإشعارات غير المقروءة لسجل المعاملات
  const [lastReadTxnCount, setLastReadTxnCount] = useState(() => {
    try {
      return Number(localStorage.getItem('albarr_read_txns_count')) || 0;
    } catch {
      return 0;
    }
  });

  const unreadTxnCount = Math.max(0, transactions.length - lastReadTxnCount);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'transactions') {
      setLastReadTxnCount(transactions.length);
      try {
        localStorage.setItem('albarr_read_txns_count', String(transactions.length));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // رفع وضغط الصورة الشخصية
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        setEditForm((prev) => ({ ...prev, avatar: compressed }));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(editForm);
    }
    setIsEditModalOpen(false);
  };

  // 1. حساب إجمالي الدعم المدفوع من المستخدم
  const totalPledged = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [transactions]);

  // 2. حملاتي المنشورة (المحمية بحساب المستخدم)
  const myCampaigns = useMemo(() => {
    return campaigns.filter((c) => 
      c.creatorEmail === currentUser?.email || 
      c.creatorId === currentUser?.id ||
      c.author?.ar === currentUser?.name || 
      c.author?.en === currentUser?.name ||
      c.isUserCreated
    );
  }, [campaigns, currentUser]);

  // 3. المشاريع التي قمت بدعمها فعلياً
  const backedCampaigns = useMemo(() => {
    const pledgedIds = new Set(transactions.map((t) => String(t.campaignId)));
    return campaigns.filter((c) => pledgedIds.has(String(c.id)));
  }, [campaigns, transactions]);

  // إجمالي المبالغ المحصلة لحملاتي
  const totalRaisedForMyCampaigns = useMemo(() => {
    return myCampaigns.reduce((acc, curr) => acc + (Number(curr.raised) || 0), 0);
  }, [myCampaigns]);

  // إجمالي الداعمين لحملاتي
  const totalBackersForMyCampaigns = useMemo(() => {
    return myCampaigns.reduce((acc, curr) => acc + (Number(curr.backers) || 0), 0);
  }, [myCampaigns]);

  const copyReceiptId = (id) => {
    navigator.clipboard.writeText(id);
    if (onToast) {
      onToast(isAr ? 'تم نسخ رقم الإيصال إلى الحافظة' : 'Receipt ID copied');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start w-full md:w-auto">
            
            {/* Avatar with dynamic photo upload */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-gradient-to-tr from-brand-emerald to-emerald-400 flex items-center justify-center text-white font-black text-3xl">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser?.name?.charAt(0) || 'ي'}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 end-0 w-8 h-8 rounded-full bg-brand-emerald text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 hover:scale-110 transition-transform cursor-pointer"
                title={isAr ? 'تعديل الصورة الشخصية' : 'Change avatar'}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser?.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-emerald-950/60 border border-brand-200/60 dark:border-emerald-800 text-brand-emerald text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'هوية موثقة' : 'Verified ID'}</span>
                </span>
              </div>

              {currentUser?.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  {currentUser.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>{currentUser?.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-brand-emerald" />
                  <span dir="ltr">{currentUser?.phone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>{currentUser?.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>{currentUser?.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditForm({
                  name: currentUser?.name || '',
                  email: currentUser?.email || '',
                  phone: currentUser?.phone || '',
                  location: currentUser?.location || '',
                  bio: currentUser?.bio || '',
                  avatar: currentUser?.avatar || ''
                });
                setIsEditModalOpen(true);
              }}
              className="flex-1 sm:w-full px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isAr ? 'تعديل البروفايل' : 'Edit Profile'}</span>
            </button>

            <Link
              to="/create-campaign"
              className="flex-1 sm:w-full px-5 py-2.5 rounded-2xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-md shadow-brand-emerald/20 flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'ابدأ حملة جديدة' : 'New Campaign'}</span>
            </Link>
          </div>
        </div>

        {/* Analytics Statistics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">{isAr ? 'إجمالي الدعم المدفوع' : 'Total Given'}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalPledged.toLocaleString()} <span className="text-xs font-bold text-brand-emerald">EGP</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">{isAr ? 'إجمالي المحصّل لحملاتي' : 'Total Raised'}</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalRaisedForMyCampaigns.toLocaleString()} <span className="text-xs font-bold text-blue-500">EGP</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">{isAr ? 'مشاريع قمت بنشرها' : 'Created Projects'}</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                <FolderPlus className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {myCampaigns.length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">{isAr ? 'إجمالي الداعمين لحملاتي' : 'Total Backers'}</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalBackersForMyCampaigns} <span className="text-xs font-bold text-slate-400">{isAr ? 'داعم' : ''}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleTabChange('backed')}
            className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'backed'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{isAr ? 'المشاريع المدعومة' : 'Backed Projects'}</span>
            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center justify-center font-mono text-slate-600 dark:text-slate-300">
              {backedCampaigns.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('my_campaigns')}
            className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'my_campaigns'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>{isAr ? 'إدارة مشاريعي الخاصة والتمويل' : 'My Campaigns & Funding'}</span>
            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center justify-center font-mono text-slate-600 dark:text-slate-300">
              {myCampaigns.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('transactions')}
            className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'transactions'
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{isAr ? 'سجل المعاملات والإيصالات' : 'Transaction History'}</span>
            {unreadTxnCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-brand-emerald text-white text-[10px] font-black animate-pulse">
                {unreadTxnCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Backed Projects */}
        {activeTab === 'backed' && (
          <div className="space-y-6 animate-in fade-in">
            {backedCampaigns.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
                <Heart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'لم تقم بدعم أي مشاريع حتى الآن' : 'No backed projects yet'}
                </h3>
                <Link to="/" className="inline-block text-xs font-bold text-brand-emerald hover:underline">
                  {isAr ? 'استكشف المشاريع وشارك بالأثر' : 'Explore campaigns'}
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {backedCampaigns.map((camp) => {
                  const percentage = Math.min(Math.round(((camp.raised || 0) / camp.goal) * 100), 100);
                  return (
                    <div
                      key={camp.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden hover:border-brand-emerald/40 transition-all flex flex-col justify-between group"
                    >
                      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <img
                          src={camp.image || FALLBACK_IMAGE}
                          alt={camp.title[lang]}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 start-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                          {camp.category[lang]}
                        </div>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-400 font-medium block">{camp.author[lang]}</span>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-emerald transition-colors">
                            {camp.title[lang]}
                          </h3>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-emerald rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-baseline text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {Number(camp.raised).toLocaleString()} <span className="text-[10px] text-slate-400">EGP</span>
                            </span>
                            <span className="font-black text-brand-emerald">%{percentage}</span>
                          </div>
                        </div>

                        <Link
                          to={`/campaign/${camp.id}`}
                          className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-emerald hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>{isAr ? 'عرض التفاصيل' : 'View Campaign'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Campaigns & Funding Management */}
        {activeTab === 'my_campaigns' && (
          <div className="space-y-6 animate-in fade-in">
            {myCampaigns.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-3">
                <FolderPlus className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'لم تنشئ أي حملة بعد' : 'No campaigns launched yet'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {isAr ? 'ابدأ الآن في تمويل مشروعك، وستكون الوحيد صاحب الصلاحية الكاملة لإدارته والتحكم في بياناته.' : 'Start your campaign now with full ownership and funding controls.'}
                </p>
                <Link to="/create-campaign" className="inline-block text-xs font-bold text-brand-emerald hover:underline">
                  {isAr ? 'أطلق مبادرتك الأولى الآن' : 'Start your first campaign'}
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCampaigns.map((camp) => {
                  const percentage = Math.min(Math.round(((camp.raised || 0) / camp.goal) * 100), 100);
                  return (
                    <div
                      key={camp.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-brand-emerald bg-brand-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                              {camp.category[lang]}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                              <Lock className="w-3 h-3" />
                              <span>{isAr ? 'حملتك الخاصة' : 'Owner'}</span>
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onDeleteCampaign && onDeleteCampaign(camp.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title={isAr ? 'حذف الحملة' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{camp.title[lang]}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{camp.description[lang]}</p>
                      </div>

                      {/* Funding Progress & Control */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">{isAr ? 'المحصّل من الهدف:' : 'Raised / Goal:'}</span>
                            <span className="text-brand-emerald">{Number(camp.raised).toLocaleString()} / {Number(camp.goal).toLocaleString()} EGP</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/campaign/${camp.id}`}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1"
                          >
                            <span>{isAr ? 'عرض مباشر' : 'View Live'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Transactions History */}
        {activeTab === 'transactions' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in">
            {transactions.length === 0 ? (
              <div className="text-center py-16 p-8 space-y-2">
                <Receipt className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {isAr ? 'لا توجد معاملات مسجلة حتى الآن' : 'No transactions recorded yet'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((txn, index) => (
                  <div key={txn.id || index} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">{txn.campaignTitle}</span>
                        <span className="text-[10px] font-bold text-brand-emerald bg-brand-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          {txn.method || 'InstaPay'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-mono">{txn.id}</span>
                        <span>•</span>
                        <span>{txn.date ? new Date(txn.date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : (isAr ? 'الآن' : 'Just now')}</span>
                        {txn.donorName && (
                          <>
                            <span>•</span>
                            <span>{txn.donorName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-end">
                        <span className="text-sm font-black text-brand-emerald block">
                          +{Number(txn.amount).toLocaleString()} <span className="text-[10px]">EGP</span>
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">{isAr ? 'مكتمل بنجاح' : 'Success'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyReceiptId(txn.id)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                        title={isAr ? 'نسخ رقم الإيصال' : 'Copy ID'}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal: Edit Profile & Upload Avatar */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand-emerald" />
                <span>{isAr ? 'تعديل الملف الشخصي والبيانات' : 'Edit Profile'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-brand-emerald shrink-0 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300">
                  {editForm.avatar ? (
                    <img src={editForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{editForm.name.charAt(0)}</span>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isAr ? 'رفع صورة شخصية جديدة' : 'Upload new photo'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400">JPG, PNG بحد أقصى 5MB (يتم ضغطها آلياً)</p>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                    required
                  />
                </div>
              </div>

              {/* Phone & Location */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'المدينة / المحافظة' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'النبذة التعريفية (Bio)' : 'Bio'}
                </label>
                <textarea
                  rows="2"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder={isAr ? 'نبذة مختصرة عنك وعن اهتماماتك المجتمعية...' : 'A brief description...'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-md shadow-brand-emerald/20 transition-all cursor-pointer"
                >
                  {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}