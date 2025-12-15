import React from 'react';
import { ArrowLeft, Copy, Check, LogIn } from 'lucide-react';
import { MOCK_SELLERS } from '../constants';
import { Profile } from '../types';

interface CredentialsPageProps {
  onBack: () => void;
  onLogin: (user: Profile) => void;
}

export const CredentialsPage: React.FC<CredentialsPageProps> = ({ onBack, onLogin }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tiers = {
    free: { label: 'Free Tier', color: 'bg-slate-100 text-slate-700' },
    base: { label: 'Base Plan', color: 'bg-brand-100 text-brand-700' },
    business: { label: 'Business', color: 'bg-purple-100 text-purple-700' },
    custom: { label: 'Enterprise', color: 'bg-black text-white' },
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Feed
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Test Credentials</h1>
        <p className="text-slate-500 mt-2">Use these dummy accounts to test different subscription tiers and features.</p>
      </div>

      <div className="grid gap-6">
        {MOCK_SELLERS.filter(u => u.email).map((user, idx) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={user.avatar_url} alt={user.username} className="w-16 h-16 rounded-full object-cover border border-slate-100" />
                <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tiers[user.subscription_tier || 'free'].color}`}>
                  {user.subscription_tier}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user.username}</h3>
                <p className="text-sm text-slate-500">{user.full_name || 'Test User'}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group cursor-pointer" onClick={() => copyToClipboard(user.email!, idx * 10 + 1)}>
                <p className="text-xs text-slate-400 font-medium mb-1 uppercase">Email</p>
                <div className="font-mono text-sm text-slate-800">{user.email}</div>
                <div className="absolute top-3 right-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedIndex === idx * 10 + 1 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group cursor-pointer" onClick={() => copyToClipboard(user.password!, idx * 10 + 2)}>
                <p className="text-xs text-slate-400 font-medium mb-1 uppercase">Password</p>
                <div className="font-mono text-sm text-slate-800">{user.password}</div>
                <div className="absolute top-3 right-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedIndex === idx * 10 + 2 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>
            </div>

            <button 
              onClick={() => onLogin(user)}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors flex items-center gap-2 whitespace-nowrap active:scale-95 shadow-lg shadow-slate-900/10"
            >
              <LogIn className="w-4 h-4" /> Login as {user.username}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};