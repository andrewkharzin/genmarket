import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onViewCredentials?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewCredentials }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-900 to-brand-600">
                MarketGenius
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              The smartest way to buy and sell. Powered by AI, designed for humans.
            </p>
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-brand-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-600 transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-600">All Categories</a></li>
              <li><a href="#" className="hover:text-brand-600">Verified Sellers</a></li>
              <li><a href="#" className="hover:text-brand-600">Deals & Offers</a></li>
              <li><a href="#" className="hover:text-brand-600">Stores</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-600">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-600">Safety Rules</a></li>
              <li><a href="#" className="hover:text-brand-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-600">Privacy Policy</a></li>
              {onViewCredentials && (
                <li>
                  <button onClick={onViewCredentials} className="text-brand-600 font-bold hover:underline">
                    Test Credentials
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <span>123 Innovation Blvd, Tech City, 10101</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <span>support@marketgenius.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2024 MarketGenius Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};