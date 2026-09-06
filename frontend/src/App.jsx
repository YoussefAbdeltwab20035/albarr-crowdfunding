import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Home from './pages/Home';
import CampaignDetails from './pages/CampaignDetails';
import Checkout from './pages/Checkout';
import CreateCampaign from './pages/CreateCampaign';
import Profile from './pages/Profile';
import HowItWorks from './pages/HowItWorks';
import AdminDashboard from './pages/AdminDashboard';
import LiveDonationTicker from './components/LiveDonationTicker';

// استيراد دوال الـ API الحقيقية
import API, {
  fetchCampaigns,
  createCampaignAPI,
  createPledgeAPI,
  fetchTransactionsAPI,
  toggleVerifyCampaignAPI
} from './services/api';

export default function App() {
  const [lang, setLang] = useState('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // حالة البيانات المسترجعة من الـ Backend
  const [campaigns, setCampaigns] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. الوضع الليلي
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('albarr_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('albarr_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('albarr_theme', 'light');
      }
    } catch (err) {
      console.warn(err);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // 2. إدارة المستخدم الحالي والمصادقة
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('albarr_user');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn(err);
    }
    return {
      name: 'يوسف عبد التواب',
      email: 'admin@albarr.org',
      role: 'admin',
      verified: true
    };
  });

  // اشتقاق صلاحية الأدمن مباشرة بدون setState داخل useEffect
  const isAdmin = currentUser?.role === 'admin';

  // 3. جلب البيانات من MongoDB عبر الـ API عند أول تحميل
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [campaignsData, txnsData] = await Promise.all([
          fetchCampaigns().catch(() => []),
          fetchTransactionsAPI().catch(() => [])
        ]);

        if (isMounted) {
          const normalizedCampaigns = (Array.isArray(campaignsData) ? campaignsData : []).map((c) => ({
            ...c,
            id: c._id || c.id
          }));

          const normalizedTxns = (Array.isArray(txnsData) ? txnsData : []).map((t) => ({
            ...t,
            id: t._id || t.id
          }));

          setCampaigns(normalizedCampaigns);
          setTransactions(normalizedTxns);
          setIsLoadingData(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load initial data:', err);
          setIsLoadingData(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleUpdateProfile = (updatedData) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('albarr_user', JSON.stringify(updated));
      return updated;
    });
    showToast(lang === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Profile updated');
  };

  // 4. إنشاء حملة جديدة عبر الـ API
  const handleAddCampaign = async (newCamp) => {
    try {
      const payload = {
        ...newCamp,
        author: {
          ar: currentUser.name,
          en: currentUser.name,
          verified: currentUser.verified || false,
          email: currentUser.email
        }
      };

      const created = await createCampaignAPI(payload);
      const normalized = { ...created, id: created._id || created.id };

      setCampaigns((prev) => [normalized, ...prev]);
      showToast(lang === 'ar' ? 'تم نشر الحملة بنجاح' : 'Campaign created');
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? 'فشل إنشاء الحملة على السيرفر' : 'Failed to create campaign', 'error');
    }
  };

  // 5. تعديل بيانات حملة
  const handleUpdateCampaign = async (campaignId, updatedFields) => {
    try {
      const target = campaigns.find((c) => String(c.id) === String(campaignId));
      const res = await API.put(`/campaigns/${campaignId}`, {
        ...target,
        ...updatedFields
      });

      const updated = { ...res.data, id: res.data._id || res.data.id };
      setCampaigns((prev) => prev.map((c) => (String(c.id) === String(campaignId) ? updated : c)));
      showToast(lang === 'ar' ? 'تم تحديث بيانات الحملة' : 'Campaign updated');
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? 'فشل حفظ التعديلات' : 'Failed to update campaign', 'error');
    }
  };

  // 6. حذف حملة
  const handleDeleteCampaign = async (campaignId) => {
    try {
      await API.delete(`/campaigns/${campaignId}`);
      setCampaigns((prev) => prev.filter((c) => String(c.id) !== String(campaignId)));
      showToast(lang === 'ar' ? 'تم حذف الحملة بنجاح' : 'Campaign deleted', 'info');
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? 'فشل حذف الحملة من السيرفر' : 'Failed to delete campaign', 'error');
    }
  };

  // 7. توثيق واعتماد الحملة
  const handleToggleVerify = async (campaignId) => {
    try {
      const updated = await toggleVerifyCampaignAPI(campaignId);
      const normalized = { ...updated, id: updated._id || updated.id };
      setCampaigns((prev) => prev.map((c) => (String(c.id) === String(campaignId) ? normalized : c)));
      showToast(lang === 'ar' ? 'تم تحديث حالة التوثيق' : 'Verification status updated');
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? 'تعذر تحديث حالة التوثيق' : 'Failed to update verification', 'error');
    }
  };

  // 8. إتمام تبرع حقيقي وحفظه في MongoDB
  const handlePledge = async (campaignId, amount, method = 'InstaPay', cheerMessage = '', donorName = 'فاعل خير') => {
    try {
      const donationPayload = {
        campaignId,
        amount: Number(amount),
        donorName,
        donorEmail: currentUser.email,
        method,
        cheerMessage
      };

      const res = await createPledgeAPI(donationPayload);

      // تحديث مبالغ الحملة محلياً
      setCampaigns((prev) =>
        prev.map((camp) => {
          if (String(camp.id) === String(campaignId)) {
            return {
              ...camp,
              raised: Number(camp.raised) + Number(amount),
              backers: Number(camp.backers) + 1
            };
          }
          return camp;
        })
      );

      // إضافة الحركة المالية للسجل
      if (res.transaction) {
        setTransactions((prev) => [{ ...res.transaction, id: res.transaction._id || res.transaction.id }, ...prev]);
      }

      showToast(
        lang === 'ar'
          ? `شكراً لمساهمتك بمبلغ ${Number(amount).toLocaleString()} ج.م!`
          : `Thank you for pledging ${Number(amount).toLocaleString()} EGP!`
      );
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? 'فشلت عملية الدفع' : 'Pledge failed', 'error');
    }
  };

  const isAr = lang === 'ar';

  return (
    <div className={`min-h-screen flex flex-col ${isAr ? 'font-cairo' : 'font-inter'} pb-20 md:pb-0 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        campaigns={campaigns}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        currentUser={currentUser}
        isAdmin={isAdmin}
      />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home lang={lang} searchQuery={searchQuery} campaigns={campaigns} isLoadingData={isLoadingData} />} />
          <Route 
            path="/campaign/:id" 
            element={
              <CampaignDetails 
                lang={lang} 
                campaigns={campaigns} 
                transactions={transactions}
                onPledge={handlePledge} 
                onToast={showToast} 
              />
            } 
          />
          <Route 
            path="/checkout/:id" 
            element={<Checkout lang={lang} campaigns={campaigns} currentUser={currentUser} onPledge={handlePledge} onToast={showToast} />} 
          />
          <Route path="/create-campaign" element={<CreateCampaign lang={lang} onAddCampaign={handleAddCampaign} />} />
          <Route 
            path="/profile" 
            element={
              <Profile 
                lang={lang} 
                campaigns={campaigns} 
                transactions={transactions} 
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onDeleteCampaign={handleDeleteCampaign} 
                onUpdateCampaign={handleUpdateCampaign}
                onToast={showToast}
              />
            } 
          />
          <Route path="/how-it-works" element={<HowItWorks lang={lang} />} />
          <Route 
  path="/admin" 
  element={
            <AdminDashboard 
             lang={lang} 
             campaigns={campaigns} 
             transactions={transactions} 
             onDeleteCampaign={handleDeleteCampaign}
             onUpdateCampaign={handleUpdateCampaign}
             onToggleVerify={handleToggleVerify}
/>
  } 
/>
        </Routes>
      </main>

      <footer className="hidden md:block bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 {isAr ? 'عَ البَرّ. جميع الحقوق محفوظة.' : 'Al-Barr. All rights reserved.'}</p>
          <p className="font-medium">{isAr ? 'منصة تمويل جماعي موثوقة' : 'Trusted Crowdfunding Platform'}</p>
        </div>
      </footer>

      <BottomNav lang={lang} />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <LiveDonationTicker lang={lang} transactions={transactions} />
    </div>
  );
}