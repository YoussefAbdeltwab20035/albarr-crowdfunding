import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Users, ArrowUpRight } from 'lucide-react';

// المكون الهيكلي لمنع الـ Layout Shift أثناء التحميل
export function CampaignCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse flex flex-col">
      <div className="w-full aspect-[16/10] bg-slate-200" />
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-2.5 bg-slate-200 rounded-full w-full mt-4" />
        <div className="h-10 bg-slate-100 rounded-xl w-full mt-auto" />
      </div>
    </div>
  );
}

export default function CampaignCard({ campaign, lang }) {
  const isAr = lang === 'ar';
  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Thumbnail */}
      <Link to={`/campaign/${campaign.id}`} className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 block">
        <img
          src={campaign.image}
          alt={campaign.title[lang]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 start-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
            {campaign.category[lang]}
          </span>
          {campaign.isEndingSoon && (
            <span className="bg-brand-accent text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{isAr ? 'أوشكت على الانتهاء' : 'Ending soon'}</span>
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Creator Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
          <span>{isAr ? 'بواسطة' : 'by'}</span>
          <span className="font-bold text-slate-800">{campaign.author[lang]}</span>
          {campaign.author.verified && (
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
          )}
        </div>

        {/* Title & Description */}
        <Link to={`/campaign/${campaign.id}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-emerald transition-colors line-clamp-1 mb-2">
            {campaign.title[lang]}
          </h3>
        </Link>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-6 font-normal">
          {campaign.description[lang]}
        </p>

        {/* Progress Bar & Metrics */}
        <div className="mt-auto space-y-3">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 bg-brand-emerald"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 font-medium">EGP </span>
              <span className="text-sm font-extrabold text-slate-900">{campaign.raised.toLocaleString()}</span>
            </div>
            <span className="font-extrabold text-brand-emerald flex items-center">
              ~{percentage}%
            </span>
          </div>

          <div className="grid grid-cols-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span><strong>{campaign.backers.toLocaleString()}</strong> {isAr ? 'داعم' : 'backers'}</span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span><strong>{campaign.daysLeft}</strong> {isAr ? 'يوم متبقٍ' : 'days left'}</span>
            </div>
          </div>

          {/* Action Link to Details Page */}
          <Link 
            to={`/campaign/${campaign.id}`}
            className="w-full mt-2 bg-brand-emerald/10 hover:bg-brand-emerald hover:text-white text-brand-emerald py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            <span>{isAr ? 'ادعم هذا المشروع' : 'Back this project'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </article>
  );
}