import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, TrendingUp, Users, Wallet, 
  FolderKanban, CheckCircle2, Trash2, Eye, 
  ArrowUpRight, Clock, Search, Edit3, X, AlertTriangle 
} from 'lucide-react';

export default function AdminDashboard({ 
  lang, 
  campaigns = [], 
  transactions = [], 
  onDeleteCampaign,
  onUpdateCampaign,
  onToggleVerify 
}) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchTerm, setSearchTerm] = useState('');

  // حالات نافذة تأكيد الحذف المخصصة (بدون رسالة المتصفح الافتراضية)
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, campaignId: null, title: '' });

  // حالات نافذة تعديل المشروع المباشر من الويب
  const [editModalState, setEditModalState] = useState({ isOpen: false, campaign: null });
  const [editForm, setEditForm] = useState({ title: '', category: '', goal: '', description: '', image: '' });

  const stats = useMemo(() => {
    const totalRaised = campaigns.reduce((acc, c) => acc + (Number(c.raised) || 0), 0);
    const totalGoal = campaigns.reduce((acc, c) => acc + (Number(c.goal) || 0), 0);
    const totalBackers = campaigns.reduce((acc, c) => acc + (Number(c.backers) || 0), 0);
    const totalTxnsAmount = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    return {
      totalRaised,
      totalGoal,
      totalBackers,
      totalTxnsAmount,
      activeCampaignsCount: campaigns.length,
      txnsCount: transactions.length
    };
  }, [campaigns, transactions]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const title = c.title?.[lang] || c.title?.ar || '';
      const author = c.author?.[lang] || c.author?.ar || '';
      return title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             author.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [campaigns, searchTerm, lang]);

  // فتح نافذة الحذف المخصصة
  const handleOpenDeleteModal = (camp) => {
    setDeleteModalState({
      isOpen: true,
      campaignId: camp.id,
      title: camp.title?.[lang] || camp.title?.ar || ''
    });
  };

  const handleConfirmDelete = () => {
    if (onDeleteCampaign && deleteModalState.campaignId) {
      onDeleteCampaign(deleteModalState.campaignId);
    }
    setDeleteModalState({ isOpen: false, campaignId: null, title: '' });
  };

  // فتح نافذة التعديل المباشر
  const handleOpenEditModal = (camp) => {
    setEditModalState({ isOpen: true, campaign: camp });
    setEditForm({
      title: camp.title?.[lang] || camp.title?.ar || '',
      category: camp.category?.[lang] || camp.category?.ar || 'مجتمعي',
      goal: String(camp.goal || ''),
      description: camp.description?.[lang] || camp.description?.ar || '',
      image: camp.image || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (onUpdateCampaign && editModalState.campaign) {
      onUpdateCampaign(editModalState.campaign.id, editForm);
    }
    setEditModalState({ isOpen: false, campaign: null });
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center sm:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'لوحة القيادة الإدارية والتحكم في المشاريع' : 'Admin Management & Control'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {isAr ? 'مركز إدارة وتعديل منصة عَ البَرّ' : 'Al-Barr Command Center'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {isAr 
                ? 'تعديل وحذف المشاريع مباشرة من الواجهة، وتحديث الأهداف المالية والإشراف على التوثيق.' 
                : 'Edit & delete campaigns directly from the web, update funding targets, and verify projects.'}
            </p>
          </div>

          <Link
            to="/create-campaign"
            className="px-5 py-3 rounded-2xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-lg shadow-brand-emerald/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>{isAr ? 'إطلاق حملة رسمية' : 'New Campaign'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">{isAr ? 'إجمالي السيولة المحصلة' : 'Total Raised'}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalRaised.toLocaleString()} <span className="text-xs font-bold text-brand-emerald">EGP</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">{isAr ? 'إجمالي المعاملات' : 'Donations'}</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.txnsCount}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">{isAr ? 'الحملات القائمة' : 'Active Projects'}</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.activeCampaignsCount}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">{isAr ? 'الداعمون' : 'Backers'}</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalBackers}
            </div>
          </div>
        </div>

        {/* Section Tabs & Search */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('campaigns')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'campaigns'
                    ? 'bg-brand-emerald text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>{isAr ? 'إدارة وتعديل الحملات' : 'Manage & Edit Campaigns'}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
                  {campaigns.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'transactions'
                    ? 'bg-brand-emerald text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>{isAr ? 'سجل التدفقات المالية' : 'Financial Ledger'}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">
                  {transactions.length}
                </span>
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? 'بحث في الحملات...' : 'Search campaigns...'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 ps-9 pe-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Campaigns Table */}
        {activeTab === 'campaigns' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="py-4 px-6 text-start">{isAr ? 'الحملة' : 'Campaign'}</th>
                    <th className="py-4 px-4 text-start">{isAr ? 'صاحب المشروع' : 'Owner'}</th>
                    <th className="py-4 px-4 text-start">{isAr ? 'المحصل / الهدف' : 'Progress'}</th>
                    <th className="py-4 px-4 text-start">{isAr ? 'الداعمون' : 'Backers'}</th>
                    <th className="py-4 px-4 text-center">{isAr ? 'حالة التوثيق' : 'Status'}</th>
                    <th className="py-4 px-6 text-end">{isAr ? 'التحكم الإداري' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCampaigns.map((camp) => {
                    const percentage = Math.min(Math.round(((camp.raised || 0) / camp.goal) * 100), 100);
                    const isVerified = camp.author?.verified;

                    return (
                      <tr key={camp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img 
                              src={camp.image} 
                              alt="" 
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                            />
                            <div className="min-w-0 max-w-xs">
                              <span className="text-[10px] font-bold text-brand-emerald block">
                                {camp.category?.[lang] || camp.category?.ar}
                              </span>
                              <h4 className="font-black text-slate-900 dark:text-white truncate">
                                {camp.title?.[lang] || camp.title?.ar}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {camp.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {camp.author?.[lang] || camp.author?.ar || (isAr ? 'صاحب الحملة' : 'Owner')}
                          </span>
                          <span className="text-[10px] text-slate-400">{camp.creatorEmail || 'verified@albarr.org'}</span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-1 w-36">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-brand-emerald">{Number(camp.raised).toLocaleString()}</span>
                              <span className="text-slate-400 font-normal">%{percentage}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              {isAr ? 'الهدف:' : 'Goal:'} {Number(camp.goal).toLocaleString()} EGP
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                          {camp.backers} {isAr ? 'داعم' : ''}
                        </td>

                        <td className="py-4 px-4 text-center">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-brand-200/60 dark:border-emerald-800 text-brand-emerald text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{isAr ? 'موثقة' : 'Verified'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                              <Clock className="w-3 h-3" />
                              <span>{isAr ? 'قيد المراجعة' : 'Pending'}</span>
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* زر تعديل الحملة المباشر من الويب */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(camp)}
                              className="p-2 rounded-xl border border-blue-200 dark:border-blue-900/50 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                              title={isAr ? 'تعديل بيانات المشروع' : 'Edit Campaign'}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* زر التوثيق */}
                            <button
                              type="button"
                              onClick={() => onToggleVerify && onToggleVerify(camp.id)}
                              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                isVerified
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                  : 'border-emerald-200 text-brand-emerald hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                              }`}
                              title={isVerified ? (isAr ? 'إلغاء التوثيق' : 'Unverify') : (isAr ? 'توثيق الحملة' : 'Verify')}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>

                            {/* رابط المعاينة */}
                            <Link
                              to={`/campaign/${camp.id}`}
                              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                              title={isAr ? 'عرض الحملة' : 'View'}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* زر الحذف بنافذة التأكيد المخصصة */}
                            <button
                              type="button"
                              onClick={() => handleOpenDeleteModal(camp)}
                              className="p-2 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 transition-colors cursor-pointer"
                              title={isAr ? 'حذف الحملة' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Transactions Table */}
        {activeTab === 'transactions' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="py-4 px-6 text-start">{isAr ? 'رقم الإيصال' : 'TXN ID'}</th>
                    <th className="py-4 px-4 text-start">{isAr ? 'الحملة' : 'Campaign'}</th>
                    <th className="py-4 px-4 text-start">{isAr ? 'المساهم' : 'Donor'}</th>
                    <th className="py-4 px-4 text-start">{isAr ? 'المبلغ' : 'Amount'}</th>
                    <th className="py-4 px-4 text-start">{isAr ? 'البوابة' : 'Method'}</th>
                    <th className="py-4 px-6 text-end">{isAr ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((txn, index) => (
                    <tr key={txn.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-800 dark:text-slate-200">{txn.id}</td>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">{txn.campaignTitle}</td>
                      <td className="py-4 px-4 font-medium">{txn.donorName || (isAr ? 'فاعل خير' : 'Anonymous')}</td>
                      <td className="py-4 px-4 font-black text-brand-emerald">+{Number(txn.amount).toLocaleString()} EGP</td>
                      <td className="py-4 px-4 font-bold text-slate-600 dark:text-slate-300">{txn.method || 'InstaPay'}</td>
                      <td className="py-4 px-6 text-end">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'معتمد' : 'Audited'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* 1. نافذة تأكيد الحذف المخصصة (Custom Confirmation Modal) */}
      {deleteModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto ring-8 ring-red-50/50 dark:ring-red-950/20">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {isAr ? 'تأكيد حذف المشروع نهائياً' : 'Confirm Permanent Deletion'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isAr 
                  ? `هل أنت متأكد من رغبتك في حذف الحملة: «${deleteModalState.title}»؟ لن يمكن التراجع عن هذا الإجراء.` 
                  : `Are you sure you want to delete "${deleteModalState.title}"? This action cannot be undone.`}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalState({ isOpen: false, campaignId: null, title: '' })}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isAr ? 'تراجع / إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/25 transition-all active:scale-95 cursor-pointer"
              >
                {isAr ? 'نعم، احذف المشروع' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. نافذة تعديل بيانات المشروع من الويب (Custom Edit Campaign Modal) */}
      {editModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-brand-emerald" />
                <span>{isAr ? 'تعديل بيانات الحملة مباشرة' : 'Edit Campaign Details'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalState({ isOpen: false, campaign: null })}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-start">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'عنوان المشروع' : 'Campaign Title'}
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? 'الهدف المالي (EGP)' : 'Goal (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={editForm.goal}
                    onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'رابط صورة المشروع' : 'Image URL'}
                </label>
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isAr ? 'وصف وقصة المشروع' : 'Description'}
                </label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-emerald"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalState({ isOpen: false, campaign: null })}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emeraldDark text-white text-xs font-bold shadow-md shadow-brand-emerald/20 transition-all cursor-pointer"
                >
                  {isAr ? 'حفظ التعديلات في الموقع' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}