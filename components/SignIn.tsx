import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, Github, Chrome } from 'lucide-react';

interface SignInProps {
  onSignIn: (email?: string, password?: string) => void;
  onBack: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      onSignIn(email, password);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden relative">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-slate-900 transition-all shadow-sm hover:shadow-md"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-brand-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        
        {/* Floating Shapes */}
        <div className="relative z-10 w-full max-w-lg">
           <div className="absolute top-0 right-10 w-24 h-24 bg-gradient-to-br from-brand-400 to-purple-500 rounded-2xl rotate-12 animate-[float_6s_ease-in-out_infinite] shadow-2xl"></div>
           <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full animate-[float_8s_ease-in-out_infinite_reverse] shadow-xl"></div>
           
           <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Unlock your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-300">marketplace potential</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Manage inventory, track sales, and reach millions of customers with our AI-powered platform.
              </p>

              <div className="mt-8 flex items-center gap-4">
                 <div className="flex -space-x-3">
                    <img src="https://picsum.photos/seed/user1/100/100" className="w-10 h-10 rounded-full border-2 border-slate-800" alt="user" />
                    <img src="https://picsum.photos/seed/user2/100/100" className="w-10 h-10 rounded-full border-2 border-slate-800" alt="user" />
                    <img src="https://picsum.photos/seed/user3/100/100" className="w-10 h-10 rounded-full border-2 border-slate-800" alt="user" />
                    <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs text-white font-bold">+2k</div>
                 </div>
                 <div className="text-sm text-slate-400">Join our community today</div>
              </div>
           </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white/50 relative">
         <div className="max-w-md w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mb-10">
              <div className="w-12 h-12 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-brand-500/20">
                M
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
              <p className="text-slate-500">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <div className="relative">
                   <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                     placeholder="Enter your email"
                     required
                   />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                   <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                   <input 
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)} 
                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                     placeholder="••••••••"
                     required
                   />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  <span className="text-slate-600">Remember for 30 days</span>
                </label>
                <button type="button" className="text-brand-600 hover:text-brand-700 font-medium">Forgot password?</button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Or continue with</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700">
                <GoogleIcon className="w-5 h-5" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700">
                <Github className="w-5 h-5" /> GitHub
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account? <button className="text-brand-600 font-bold hover:underline">Sign up for free</button>
            </p>
         </div>
      </div>
    </div>
  );
};

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.449 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);