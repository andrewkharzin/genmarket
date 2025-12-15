import React, { useEffect, useState } from 'react';
import { Item, Profile } from '../../types';
import { DollarSign, Package, Users, TrendingUp, Lock, Sparkles, Lightbulb } from 'lucide-react';
import { generateBusinessInsights } from '../../services/geminiService';

interface OverviewViewProps {
  user: Profile;
  items: Item[];
  isLocked: (tiers: string[]) => boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ user, items, isLocked }) => {
  const activeItems = items.filter(i => i.status === 'public');
  const totalValue = activeItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const totalViews = items.reduce((acc, item) => acc + (item.views_count || 0), 0);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoadingInsights(true);
      const tips = await generateBusinessInsights(items);
      setInsights(tips);
      setIsLoadingInsights(false);
    };

    if (items.length > 0) {
        fetchInsights();
    }
  }, [items]);

  const StatCard = ({ title, value, change, icon: Icon, locked }: any) => (
    <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group ${locked ? 'opacity-70' : ''}`}>
      {locked && (
        <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
             <Lock className="w-3 h-3" /> Upgrade to view
           </div>
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${locked ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
          <Icon className="w-6 h-6" />
        </div>
        {!locked && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
             {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-slate-900">{locked ? '—' : value}</div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
           title="Total Inventory Value" 
           value={new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(totalValue)} 
           change={12.5} 
           icon={DollarSign} 
         />
         <StatCard 
           title="Active Listings" 
           value={activeItems.length} 
           change={5.2} 
           icon={Package} 
         />
         <StatCard 
           title="Total Views" 
           value={totalViews} 
           change={-2.4} 
           icon={Users} 
           locked={isLocked(['base', 'business'])}
         />
         <StatCard 
           title="Sales Conversion" 
           value="3.2%" 
           change={0.8} 
           icon={TrendingUp} 
           locked={isLocked(['business'])}
         />
       </div>

       {/* AI Insights & Analytics */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* AI Card */}
         <div className="col-span-1 lg:col-span-3 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-indigo-900">Smart Business Assistant</h3>
                    <p className="text-xs text-indigo-600">AI-generated strategy based on your inventory</p>
                </div>
            </div>
            {isLoadingInsights ? (
                <div className="flex gap-2">
                    <div className="h-16 w-1/3 bg-white/50 animate-pulse rounded-xl"></div>
                    <div className="h-16 w-1/3 bg-white/50 animate-pulse rounded-xl"></div>
                    <div className="h-16 w-1/3 bg-white/50 animate-pulse rounded-xl"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {insights.map((tip, idx) => (
                        <div key={idx} className="bg-white/80 p-4 rounded-xl shadow-sm border border-indigo-50 flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700 font-medium">{tip}</p>
                        </div>
                    ))}
                    {insights.length === 0 && (
                        <p className="text-sm text-slate-500">Add items to generate insights.</p>
                    )}
                </div>
            )}
         </div>

         {/* Analytics Chart */}
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
           {isLocked(['base', 'business']) && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                <Lock className="w-8 h-8 text-slate-400 mb-2" />
                <h3 className="font-bold text-slate-900">Analytics Locked</h3>
                <p className="text-slate-500 text-sm mb-4">Upgrade to Pro Seller to see your revenue trends.</p>
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold">Upgrade Plan</button>
              </div>
           )}
           <h3 className="font-bold text-slate-900 mb-6">Revenue Analytics</h3>
           <div className="h-64 flex items-end justify-between gap-2">
              {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((h, i) => (
                <div key={i} className="w-full bg-brand-50 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-brand-500 rounded-t-lg transition-all duration-500 group-hover:bg-brand-400" 
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium">
             <span>Jan</span><span>Dec</span>
           </div>
         </div>

         {/* Categories */}
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="font-bold text-slate-900 mb-4">Top Selling Categories</h3>
           <div className="space-y-4">
             {[
               { name: 'Electronics', val: 45, color: 'bg-blue-500' },
               { name: 'Home & Garden', val: 30, color: 'bg-green-500' },
               { name: 'Fashion', val: 15, color: 'bg-purple-500' },
               { name: 'Other', val: 10, color: 'bg-slate-300' },
             ].map(cat => (
               <div key={cat.name}>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-600">{cat.name}</span>
                   <span className="font-bold text-slate-900">{cat.val}%</span>
                 </div>
                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.val}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
    </div>
  );
};
