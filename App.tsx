import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, Sparkles, SlidersHorizontal, Map as MapIcon, 
  Grid2X2, Menu, Bell, User, PlusCircle, X, Heart
} from 'lucide-react';
import * as Icons from 'lucide-react'; // For dynamic category icons

// Local imports
import { MOCK_ITEMS, MOCK_CATEGORIES, MOCK_LOCATIONS, MOCK_SELLERS, MOCK_STORIES, MOCK_NOTIFICATIONS } from './constants';
import { Item, Category, SmartSearchFilters, FilterState, Story, Notification, Profile } from './types';
import { getSmartSearchFilters } from './services/geminiService';
import { ItemCard } from './components/ItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { StoriesRail, StoryViewer } from './components/Stories';
import { Filters } from './components/Filters';
import { SellerProfile } from './components/SellerProfile';
import { AddStoryForm } from './components/AddStoryForm';
import { AddItemForm } from './components/AddItemForm';
import { Favorites } from './components/Favorites';
import { Notifications } from './components/Notifications';
import { BecomeSeller } from './components/BecomeSeller';
import { Footer } from './components/Footer';
import { SignIn } from './components/SignIn';
import { Dashboard } from './components/Dashboard';
import { CredentialsPage } from './components/CredentialsPage';

// --- Helper Components ---

