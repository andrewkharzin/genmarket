import React, { useState } from 'react';
import { Item, Location, Profile } from '../types';
import { X, MapPin, Share2, Heart, Flag, ShieldCheck, MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

interface ItemDetailModalProps {
  item: Item;
  seller: Profile;
  location?: Location;
  isOpen: boolean;
  onClose: () => void;
  onSellerClick: (sellerId: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, seller, location, isOpen, onClose, onSellerClick }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen) return null;

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Price on request';
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
  };

  const currentPrice = item.discount_percent ? (item.price! * (1 - item.discount_percent/100)) : item.price;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const handleSellerClick = () => {
    onClose();
    onSellerClick(seller.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full text-white md:text-slate-500 md:bg-white/50 md:hover:bg-slate-200 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="w-full md:w-3/5 bg-black md:bg-slate-100 relative flex items-center justify-center h-[40vh] md:h-full group">
          <img 
            src={item.images[activeImageIndex]} 
            alt={item.title} 
            className="max-h-full max-w-full object-contain"
          />
          
          {item.images.length > 1 && (
            <>
              <button onClick={handlePrevImage} className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={handleNextImage} className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {item.images.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === activeImageIndex ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/5 flex flex-col h-full bg-white overflow-y-auto">
          <div className="p-6 md:p-8 flex-1">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>{item.views_count} views</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location?.city}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">{item.title}</h1>
            
            <div className="mb-6">
              <div className="text-3xl font-bold text-slate-900">{formatPrice(currentPrice)}</div>
              {item.discount_percent && item.discount_percent > 0 && (
                <div className="text-slate-500 line-through text-sm mt-1">{formatPrice(item.original_price || item.price)}</div>
              )}
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <button className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Show Phone Number
              </button>
              <button className="w-full py-3.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold rounded-xl transition-colors border border-brand-200 flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Start Chat
              </button>
            </div>

            <div className="mb-8 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200" onClick={handleSellerClick}>
              <h3 className="font-semibold text-lg mb-3">Seller</h3>
              <div className="flex items-center gap-4">
                <img src={seller.avatar_url} alt={seller.username} className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100" />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    {seller.full_name || seller.username}
                    {seller.is_verified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="text-yellow-500 font-bold">★ {seller.seller_rating}</span> 
                    <span>({seller.total_reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </div>
            </div>
            
            {item.attributes && (
               <div className="mb-8 p-4 bg-slate-50 rounded-xl">
                 <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider mb-3">Specifications</h3>
                 <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                   {Object.entries(item.attributes).map(([key, value]) => (
                     <div key={key} className="flex flex-col">
                       <span className="text-xs text-slate-400 capitalize">{key}</span>
                       <span className="text-sm font-medium text-slate-800">{value}</span>
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-sm bg-slate-50">
             <button className="flex items-center gap-2 hover:text-slate-800 transition-colors">
               <Heart className="w-4 h-4" /> Add to favorites
             </button>
             <button className="flex items-center gap-2 hover:text-slate-800 transition-colors">
               <Flag className="w-4 h-4" /> Report
             </button>
             <button className="flex items-center gap-2 hover:text-slate-800 transition-colors">
               <Share2 className="w-4 h-4" /> Share
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};