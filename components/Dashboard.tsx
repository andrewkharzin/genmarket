import React, { useState } from 'react';
import { Profile, Item, Location } from '../types';
import { 
  LayoutDashboard, Package, ShoppingBag, BarChart3, Settings, 
  Plus, Bell, LogOut, Crown, Lock, Warehouse
} from 'lucide-react';
import { OverviewView } from './dashboard/OverviewView';
import { InventoryView } from './dashboard/InventoryView';
import { RequestsView } from './dashboard/RequestsView';
import { WarehouseView } from './dashboard/WarehouseView';
import { SettingsView } from './dashboard/SettingsView';
import { MOCK_REQUESTS, MOCK_WAREHOUSES } from '../constants'; // Importing mock data for new views

interface DashboardProps {
  user: Profile;
  items: Item[];
  locations: Location[];
  onBack: () => void;
  onAddItem: () => void;
  onSignOut: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, items, locations, onBack, onAddItem, onSignOut 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'requests' | 'warehouse' | 'settings'>('overview');

  const subscriptionName = {
    free: 'Starter Plan',
    base: 'Pro Seller',
    business: 'Business Elite',
    custom: 'Enterprise'
  }[user.subscription_tier || 'free'];

  // Helper to check if a feature is locked based on tier
  const isFeatureLocked = (requiredTier: string[]) => {
    const tiers = ['free', 'base', 'business', 'custom'];
    const currentLevel = tiers.indexOf(user.subscription_tier || 'free');
    const requiredLevel = Math.min(...requiredTier.map(t => tiers.indexOf(t)));
    return currentLevel < requiredLevel;
  };

  // Render the appropriate view component
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView user={user} items={items} isLocked={isFeatureLocked} />;
      case 'inventory':
        return <InventoryView items={items} />;
      case 'requests':
        return <RequestsView requests={MOCK_REQUESTS.filter(r => r.item_id /* In real app check seller matches */)} />;
      case 'warehouse':
        return <WarehouseView warehouses={MOCK_WAREHOUSES} />;
      case 'settings':
        return <SettingsView user={user} />;
      default:
        return <div>Module not found</div>;
    }
  };

  // Mock Request filtering for this specific user to simulate relevant data
  // In a real app, this would come from the API props
  const userRequests = MOCK_REQUESTS; // Using all mocks for demo purposes

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
             <span className="font-bold text-xl text-slate-900">Dashboard</span>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
           <button 
             onClick={() => setActiveTab('overview')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <LayoutDashboard className="w-5 h-5" /> Overview
           </button>

           <button 
             onClick={() => setActiveTab('inventory')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <Package className="w-5 h-5" /> Inventory
           </button>

           <button 
             onClick={() => setActiveTab('requests')}
             className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <div className="flex items-center gap-3">
               <ShoppingBag className="w-5 h-5" /> Orders & Leads
             </div>
             {userRequests.filter(r => r.status === 'pending').length > 0 && (
               <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                 {userRequests.filter(r => r.status === 'pending').length}
               </span>
             )}
           </button>

           <button 
             onClick={() => !isFeatureLocked(['custom']) && setActiveTab('warehouse')}
             className={`
               w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors
               ${activeTab === 'warehouse' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}
               ${isFeatureLocked(['custom']) ? 'opacity-60 cursor-not-allowed' : ''}
             `}
           >
             <div className="flex items-center gap-3">
               <Warehouse className="w-5 h-5" /> Warehouse
             </div>
             {isFeatureLocked(['custom']) && <Lock className="w-3.5 h-3.5" />}
           </button>

           <button 
             onClick={() => setActiveTab('settings')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <Settings className="w-5 h-5" /> Settings
           </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full blur-2xl opacity-20 -mr-10 -mt-10"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2">
                 <Crown className="w-4 h-4 text-yellow-400" />
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{subscriptionName}</span>
               </div>
               <p className="text-xs text-slate-400 mb-3">
                 {user.subscription_tier === 'custom' 
                   ? 'Enterprise Features Active' 
                   : 'Upgrade to unlock Warehouse Management.'}
               </p>
               {user.subscription_tier !== 'custom' && (
                 <button className="w-full py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors">
                   Upgrade Plan
                 </button>
               )}
             </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
               <img src={user.avatar_url} alt="Profile" className="w-8 h-8 rounded-full" />
               <div className="flex flex-col">
                 <span className="text-sm font-bold text-slate-900">{user.username}</span>
                 <span className="text-xs text-slate-500">Sign out</span>
               </div>
            </div>
            <button onClick={onSignOut} className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
           <div>
             <h1 className="text-2xl font-bold text-slate-900 capitalize">
               {activeTab === 'requests' ? 'Orders & Leads' : activeTab}
             </h1>
             <p className="text-slate-500 text-sm mt-1">Manage your store operations.</p>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Back to Site
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-brand-600 relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button onClick={onAddItem} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-500 shadow-lg shadow-brand-500/20 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Item
              </button>
           </div>
        </div>

        {/* Content Area */}
        {renderContent()}

      </main>
    </div>
  );
};