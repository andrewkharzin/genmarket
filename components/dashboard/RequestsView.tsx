import React from 'react';
import { BuyerRequest } from '../../types';
import { MessageCircle, Check, X, Phone } from 'lucide-react';

interface RequestsViewProps {
  requests: BuyerRequest[];
}

export const RequestsView: React.FC<RequestsViewProps> = ({ requests }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* List Column */}
      <div className="lg:col-span-2 space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {req.buyer_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{req.buyer_name}</h4>
                  <p className="text-xs text-slate-500">Interested in {req.item_title}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(req.status)}`}>
                {req.status}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-700 text-sm">
              "{req.message}"
            </div>

            {req.offer_price && (
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-green-600">
                <span>Offer Price: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(req.offer_price)}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
               <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="capitalize flex items-center gap-1">
                    {req.preferred_contact === 'phone' ? <Phone className="w-3 h-3"/> : <MessageCircle className="w-3 h-3"/>}
                    {req.preferred_contact}
                  </span>
                  <span>•</span>
                  <span>{new Date(req.created_at).toLocaleDateString()}</span>
               </div>
               
               {req.status === 'pending' && (
                 <div className="flex gap-2">
                   <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1">
                     <X className="w-3.5 h-3.5" /> Decline
                   </button>
                   <button className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition-colors flex items-center gap-1 shadow-sm shadow-brand-500/30">
                     <Check className="w-3.5 h-3.5" /> Accept
                   </button>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-900 mb-4">Lead Stats</h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-slate-600 text-sm">Pending</span>
               <span className="font-bold">{requests.filter(r => r.status === 'pending').length}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-slate-600 text-sm">Conversion Rate</span>
               <span className="font-bold text-green-600">12%</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-slate-600 text-sm">Total Leads</span>
               <span className="font-bold">{requests.length}</span>
             </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-brand-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
          <p className="text-sm opacity-90">
            Responding to leads within 5 minutes increases conversion chance by 400%.
          </p>
        </div>
      </div>
    </div>
  );
};