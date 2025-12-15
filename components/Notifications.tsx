import React from 'react';
import { Notification } from '../types';
import { Bell, ShoppingBag, MessageCircle, Heart, Info, ArrowLeft } from 'lucide-react';

interface NotificationsProps {
  notifications: Notification[];
  onBack: () => void;
  onMarkAllRead: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onBack, onMarkAllRead }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_drop': return <ShoppingBag className="w-5 h-5 text-green-600" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'story_like': return <Heart className="w-5 h-5 text-red-600" />;
      case 'order_update': return <ShoppingBag className="w-5 h-5 text-purple-600" />;
      default: return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'price_drop': return 'bg-green-100';
      case 'message': return 'bg-blue-100';
      case 'story_like': return 'bg-red-100';
      case 'order_update': return 'bg-purple-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button 
          onClick={onMarkAllRead}
          className="text-sm text-brand-600 hover:underline font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Notifications 
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.is_read).length}
            </span>
          </h1>
          <Bell className="w-6 h-6 text-slate-400" />
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 hover:bg-slate-50 transition-colors flex gap-4 ${!notif.is_read ? 'bg-brand-50/40' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                  {notif.image_url ? (
                    <img src={notif.image_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getIcon(notif.type)
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold text-slate-900 ${!notif.is_read ? 'text-brand-900' : ''}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                       {/* Simplified relative time */}
                       {Math.floor((Date.now() - new Date(notif.created_at).getTime()) / 3600000)}h ago
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{notif.message}</p>
                </div>
                
                {!notif.is_read && (
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0"></div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};