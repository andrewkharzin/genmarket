import React, { useState } from 'react';
import { Item, Story } from '../types';
import { ArrowLeft, Image as ImageIcon, UploadCloud, Link, Eye, X, CheckCircle2 } from 'lucide-react';

interface AddStoryFormProps {
  onBack: () => void;
  onPublish: (story: Omit<Story, 'id' | 'seller_id' | 'is_seen'>) => void;
  items: Item[]; // To link an item
}

export const AddStoryForm: React.FC<AddStoryFormProps> = ({ onBack, onPublish, items }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [duration, setDuration] = useState('24'); // hours

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock upload - in real app, this would be a file upload to storage
    // Here we just use a placeholder or read file as data URL if needed
    // For simplicity in this demo, let's use a random placeholder if empty or the file
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expiresAt = new Date(Date.now() + Number(duration) * 3600000).toISOString();
    onPublish({
      image_url: imageUrl || 'https://picsum.photos/seed/newstory/600/1000',
      title,
      description,
      item_id: selectedItemId || undefined,
      expires_at: expiresAt,
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Side */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
           <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white text-lg">+</div>
             Create New Story
           </h1>

           <form onSubmit={handleSubmit} className="space-y-6">
             
             {/* Image Upload Area */}
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Story Image</label>
               <div className="relative group">
                 <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleImageUpload}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 />
                 <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${imageUrl ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}`}>
                   {imageUrl ? (
                     <div className="relative w-full h-48 rounded-lg overflow-hidden">
                       <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-white font-medium flex items-center gap-2"><UploadCloud className="w-5 h-5" /> Change Image</span>
                       </div>
                     </div>
                   ) : (
                     <>
                       <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 group-hover:text-brand-500 group-hover:scale-110 transition-all">
                         <ImageIcon className="w-8 h-8" />
                       </div>
                       <p className="text-slate-600 font-medium">Click or drag image here</p>
                       <p className="text-xs text-slate-400 mt-2">Recommended size: 1080x1920 (9:16)</p>
                     </>
                   )}
                 </div>
               </div>
             </div>

             {/* Content Fields */}
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Headline</label>
               <input 
                 type="text" 
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="e.g., Flash Sale! 🔥"
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                 required
                 maxLength={40}
               />
               <div className="text-right text-xs text-slate-400 mt-1">{title.length}/40</div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
               <textarea 
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="Tell your audience what's happening..."
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all h-24 resize-none"
                 required
               />
             </div>

             {/* Link Item */}
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                 <Link className="w-4 h-4 text-slate-400" /> Link Item (Optional)
               </label>
               <select 
                 value={selectedItemId}
                 onChange={(e) => setSelectedItemId(e.target.value)}
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 transition-all"
               >
                 <option value="">No link</option>
                 {items.map(item => (
                   <option key={item.id} value={item.id}>{item.title} - {item.price} ₽</option>
                 ))}
               </select>
             </div>

             {/* Duration */}
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                <div className="flex gap-4">
                  {['12', '24', '48'].map(hrs => (
                    <label key={hrs} className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-all ${duration === hrs ? 'bg-brand-600 text-white border-brand-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <input type="radio" name="duration" value={hrs} className="hidden" checked={duration === hrs} onChange={(e) => setDuration(e.target.value)} />
                      <span className="font-bold">{hrs} Hours</span>
                    </label>
                  ))}
                </div>
             </div>

             <button 
               type="submit"
               className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               <CheckCircle2 className="w-5 h-5" /> Publish Story
             </button>

           </form>
        </div>

        {/* Preview Side */}
        <div className="hidden lg:flex flex-col items-center justify-center sticky top-24 self-start">
           <h3 className="text-slate-500 font-medium mb-4 flex items-center gap-2"><Eye className="w-4 h-4" /> Live Preview</h3>
           
           {/* Phone Container */}
           <div className="relative w-[320px] h-[640px] bg-slate-900 rounded-[3rem] shadow-2xl border-[8px] border-slate-800 overflow-hidden">
             
             {/* Notch */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-30"></div>

             {/* Content */}
             {imageUrl ? (
                <div 
                  className="w-full h-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                >
                   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
                   
                   {/* Mock Header */}
                   <div className="absolute top-8 left-4 right-4 flex items-center gap-2 z-20">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border border-white/50"></div>
                      <span className="text-white text-xs font-semibold">You</span>
                      <span className="text-white/60 text-xs">Just now</span>
                   </div>

                   {/* Mock Footer */}
                   <div className="absolute bottom-8 left-4 right-4 z-20 text-white">
                      <h4 className="font-bold text-lg mb-1">{title || 'Your Headline'}</h4>
                      <p className="text-sm opacity-90 line-clamp-3">{description || 'Your description will appear here...'}</p>
                      
                      {selectedItemId && (
                        <div className="mt-4 bg-white text-black py-2 rounded-lg text-center font-bold text-xs">
                          View Item
                        </div>
                      )}
                   </div>
                </div>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-600 flex-col gap-2 bg-slate-800">
                 <ImageIcon className="w-12 h-12 opacity-50" />
                 <span className="text-sm">Upload image to preview</span>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};