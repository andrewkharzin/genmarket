import React from 'react';
import { Item, Profile, Location } from '../types';
import { ItemCard } from './ItemCard';
import { ShieldCheck, Calendar, Star, MapPin, MessageCircle, ArrowLeft } from 'lucide-react';

interface SellerProfileProps {
  seller: Profile;
  items: Item[];
  locations: Location[];
  onBack: () => void;
  onItemClick: (item: Item) => void;
  onToggleFavorite: (e: React.MouseEvent, itemId: string) => void;
  favorites: Set<string>;
}

export const SellerProfile: React.FC<SellerProfileProps> = ({ 
  seller, items, locations, onBack, onItemClick, onToggleFavorite, favorites 
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Navigation */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Feed
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        {/* Cover Image */}
        <div className="h-48 bg-slate-200 relative">
          {seller.cover_url ? (
            <img src={seller.cover_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-brand-500 to-purple-600 opacity-80" />
          )}
        </div>

        <div className="px-6 pb-6 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-6 p-1.5 bg-white rounded-full">
            <img 
              src={seller.avatar_url} 
              alt={seller.username} 
              className="w-32 h-32 rounded-full object-cover border border-slate-100"
            />
          </div>

          {/* Stats & Actions */}
          <div className="pt-20 md:pt-4 md:pl-40 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                {seller.full_name || seller.username}
                {seller.is_verified && <ShieldCheck className="w-6 h-6 text-green-500" />}
              </h1>
              <p className="text-slate-500 mt-1">@{seller.username}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-bold text-slate-900">{seller.seller_rating}</span>
                  <span className="text-slate-400">({seller.total_reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Joined {new Date(seller.joined_at).getFullYear()}</span>
                </div>
              </div>

              {seller.about && (
                <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">{seller.about}</p>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 md:mt-0">
               <button className="flex-1 md:flex-none px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
                 <MessageCircle className="w-4 h-4" />
                 Chat
               </button>
               <button className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-medium transition-colors">
                 Subscribe
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        Active Listings <span className="text-slate-400 font-normal text-base">({items.length})</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            location={locations.find(l => l.id === item.location_id)}
            onClick={onItemClick}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.has(item.id)}
          />
        ))}
      </div>
    </div>
  );
};