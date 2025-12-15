import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Story, Profile } from '../types';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// --- Types ---

interface StoriesRailProps {
  stories: Story[];
  sellers: Profile[];
  onOpenStory: (index: number) => void;
  onAddStory: () => void;
}

interface StoryViewerProps {
  stories: Story[];
  sellers: Profile[];
  initialIndex: number;
  onClose: () => void;
  onNavigateToItem: (itemId: string) => void;
  onNavigateToProfile: (sellerId: string) => void;
}

// --- Stories Rail Component ---

export const StoriesRail: React.FC<StoriesRailProps> = ({ stories, sellers, onOpenStory, onAddStory }) => {
  return (
    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* Create Story Button */}
      <div 
        onClick={onAddStory}
        className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
      >
        <div className="w-[72px] h-[72px] rounded-full p-[2px] border-2 border-slate-200 border-dashed group-hover:border-brand-500 transition-colors">
           <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-brand-600">
             <span className="text-2xl font-light">+</span>
           </div>
        </div>
        <span className="text-xs text-slate-600 font-medium">Add Story</span>
      </div>

      {stories.map((story, index) => {
        const seller = sellers.find(s => s.id === story.seller_id);
        const isSeen = story.is_seen;
        
        return (
          <div 
            key={story.id} 
            onClick={() => onOpenStory(index)}
            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
          >
            <div className={`
              w-[76px] h-[76px] rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105
              ${isSeen 
                ? 'bg-slate-200' 
                : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 animate-in spin-in-3'}
            `}>
              <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden relative">
                <img 
                  src={seller?.avatar_url} 
                  alt={seller?.username} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-slate-700 font-medium max-w-[76px] truncate">
              {seller?.username || 'User'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// --- Story Viewer Component ---

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, sellers, initialIndex, onClose, onNavigateToItem, onNavigateToProfile }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const STORY_DURATION = 5000; // 5 seconds per story

  const currentStory = stories[currentIndex];
  const currentSeller = sellers.find(s => s.id === currentStory.seller_id);

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    } else {
       // Loop back to start or stay? Usually stay or restart current.
       setProgress(0);
    }
  }, [currentIndex]);

  // Timer for auto-advance
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // Update every 50ms
    const step = 100 / (STORY_DURATION / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-200">
      {/* Close Button (Desktop) */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white hidden md:block"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Main Container - mimics phone size on desktop */}
      <div className="relative w-full h-full md:w-[400px] md:h-[80vh] md:rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${currentStory.image_url})` }}
        >
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>

        {/* Header: Progress & User Info */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex flex-col gap-3">
          
          {/* Progress Bars */}
          <div className="flex gap-1 h-1">
            {stories.map((story, idx) => (
              <div key={story.id} className="flex-1 bg-white/30 rounded-full h-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all ease-linear"
                  style={{ 
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center justify-between">
            <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => { onClose(); onNavigateToProfile(currentStory.seller_id); }}
            >
              <img 
                src={currentSeller?.avatar_url} 
                alt={currentSeller?.username} 
                className="w-10 h-10 rounded-full border border-white/50 group-hover:border-white transition-colors" 
              />
              <div>
                <p className="text-white font-semibold text-sm shadow-black drop-shadow-md group-hover:underline decoration-white/70">{currentSeller?.username}</p>
                <p className="text-white/70 text-xs">{new Date(currentStory.expires_at).getHours()}h ago</p>
              </div>
            </div>
            
            <button onClick={onClose} className="md:hidden text-white/80">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tap Navigation Zones */}
        <div className="absolute inset-0 flex z-10">
          <div 
            className="flex-1 h-full cursor-pointer" 
            onClick={goToPrev}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          ></div>
          <div 
            className="flex-1 h-full cursor-pointer" 
            onClick={goToNext}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          ></div>
        </div>

        {/* Footer: Caption & CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col gap-4">
           <div>
             <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{currentStory.title}</h3>
             <p className="text-white/90 text-sm leading-relaxed drop-shadow-md line-clamp-3">
               {currentStory.description}
             </p>
           </div>

           {currentStory.item_id && (
             <button 
               onClick={() => onNavigateToItem(currentStory.item_id!)}
               className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-lg active:scale-95"
             >
               View Item <ExternalLink className="w-4 h-4" />
             </button>
           )}
        </div>

      </div>

      {/* Desktop Navigation Arrows */}
      <button 
        onClick={goToPrev}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button 
        onClick={goToNext}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};