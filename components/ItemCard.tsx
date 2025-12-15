import React from 'react';
import { Item, Location } from '../types';
import { Heart, MapPin, BadgeCheck, Zap } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  location?: Location;
  onClick: (item: Item) => void;
  onToggleFavorite: (e: React.MouseEvent, itemId: string) => void;
  isFavorite: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, location, onClick, onToggleFavorite, isFavorite }) => {
  const formatPrice = (price: number | null) => {
    if (price === null) return 'Price on request';
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div 
      onClick={() => onClick(item)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 cursor-pointer overflow-hidden flex flex-col relative"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={item.images[0]} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.is_verified && (
            <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {item.discount_percent && item.discount_percent > 0 && (
            <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              -{item.discount_percent}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => onToggleFavorite(e, item.id)}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
            isFavorite 
              ? 'bg-white/90 text-red-500' 
              : 'bg-black/20 text-white hover:bg-white/90 hover:text-slate-900'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
            {item.title}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
             <span className="text-xl font-bold text-slate-900">
              {formatPrice(item.discount_percent ? (item.price! * (1 - item.discount_percent/100)) : item.price)}
            </span>
            {item.discount_percent && item.discount_percent > 0 && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(item.original_price || item.price)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
             <div className="flex items-center gap-1 truncate max-w-[70%]">
               <MapPin className="w-3 h-3 flex-shrink-0" />
               <span className="truncate">{location?.city || 'Russia'}</span>
             </div>
             <span className="flex-shrink-0">
               {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};