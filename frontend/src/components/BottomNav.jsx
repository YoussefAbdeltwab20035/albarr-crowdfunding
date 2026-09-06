import { useLocation, Link } from 'react-router-dom';
import { Home, Compass, Plus, User, HelpCircle } from 'lucide-react';

export default function BottomNav({ lang }) {
  const isAr = lang === 'ar';
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: isAr ? 'الرئيسية' : 'Home',
      icon: Home,
      path: '/'
    },
    {
      id: 'explore',
      label: isAr ? 'استكشف' : 'Explore',
      icon: Compass,
      path: '/#explore'
    },
    {
      id: 'create',
      label: isAr ? 'أطلق حملة' : 'Launch',
      icon: Plus,
      path: '/create-campaign',
      isAction: true
    },
    {
      id: 'how-it-works',
      label: isAr ? 'عن المنصة' : 'Guide',
      icon: HelpCircle,
      path: '/how-it-works'
    },
    {
      id: 'profile',
      label: isAr ? 'حسابي' : 'Profile',
      icon: User,
      path: '/profile'
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 start-0 end-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] transition-colors duration-200">
      <div className="grid grid-cols-5 items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isAction) {
            return (
              <div key={item.id} className="flex justify-center items-center -mt-6">
                <Link
                  to={item.path}
                  className="w-12 h-12 rounded-full bg-brand-emerald text-white flex items-center justify-center shadow-lg shadow-brand-emerald/30 active:scale-95 transition-transform"
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
                isActive
                  ? 'text-brand-emerald'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 start-1/2 -translate-x-1/2 w-1 h-1 bg-brand-emerald rounded-full" />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight truncate max-w-[55px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}