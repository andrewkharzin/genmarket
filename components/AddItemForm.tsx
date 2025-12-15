import React, { useState } from 'react';
import { Category, Item, Location } from '../types';
import { ArrowLeft, UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Package, Tag, MapPin, Layers, Sparkles, Loader2 } from 'lucide-react';
import { analyzeItemImage } from '../services/geminiService';

interface AddItemFormProps {
  onBack: () => void;
  onPublish: (item: Partial<Item>) => void;
  categories: Category[];
  locations: Location[];
  userTier: string;
  currentCount: number;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ 
  onBack, onPublish, categories, locations, userTier, currentCount 
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    condition: 'used_good',
    quantity: '1',
    sku: '',
    locationId: locations[0]?.id || ''
  });

  // Subscription Limits
  const LIMITS: Record<string, number> = {
    free: 5,
    base: 50,
    business: Infinity,
    custom: Infinity
  };

  const limit = LIMITS[userTier || 'free'];
  const isLimitReached = currentCount >= limit;
  const usagePercent = Math.min(100, (currentCount / limit) * 100);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAnalyzeImage = async () => {
    if (images.length === 0) {
      alert("Please upload an image first!");
      return;
    }
    
    setIsAnalyzing(true);
    const result = await analyzeItemImage(images[0]);
    setIsAnalyzing(false);

    if (result) {
      setFormData(prev => ({
        ...prev,
        title: result.title,
        description: result.description,
        price: result.price.toString(),
        condition: result.condition,
        categoryId: result.categoryId.toString()
      }));
    } else {
      alert("Could not analyze image. Please try again or fill manually.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) return;

    onPublish({
      title: formData.title,
      price: Number(formData.price),
      description: formData.description,
      category_id: Number(formData.categoryId),
      condition: formData.condition as Item['condition'],
      quantity: Number(formData.quantity),
      sku: formData.sku,
      location_id: formData.locationId,
      images: images.length > 0 ? images : ['https://picsum.photos/seed/newitem/800/600'],
      status: 'public',
      created_at: new Date().toISOString(),
    });
  };

  const planLabel = {
    free: 'Starter',
    base: 'Pro',
    business: 'Business',
    custom: 'Enterprise'
  }[userTier || 'free'];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium mb-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900">List New Item</h1>
        </div>

        {/* Plan Usage Indicator */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[280px]">
           <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
             <Package className="w-6 h-6 text-slate-600" />
           </div>
           <div className="flex-1">
             <div className="flex justify-between text-sm mb-1">
               <span className="font-bold text-slate-900">{planLabel} Plan</span>
               <span className={`${isLimitReached ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                 {currentCount} / {limit === Infinity ? '∞' : limit}
               </span>
             </div>
             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full ${isLimitReached ? 'bg-red-500' : 'bg-brand-500'}`} 
                 style={{ width: `${limit === Infinity ? 5 : usagePercent}%` }}
               ></div>
             </div>
           </div>
        </div>
      </div>

      {isLimitReached ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Item Limit Reached</h2>
          <p className="text-red-700 mb-6">
            You have reached the maximum number of active items for your <strong>{planLabel}</strong> plan.
            Upgrade to list more items and unlock advanced features.
          </p>
          <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
            Upgrade Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-slate-400" /> Basic Information
              </h3>

              {images.length > 0 && (
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={handleAnalyzeImage}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Auto-fill with AI</>
                    )}
                  </button>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Item Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sony Wireless Headphones"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Condition</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    >
                      <option value="new">New</option>
                      <option value="used_good">Used - Good</option>
                      <option value="used_fair">Used - Fair</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                   <textarea 
                     placeholder="Describe the condition, features, and reason for selling..."
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 h-32 resize-none transition-all"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     required
                   />
                </div>
              </div>
            </div>

            {/* Inventory & Pricing */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <Layers className="w-5 h-5 text-slate-400" /> Inventory & Pricing
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price (₽)</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                    <input 
                      type="number" 
                      placeholder="1"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">SKU (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ITEM-001"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    />
                  </div>
               </div>

               <div className="mt-4">
                 <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                   <MapPin className="w-4 h-4" /> Location
                 </label>
                 <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
                    value={formData.locationId}
                    onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                 >
                   {locations.map(loc => (
                     <option key={loc.id} value={loc.id}>{loc.city}, {loc.region}</option>
                   ))}
                 </select>
               </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Publish Item
            </button>

          </div>

          {/* Sidebar - Images */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <ImageIcon className="w-5 h-5 text-slate-400" /> Images
               </h3>
               
               <div className="space-y-4">
                 <div className="relative group">
                   <input 
                     type="file" 
                     accept="image/*" 
                     onChange={handleImageUpload}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   />
                   <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-brand-400 hover:bg-brand-50 transition-all">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 text-slate-400 group-hover:text-brand-500">
                         <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">Add Photos</span>
                   </div>
                 </div>

                 {/* Image Preview Grid */}
                 <div className="grid grid-cols-2 gap-2">
                   {images.map((img, idx) => (
                     <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-200 relative group">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                     </div>
                   ))}
                 </div>
                 
                 <p className="text-xs text-slate-400">
                   Add up to 8 photos. First photo will be the cover.
                   {images.length > 0 && <span className="block mt-2 text-brand-600 font-medium">✨ Tip: Use the 'Auto-fill' button to generate details from your photo!</span>}
                 </p>
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};