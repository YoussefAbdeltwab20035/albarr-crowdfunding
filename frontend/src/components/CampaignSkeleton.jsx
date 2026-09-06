export default function CampaignSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-0 overflow-hidden animate-pulse flex flex-col">
      {/* Skeleton Image */}
      <div className="aspect-[16/10] bg-slate-200" />

      {/* Skeleton Content */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="w-24 h-3.5 bg-slate-200 rounded-full" />
          <div className="w-4/5 h-5 bg-slate-200 rounded-lg" />
          <div className="w-full h-3 bg-slate-200 rounded-md" />
          <div className="w-2/3 h-3 bg-slate-200 rounded-md" />
        </div>

        {/* Skeleton Progress */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="w-full h-2 bg-slate-200 rounded-full" />
          <div className="flex justify-between items-center">
            <div className="w-16 h-4 bg-slate-200 rounded-md" />
            <div className="w-10 h-4 bg-slate-200 rounded-md" />
          </div>
          <div className="w-full h-10 bg-slate-100 rounded-2xl mt-2" />
        </div>
      </div>
    </div>
  );
}