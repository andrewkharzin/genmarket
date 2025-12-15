import React from 'react';
import { Item, Location } from '../types';
import { ItemCard } from './ItemCard';
import { ArrowLeft, Heart, Search } from 'lucide-react';

interface FavoritesProps {
  items: Item[];
  locations: Location[];
  onBack: () => void;
  onItemClick: (item: Item) => void;
  onToggleFavorite: (e: React.MouseEvent, itemId: string) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ items, locations, onBack, onItemClick, onToggleFavorite }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Feed
        </button>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-full">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">My Favorites</h1>
        <span className="text-slate-400 text-lg font-medium">({items.length})</span>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              location={locations.find(l => l.id === item.location_id)}
              onClick={onItemClick}
              onToggleFavorite={onToggleFavorite}
              isFavorite={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
             <Heart className="w-10 h-10 text-slate-300" />
           </div>
           <h2 className="text-xl font-bold text-slate-900 mb-2">It's empty here</h2>
           <p className="text-slate-500 max-w-md mx-auto mb-8">
             You haven't saved any items yet. Click the heart icon on items you like to save them for later.
           </p>
           <button 
             onClick={onBack}
             className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-500 transition-colors inline-flex items-center gap-2"
           >
             <Search className="w-4 h-4" /> Browse Items
           </button>
        </div>
      )}
    </div>
  );
};