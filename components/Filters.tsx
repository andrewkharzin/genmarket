import React from 'react';
import { FilterState, Location } from '../types';
import { X, Check, MapPin, RotateCcw } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  locations: Location[];
  onFilterChange: (newFilters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ 
  filters, locations, onFilterChange, isOpen, onClose 
}) => {
  
  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const toggleCondition = (condition: string) => {
    const newConditions = filters.condition.includes(condition)
      ? filters.condition.filter(c => c !== condition)
      : [...filters.condition, condition];
    onFilterChange({ ...filters, condition: newConditions });
  };

  const resetFilters = () => {
    onFilterChange({
      minPrice: '',
      maxPrice: '',
      locationId: '',
      condition: [],
      verifiedOnly: false,
      sortBy: 'newest'
    });
  };

  const ConditionCheckbox = ({ label, value }: { label: string; value: string }) => (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.condition.includes(value) ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white group-hover:border-brand-400'}`}>
        {filters.condition.includes(value) && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      <input 
        type="checkbox" 
        className="hidden" 
        checked={filters.condition.includes(value)}
        onChange={() => toggleCondition(value)} 
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );

  return (
    <div className={`fixed inset-0 z-50 flex ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside className={`
        relative w-full max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h3 className="font-bold text-xl text-slate-900">Filters</h3>
            <p className="text-xs text-slate-500 mt-0.5">Refine your search</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          
          {/* Sort */}
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Sort By</label>
             <select 
               value={filters.sortBy}
               onChange={(e) => onFilterChange({...filters, sortBy: e.target.value as any})}
               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
             >
               <option value="newest">Newest First</option>
               <option value="price_asc">Price: Low to High</option>
               <option value="price_desc">Price: High to Low</option>
               <option value="relevance">Relevance</option>
             </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Price (RUB)</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder="From"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                />
              </div>
              <span className="text-slate-300 font-medium">–</span>
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder="To"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Location</label>
            <div className="relative">
              <select 
                value={filters.locationId}
                onChange={(e) => onFilterChange({...filters, locationId: e.target.value})}
                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 appearance-none transition-all"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.city}</option>
                ))}
              </select>
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="flex items-center justify-between cursor-pointer group select-none">
               <div className="flex flex-col">
                 <span className="text-sm font-semibold text-slate-900">Verified Sellers</span>
                 <span className="text-xs text-slate-500">Show only trusted accounts</span>
               </div>
               <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${filters.verifiedOnly ? 'bg-brand-600' : 'bg-slate-200'}`}>
                 <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ${filters.verifiedOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
               </div>
               <input 
                 type="checkbox" 
                 className="hidden" 
                 checked={filters.verifiedOnly}
                 onChange={(e) => onFilterChange({...filters, verifiedOnly: e.target.checked})}
               />
            </label>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Condition</label>
            <div className="space-y-3">
              <ConditionCheckbox label="New" value="new" />
              <ConditionCheckbox label="Used - Like New" value="used_good" />
              <ConditionCheckbox label="Used - Fair" value="used_fair" />
              <ConditionCheckbox label="Refurbished" value="refurbished" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex gap-3 flex-shrink-0">
          <button 
            onClick={resetFilters} 
            className="px-4 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-95"
          >
            Show Results
          </button>
        </div>
      </aside>
    </div>
  );
};