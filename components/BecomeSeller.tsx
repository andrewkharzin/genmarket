import React, { useState } from 'react';
import { Check, X, ArrowRight, Store, Zap, BarChart3, Globe, ArrowLeft, ShieldCheck } from 'lucide-react';

interface BecomeSellerProps {
  onBack: () => void;
  onComplete: () => void;
}

type PlanType = 'free' | 'base' | 'business' | 'custom';
type BillingCycle = 'monthly' | 'yearly';

export const BecomeSeller: React.FC<BecomeSellerProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'plans' | 'register'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: '',
    category: 'electronics'
  });

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: 0,
      description: 'Perfect for casual sellers decluttering their home.',
      features: ['3 Active Listings', 'Basic Support', 'Standard Visibility', '5% Transaction Fee'],
      notIncluded: ['Analytics', 'Verified Badge', 'API Access', 'Custom Branding'],
      color: 'bg-slate-100',
      btnColor: 'bg-slate-900 text-white hover:bg-slate-800'
    },
    {
      id: 'base',
      name: 'Pro Seller',
      price: billing === 'monthly' ? 990 : 790,
      description: 'For hobbyists turning passion into profit.',
      features: ['50 Active Listings', 'Priority Support', 'Boosted Visibility (2x)', '3% Transaction Fee', 'Basic Analytics'],
      notIncluded: ['Verified Badge', 'API Access', 'Custom Branding'],
      color: 'bg-blue-50 border-blue-200',
      btnColor: 'bg-brand-600 text-white hover:bg-brand-500'
    },
    {
      id: 'business',
      name: 'Business',
      price: billing === 'monthly' ? 2990 : 2490,
      isPopular: true,
      description: 'Power tools for high-volume shops.',
      features: ['Unlimited Listings', '24/7 Dedicated Support', 'Maximum Visibility (5x)', '1% Transaction Fee', 'Advanced Analytics', 'Verified Seller Badge', 'Bulk Upload Tools'],
      notIncluded: ['API Access'],
      color: 'bg-slate-900 text-white border-slate-900',
      btnColor: 'bg-gradient-to-r from-brand-500 to-purple-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/25'
    },
    {
      id: 'custom',
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large retailers.',
      features: ['Unlimited Everything', 'Dedicated Account Manager', 'Custom API Access', '0% Transaction Fee', 'White-label Storefront', 'Global CDNs'],
      notIncluded: [],
      color: 'bg-white border-slate-200',
      btnColor: 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId as PlanType);
    setStep('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (step === 'register') {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        <button 
          onClick={() => setStep('plans')}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Plans
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-bold mb-4">
              <Zap className="w-4 h-4" /> {plans.find(p => p.id === selectedPlan)?.name} Plan Selected
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Set up your store</h1>
            <p className="text-slate-600 text-lg mb-8">
              You're minutes away from reaching millions of buyers. Let's get your profile ready.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Secure Payments</h3>
                  <p className="text-sm text-slate-500">We handle all transaction processing and security.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Global Reach</h3>
                  <p className="text-sm text-slate-500">Your items are automatically translated for international buyers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Store Name</label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Urban Threads" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@company.com" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Category</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                  <option value="auto">Automotive</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all transform active:scale-95">
                  Create Store
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  By clicking Create Store, you agree to our Terms of Service.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero */}
      <div className="text-center mb-16 relative">
        <button 
          onClick={onBack}
          className="absolute left-0 top-0 hidden md:flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Start your business <br/> with <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600">MarketGenius</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Join 10,000+ sellers who trust our AI-powered platform to reach customers faster and smarter.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200">
          <button 
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billing === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBilling('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Yearly <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative p-8 rounded-3xl transition-all duration-300 flex flex-col h-full
              ${plan.isPopular ? 'scale-105 shadow-2xl shadow-purple-900/10 z-10 border-2 border-purple-500' : 'border border-slate-200 hover:shadow-xl bg-white'}
              ${plan.id === 'business' ? 'bg-slate-900 text-white' : ''}
            `}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className={`text-lg font-bold mb-2 ${plan.id === 'business' ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
              <p className={`text-sm leading-relaxed ${plan.id === 'business' ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                {typeof plan.price === 'number' ? (
                  <>
                     <span className={`text-4xl font-black ${plan.id === 'business' ? 'text-white' : 'text-slate-900'}`}>{plan.price}₽</span>
                     <span className={`text-sm font-medium ${plan.id === 'business' ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
                  </>
                ) : (
                  <span className="text-4xl font-black">{plan.price}</span>
                )}
              </div>
              {billing === 'yearly' && typeof plan.price === 'number' && (
                <div className="text-xs text-green-500 font-bold mt-1">
                  Billed {plan.price * 12 * 0.8}₽ yearly
                </div>
              )}
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className={`mt-0.5 rounded-full p-0.5 ${plan.id === 'business' ? 'bg-brand-500/20 text-brand-400' : 'bg-brand-50 text-brand-600'}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className={plan.id === 'business' ? 'text-slate-200' : 'text-slate-700'}>{feature}</span>
                </li>
              ))}
              {plan.notIncluded.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm opacity-50">
                   <div className="mt-0.5">
                     <X className="w-4 h-4" />
                   </div>
                   <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSelectPlan(plan.id)}
              className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${plan.btnColor}`}
            >
              {plan.price === 'Custom' ? 'Contact Sales' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className="mt-20 pt-16 border-t border-slate-200 text-center">
        <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Trusted by industry leaders</h4>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
           {/* Mock Logos */}
           <div className="h-8 font-black text-2xl">TECHSTORE</div>
           <div className="h-8 font-black text-2xl italic">Vintage.co</div>
           <div className="h-8 font-black text-2xl font-serif">LuxHome</div>
           <div className="h-8 font-black text-2xl">Auto<span className="text-slate-900">Motive</span></div>
        </div>
      </div>
    </div>
  );
};