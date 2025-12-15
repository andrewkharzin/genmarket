import React, { useState } from 'react';
import { Profile } from '../../types';
import { 
  User, Shield, Bell, CreditCard, Save, 
  Mail, Smartphone, MapPin, Globe, Check 
} from 'lucide-react';

interface SettingsViewProps {
  user: Profile;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for form fields (initialized with user data)
  const [formData, setFormData] = useState({
    fullName: user.full_name || '',
    username: user.username,
    email: user.email || '',
    bio: user.about || '',
    location: 'Moscow, Russia',
    notifications: {
      email: true,
      push: true,
      marketing: false
    }
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
  ];

  const renderProfile = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img 
            src={user.avatar_url} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button className="absolute bottom-0 right-0 bg-brand-600 text-white p-1.5 rounded-full border-2 border-white hover:bg-brand-500 transition-colors shadow-sm">
            <User className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{user.username}</h3>
          <p className="text-slate-500 text-sm">{user.subscription_tier?.toUpperCase()} Member</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Website</label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="https://yourstore.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
          <textarea 
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all h-32 resize-none"
            placeholder="Tell us about your shop..."
          />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3">
         <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
         <div>
           <h4 className="font-bold text-orange-800">Two-Factor Authentication</h4>
           <p className="text-sm text-orange-700 mt-1">Add an extra layer of security to your account.</p>
           <button className="mt-2 text-sm font-bold text-orange-900 bg-orange-200 px-3 py-1 rounded-lg hover:bg-orange-300 transition-colors">Enable 2FA</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h3 className="font-bold text-slate-900 mb-4">Change Password</h3>
          <div className="space-y-4">
             <input type="password" placeholder="Current Password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
             <div className="grid grid-cols-2 gap-4">
               <input type="password" placeholder="New Password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
               <input type="password" placeholder="Confirm Password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {['Email Notifications', 'Push Notifications', 'Marketing Emails'].map((item, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-brand-200 transition-colors">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
               {idx === 0 ? <Mail className="w-5 h-5" /> : idx === 1 ? <Smartphone className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
             </div>
             <div>
               <h4 className="font-bold text-slate-900">{item}</h4>
               <p className="text-sm text-slate-500">Receive updates about your account activity.</p>
             </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={true} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Current Plan</p>
              <h3 className="text-2xl font-bold">{user.subscription_tier?.toUpperCase() || 'FREE'}</h3>
              <p className="text-slate-400 text-sm mt-2">Next billing date: <span className="text-white">Oct 24, 2024</span></p>
            </div>
            <button className="px-4 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors">
              Manage Subscription
            </button>
         </div>
       </div>

       <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-500 uppercase">Payment Methods</div>
         <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] text-white font-mono">VISA</div>
               <span className="font-medium text-slate-700">•••• •••• •••• 4242</span>
            </div>
            <button className="text-sm font-bold text-slate-400 hover:text-slate-900">Remove</button>
         </div>
         <div className="p-4 border-t border-slate-100">
           <button className="text-brand-600 font-bold text-sm hover:underline">+ Add Payment Method</button>
         </div>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-brand-600 shadow-sm border border-slate-100' 
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-brand-600' : 'text-slate-400'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 min-h-[600px] flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
             <h2 className="text-2xl font-bold text-slate-900">{tabs.find(t => t.id === activeTab)?.label} Settings</h2>
             {successMsg && (
               <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium animate-in fade-in">
                 <Check className="w-4 h-4" /> {successMsg}
               </div>
             )}
          </div>
          
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'billing' && renderBilling()}
        </div>

        {/* Footer Actions */}
        <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end gap-3">
          <button className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};