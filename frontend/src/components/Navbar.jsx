import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Globe, Plus, HeartHandshake, X, ArrowUpRight, Sun, Moon, Shield } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80";

const getFieldText = (field, lang = 'ar') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.ar || field.en || '';
};

export default function Navbar({ 
  lang, 
  setLang, 
  searchQuery, 
  setSearchQuery, 
  campaigns = [],
  darkMode,
  toggleDarkMode,
  currentUser,
  isAdmin
}) {
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const location = useLocation();

  const [isFocused, setIsFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId) => {
    const scrollToTarget = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -85;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToTarget, 150);
    } else {
      scrollToTarget();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const query = (searchQuery || '').trim().toLowerCase();
  const suggestions = query
    ? (Array.isArray(campaigns) ? campaigns : [])
        .filter((c) => {
          const title = getFieldText(c.title, lang).toLowerCase();
          const author = getFieldText(c.author, lang).toLowerCase();
          const category = getFieldText(c.category, lang).toLowerCase();
          return title.includes(query) || author.includes(query) || category.includes(query);
        })
        .slice(0, 5)
    : [];

  const handleSelectSuggestion = (campaignId) => {
    setIsFocused(false);
    setMobileSearchOpen(false);
    navigate(`/campaign/${campaignId}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        
        {/* Logo */}
        <div 
          onClick={handleHomeClick} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-brand-emerald flex items-center justify-center text-white shadow-md shadow-brand-emerald/20 transition-transform active:scale-95">
            <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white block leading-none font-cairo">
              {isAr ? 'عَ البَرّ' : 'Al-Barr'}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide hidden xs:block">
              {isAr ? 'تمويل جماعي موثوق' : 'Crowdfunding, with trust'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button 
            type="button"
            onClick={handleHomeClick} 
            className="hover:text-brand-emerald dark:hover:text-brand-emerald transition-colors cursor-pointer"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <button 
            type="button"
            onClick={() => handleNavClick('explore')} 
            className="hover:text-brand-emerald dark:hover:text-brand-emerald transition-colors cursor-pointer"
          >
            {isAr ? 'استكشف' : 'Explore'}
          </button>
          <button 
            type="button"
            onClick={() => handleNavClick('categories')} 
            className="hover:text-brand-emerald dark:hover:text-brand-emerald transition-colors cursor-pointer"
          >
            {isAr ? 'التصنيفات' : 'Categories'}
          </button>
          <Link to="/how-it-works" className="hover:text-brand-emerald dark:hover:text-brand-emerald transition-colors">
            {isAr ? 'كيف يعمل' : 'How it works'}
          </Link>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Desktop Search */}
          <div ref={searchContainerRef} className="relative hidden xl:block w-64">
            <input
              type="text"
              value={searchQuery || ''}
              onFocus={() => setIsFocused(true)}
              onChange={handleSearchChange}
              placeholder={isAr ? 'ابحث عن مشاريع...' : 'Search campaigns...'}
              className="w-full bg-slate-100/80 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-full py-2 px-4 ps-10 pe-8 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-emerald focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-brand-emerald/10 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Desktop Suggestions */}
            {isFocused && query && (
              <div className="absolute top-full start-0 end-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                {suggestions.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {isAr ? 'المشاريع المقترحة' : 'Suggested Projects'}
                    </div>
                    {suggestions.map((c) => (
                      <div
                        key={c.id}
                        onMouseDown={() => handleSelectSuggestion(c.id)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                      >
                        <img 
                          src={c.image || FALLBACK_IMAGE} 
                          alt="" 
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-800" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-emerald truncate transition-colors">
                            {getFieldText(c.title, lang)}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {getFieldText(c.author, lang)} • {getFieldText(c.category, lang)}
                          </p>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-emerald transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    {isAr ? 'لا توجد مقترحات تطابق بحثك' : 'No suggestions found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Trigger Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="xl:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Admin Dashboard Link المباشر */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                location.pathname === '/admin'
                  ? 'bg-brand-emerald text-white border-brand-emerald shadow-sm'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-brand-emerald border-brand-emerald/30 hover:bg-brand-emerald hover:text-white'
              }`}
              title={isAr ? 'لوحة المشرف' : 'Admin Panel'}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAr ? 'لوحة المشرف' : 'Admin'}</span>
            </Link>
          )}

          {/* Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200/80 dark:border-slate-800 cursor-pointer"
            title={darkMode ? (isAr ? 'الوضع النهاري' : 'Light Mode') : (isAr ? 'الوضع الليلي' : 'Dark Mode')}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border border-slate-200/80 dark:border-slate-800 cursor-pointer font-mono"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{isAr ? 'EN' : 'ع'}</span>
          </button>

          {/* User Profile Avatar Link */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1 sm:ps-1 sm:pe-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title={isAr ? 'الملف الشخصي' : 'My Profile'}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-emerald text-white flex items-center justify-center text-xs font-black shrink-0">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser?.name?.charAt(0) || 'ي'}</span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
              {currentUser?.name}
            </span>
          </Link>

          {/* CTA Button */}
          <Link
            to="/create-campaign"
            className="hidden sm:flex items-center gap-1.5 bg-brand-emerald hover:bg-brand-emeraldDark text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-brand-emerald/15 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'ابدأ حملتك' : 'Start Campaign'}</span>
          </Link>
        </div>

      </div>

      {/* Mobile Search Drawer */}
      {mobileSearchOpen && (
        <div className="xl:hidden px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery || ''}
              onChange={handleSearchChange}
              placeholder={isAr ? 'ابحث عن مشروع أو مبادرة...' : 'Search campaigns...'}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 ps-9 pe-8 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-emerald"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-2.5 text-slate-400 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Suggestions Results */}
          {query && suggestions.length > 0 && (
            <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-56 overflow-y-auto">
              {suggestions.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectSuggestion(c.id)}
                  className="p-2.5 flex items-center gap-2.5 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer"
                >
                  <img src={c.image || FALLBACK_IMAGE} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{getFieldText(c.title, lang)}</p>
                    <p className="text-[10px] text-slate-400 truncate">{getFieldText(c.category, lang)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}