const CategoryPill: React.FC<{ 
  category: Category; 
  isActive: boolean; 
  onClick: (id: number) => void 
}> = ({ category, isActive, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[category.icon || 'Circle'];
  
  return (
    <button
      onClick={() => onClick(category.id)}
      className={`
        flex flex-col items-center justify-center gap-2 min-w-[80px] p-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-brand-600 text-white shadow-brand-500/30 shadow-lg scale-105' 
          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-brand-200'}
      `}
    >
      <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
        {IconComponent && <IconComponent className="w-6 h-6" />}
      </div>
      <span className="text-xs font-medium text-center leading-tight">{category.name}</span>
    </button>
  );
};

// --- Main App ---

export default function App() {
  // --- State ---
  
  // Navigation
  const [currentView, setCurrentView] = useState<'feed' | 'profile' | 'favorites' | 'notifications' | 'add-story' | 'add-item' | 'become-seller' | 'signin' | 'dashboard' | 'credentials'>('feed');
  const [activeSellerId, setActiveSellerId] = useState<string | null>(null);

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  // Filters
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    locationId: '',
    condition: [],
    verifiedOnly: false,
    sortBy: 'newest'
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Data
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // AI
  const [isSmartSearching, setIsSmartSearching] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // --- Filtering Logic ---
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Category
      if (activeCategoryId && item.category_id !== activeCategoryId) return false;

      // 2. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.description?.toLowerCase().includes(q)) return false;
      }

      // 3. Ultimate Filters
      if (filters.minPrice && (item.price || 0) < Number(filters.minPrice)) return false;
      if (filters.maxPrice && (item.price || 0) > Number(filters.maxPrice)) return false;
      if (filters.locationId && item.location_id !== filters.locationId) return false;
      if (filters.condition.length > 0 && !filters.condition.includes(item.condition)) return false;
      
      // Verified Seller Filter
      if (filters.verifiedOnly) {
         const seller = MOCK_SELLERS.find(s => s.id === item.seller_id);
         if (!seller?.is_verified) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc': return (a.price || 0) - (b.price || 0);
        case 'price_desc': return (b.price || 0) - (a.price || 0);
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });
  }, [items, activeCategoryId, searchQuery, filters]);

  // --- Handlers ---

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setAiTip(null); // Clear AI tip when user types manually
  };

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSmartSearching(true);
    setAiTip(null);
    
    // Simulate delay
    const startTime = Date.now();
    const smartFilters = await getSmartSearchFilters(searchQuery);
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < 800) await new Promise(r => setTimeout(r, 800 - elapsedTime));

    setIsSmartSearching(false);

    if (smartFilters) {
      const newFilters = { ...filters };
      const messages: string[] = [];

      if (smartFilters.categorySlug) {
        const cat = MOCK_CATEGORIES.find(c => c.slug === smartFilters.categorySlug);
        if (cat) {
            setActiveCategoryId(cat.id);
            messages.push(`Category: ${cat.name}`);
        }
      }
      if (smartFilters.minPrice) {
        newFilters.minPrice = smartFilters.minPrice.toString();
        messages.push(`Min: ${smartFilters.minPrice}`);
      }
      if (smartFilters.maxPrice) {
         newFilters.maxPrice = smartFilters.maxPrice.toString();
         messages.push(`Max: ${smartFilters.maxPrice}`);
      }
      if (smartFilters.sortBy) {
        newFilters.sortBy = smartFilters.sortBy;
      }
      
      setFilters(newFilters);

      if (messages.length > 0) {
        setAiTip(`✨ Applied filters: ${messages.join(', ')}`);
      } else {
        setAiTip("✨ Searching for keywords...");
      }
    }
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
        const newFavs = new Set(prev);
        if (newFavs.has(id)) newFavs.delete(id);
        else newFavs.add(id);
        return newFavs;
    });
  };
  
  const handleStoryNavigateToItem = (itemId: string) => {
    const item = MOCK_ITEMS.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setActiveStoryIndex(null); 
    }
  };

  const handleNavigateToProfile = (sellerId: string) => {
    setActiveSellerId(sellerId);
    setCurrentView('profile');
    setActiveStoryIndex(null);
  };

  const handleAddStory = (storyData: Omit<Story, 'id' | 'seller_id' | 'is_seen'>) => {
    const newStory: Story = {
      ...storyData,
      id: `story-${Date.now()}`,
      seller_id: currentUser?.id || 'user-1',
      is_seen: false,
    };
    setStories([newStory, ...stories]);
    setCurrentView('feed');
  };

  const handleAddItem = (itemData: Partial<Item>) => {
    // Generate new ID
    const newItem: Item = {
      id: `item-${Date.now()}`,
      title: itemData.title || 'Untitled',
      price: itemData.price || 0,
      description: itemData.description || '',
      images: itemData.images || [],
      location_id: itemData.location_id,
      category_id: itemData.category_id,
      condition: itemData.condition || 'used_good',
      status: 'public',
      created_at: new Date().toISOString(),
      views_count: 0,
      favorites_count: 0,
      is_verified: currentUser?.is_verified || false,
      seller_id: currentUser?.id || 'user-1',
      tags: [],
      quantity: itemData.quantity || 1,
      reserved_quantity: 0,
      sku: itemData.sku
    };

    setItems([newItem, ...items]);
    setCurrentView('dashboard');
    alert("Item listed successfully!");
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, is_read: true})));
  };

  const handleSignIn = (email?: string, password?: string) => {
    // If credentials are provided (from form), validate them
    if (email && password) {
      const user = MOCK_SELLERS.find(u => u.email === email && u.password === password);
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setCurrentView('dashboard');
      } else {
        alert("Invalid credentials! Try using the test credentials from the footer link.");
      }
    } else {
      // Direct login (e.g. from Credentials Page or after create store)
      setIsAuthenticated(true);
      setCurrentUser(MOCK_SELLERS[0]);
      setCurrentView('dashboard');
    }
  };
  
  const handleDirectLogin = (user: Profile) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('feed');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  // View Routing
  if (currentView === 'signin') {
    return <SignIn onSignIn={handleSignIn} onBack={() => setCurrentView('feed')} />;
  }

  if (currentView === 'credentials') {
    return <CredentialsPage onBack={() => setCurrentView('feed')} onLogin={handleDirectLogin} />;
  }

  if (currentView === 'dashboard' && currentUser) {
    return (
      <Dashboard 
        user={currentUser}
        items={items.filter(i => i.seller_id === currentUser.id)}
        locations={MOCK_LOCATIONS}
        onBack={() => setCurrentView('feed')}
        onAddItem={() => setCurrentView('add-item')}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      
      {/* --- Filter Drawer (Global) --- */}
      <Filters 
        filters={filters}
        locations={MOCK_LOCATIONS}
        onFilterChange={setFilters}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      {/* --- Navbar --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => {setActiveCategoryId(null); setSearchQuery(''); setCurrentView('feed');}}>
              <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-900 to-brand-600 hidden md:block">
                MarketGenius
              </span>
            </div>

            {/* Search Bar (Visible only in Feed/Profile) */}
            <div className={`flex-1 max-w-2xl relative group ${currentView !== 'feed' && currentView !== 'profile' ? 'invisible md:visible opacity-50 pointer-events-none' : ''}`}>
              <div className={`
                flex items-center bg-slate-100 hover:bg-slate-50 border transition-all duration-300 rounded-2xl overflow-hidden
                ${isSmartSearching ? 'border-purple-400 ring-2 ring-purple-100' : 'border-transparent focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10'}
              `}>
                <button 
                    onClick={() => {setActiveCategoryId(null); setCurrentView('feed');}}
                    className="hidden sm:flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border-r border-slate-200"
                >
                    All <span className="text-xs text-slate-400">▼</span>
                </button>
                <input
                  type="text"
                  placeholder="Search for anything..."
                  className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2.5 text-slate-900 placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
                />
                <button 
                  onClick={handleSmartSearch}
                  className="px-4 py-2 text-slate-400 hover:text-brand-600 transition-colors flex items-center gap-2"
                  title="AI Smart Search"
                >
                   {isSmartSearching ? (
                     <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     <Sparkles className={`w-5 h-5 ${searchQuery.length > 3 ? 'text-purple-500 animate-pulse' : ''}`} />
                   )}
                </button>
                <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              {/* AI Tip Popover */}
              {aiTip && (
                <div className="absolute top-full left-0 mt-2 w-full p-3 bg-white rounded-xl shadow-xl border border-purple-100 text-sm text-slate-700 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 z-20">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{aiTip}</span>
                    <button onClick={() => setAiTip(null)}><X className="w-4 h-4 text-slate-400" /></button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setCurrentView('become-seller')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-slate-900/10 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell</span>
              </button>
              
              <div className="flex items-center gap-1 text-slate-500">
                
                {/* Notifications */}
                <button 
                  onClick={() => setCurrentView('notifications')}
                  className={`p-2 hover:bg-slate-100 rounded-full transition-colors relative ${currentView === 'notifications' ? 'text-brand-600 bg-brand-50' : ''}`}
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  )}
                </button>
                
                {/* Favorites */}
                <button 
                  onClick={() => setCurrentView('favorites')}
                  className={`p-2 hover:bg-slate-100 rounded-full transition-colors ${currentView === 'favorites' ? 'text-red-500 bg-red-50' : ''}`}
                >
                  <Heart className="w-6 h-6" />
                </button>
                
                {/* User / Dashboard */}
                <button 
                  onClick={() => isAuthenticated ? setCurrentView('dashboard') : setCurrentView('signin')} 
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors ml-1"
                >
                  {isAuthenticated ? (
                     <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {currentUser?.username.charAt(0)}
                     </div>
                  ) : (
                     <User className="w-6 h-6" />
                  )}
                </button>
                
                {/* Mobile Menu */}
                <button 
                  onClick={() => setIsFiltersOpen(true)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-full"
                >
                    <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Layout --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW SWITCHER */}
        {currentView === 'become-seller' ? (
           <BecomeSeller 
             onBack={() => setCurrentView('feed')}
             onComplete={() => {
               handleSignIn(); // Auto login after creating store
               alert("Welcome to MarketGenius! Your store is ready.");
             }}
           />
        ) : currentView === 'add-story' ? (
          <AddStoryForm 
            onBack={() => setCurrentView('feed')}
            onPublish={handleAddStory}
            items={items.filter(i => i.seller_id === (currentUser?.id || 'user-1'))}
          />
        ) : currentView === 'add-item' ? (
          <AddItemForm 
            onBack={() => setCurrentView('dashboard')}
            onPublish={handleAddItem}
            categories={MOCK_CATEGORIES}
            locations={MOCK_LOCATIONS}
            userTier={currentUser?.subscription_tier || 'free'}
            currentCount={items.filter(i => i.seller_id === currentUser?.id).length}
          />
        ) : currentView === 'notifications' ? (
          <Notifications 
            notifications={notifications}
            onBack={() => setCurrentView('feed')}
            onMarkAllRead={handleMarkNotificationsRead}
          />
        ) : currentView === 'favorites' ? (
          <Favorites 
            items={items.filter(i => favorites.has(i.id))}
            locations={MOCK_LOCATIONS}
            onBack={() => setCurrentView('feed')}
            onItemClick={setSelectedItem}
            onToggleFavorite={toggleFavorite}
          />
        ) : currentView === 'profile' && activeSellerId ? (
          <SellerProfile 
            seller={MOCK_SELLERS.find(s => s.id === activeSellerId) || MOCK_SELLERS[0]}
            items={items.filter(i => i.seller_id === activeSellerId)}
            locations={MOCK_LOCATIONS}
            onBack={() => setCurrentView('feed')}
            onItemClick={setSelectedItem}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        ) : (
          /* --- FEED VIEW --- */
          <div className="w-full">
            
            {/* Stories Section */}
            <div className="mb-8">
              <StoriesRail 
                stories={stories} 
                sellers={MOCK_SELLERS} 
                onOpenStory={setActiveStoryIndex} 
                onAddStory={() => setCurrentView('add-story')}
              />
            </div>

            {/* Categories Nav */}
            <div className="mb-8 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 pb-2 w-max">
                <button 
                    onClick={() => setActiveCategoryId(null)}
                    className={`flex flex-col items-center justify-center gap-2 min-w-[80px] p-3 rounded-xl transition-all duration-200 ${!activeCategoryId ? 'bg-slate-900 text-white' : 'bg-white border'}`}
                >
                    <div className={`p-2 rounded-full ${!activeCategoryId ? 'bg-white/20' : 'bg-slate-100'}`}>
                        <Grid2X2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">All</span>
                </button>
                {MOCK_CATEGORIES.map(cat => (
                  <CategoryPill 
                    key={cat.id} 
                    category={cat} 
                    isActive={activeCategoryId === cat.id} 
                    onClick={setActiveCategoryId} 
                  />
                ))}
              </div>
            </div>

            {/* Feed Header & Controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {activeCategoryId ? MOCK_CATEGORIES.find(c => c.id === activeCategoryId)?.name : 'Fresh Recommendations'}
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Grid2X2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <MapIcon className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  onClick={() => setIsFiltersOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 text-slate-700 rounded-lg shadow-sm transition-all font-medium"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {/* Badge if filters active */}
                  {(filters.minPrice || filters.maxPrice || filters.locationId || filters.condition.length > 0 || filters.verifiedOnly) && (
                    <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Grid Feed */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      location={MOCK_LOCATIONS.find(l => l.id === item.location_id)}
                      onClick={setSelectedItem}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.has(item.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No items found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting your filters.</p>
                    <button 
                        onClick={() => {
                          setSearchQuery(''); 
                          setActiveCategoryId(null);
                          setFilters({
                            minPrice: '', maxPrice: '', locationId: '', condition: [], verifiedOnly: false, sortBy: 'newest'
                          });
                        }} 
                        className="mt-4 text-brand-600 font-medium hover:underline"
                    >
                        Clear all filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Map View */
              <div className="w-full h-[600px] bg-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden group border border-slate-300">
                <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center max-w-md relative z-10">
                    <MapIcon className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Map View</h3>
                    <p className="text-slate-600 mb-6">Interactive map visualization would be implemented here using Google Maps or Leaflet, displaying items based on their <code>location_id</code> coordinates.</p>
                    <button 
                      onClick={() => setViewMode('grid')}
                      className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors"
                    >
                      Back to List
                    </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- Detail Modal --- */}
      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem}
          seller={MOCK_SELLERS.find(s => s.id === selectedItem.seller_id) || MOCK_SELLERS[0]}
          location={MOCK_LOCATIONS.find(l => l.id === selectedItem.location_id)}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onSellerClick={handleNavigateToProfile}
        />
      )}

      {/* --- Story Viewer Overlay --- */}
      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={stories}
          sellers={MOCK_SELLERS}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onNavigateToItem={handleStoryNavigateToItem}
          onNavigateToProfile={handleNavigateToProfile}
        />
      )}

      {/* Footer */}
      {/* Fix: removed redundant checks for 'signin' and 'credentials' as they are handled by early returns, fixing TS error */}
      {(currentView !== 'dashboard') && (
        <Footer onViewCredentials={() => setCurrentView('credentials')} />
      )}
    </div>
  );
}