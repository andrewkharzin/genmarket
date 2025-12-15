
import { Category, Item, Location, Profile, Story, Notification, BuyerRequest, Warehouse, ItemBatch, InventoryMovement, StockAudit } from './types';
import { 
  Car, Smartphone, Sofa, Shirt, Wrench,  
  Gamepad2, Laptop, Dog, Bike, Home
} from 'lucide-react';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Real Estate', slug: 'real-estate', icon: 'Home' },
  { id: 2, name: 'Vehicles', slug: 'vehicles', icon: 'Car' },
  { id: 3, name: 'Electronics', slug: 'electronics', icon: 'Smartphone' },
  { id: 4, name: 'Home & Garden', slug: 'home-garden', icon: 'Sofa' },
  { id: 5, name: 'Fashion', slug: 'fashion', icon: 'Shirt' },
  { id: 6, name: 'Services', slug: 'services', icon: 'Wrench' },
  { id: 7, name: 'Hobbies & Leisure', slug: 'hobbies', icon: 'Gamepad2' },
  { id: 8, name: 'Pets', slug: 'pets', icon: 'Dog' },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-1', city: 'Moscow', region: 'Moscow', latitude: 55.7558, longitude: 37.6173 },
  { id: 'loc-2', city: 'Saint Petersburg', region: 'Leningrad Oblast', latitude: 59.9343, longitude: 30.3351 },
  { id: 'loc-3', city: 'Novosibirsk', region: 'Novosibirsk Oblast', latitude: 55.0084, longitude: 82.9357 },
  { id: 'loc-4', city: 'Kazan', region: 'Tatarstan', latitude: 55.7887, longitude: 49.1221 },
  { id: 'loc-5', city: 'Yekaterinburg', region: 'Sverdlovsk', latitude: 56.8389, longitude: 60.6057 },
  { id: 'loc-6', city: 'Sochi', region: 'Krasnodar Krai', latitude: 43.6028, longitude: 39.7342 },
];

export const MOCK_SELLERS: Profile[] = [
  {
    id: 'user-1',
    username: 'TechGiant',
    full_name: 'Alex Tech',
    avatar_url: 'https://picsum.photos/seed/user1/200/200',
    cover_url: 'https://picsum.photos/seed/techcover/1200/400',
    seller_rating: 4.8,
    total_reviews: 154,
    is_verified: true,
    joined_at: '2022-01-15T10:00:00Z',
    about: 'We sell the latest gadgets and electronics. Verified reseller since 2022.',
    subscription_tier: 'business',
    email: 'business@example.com',
    password: 'password123'
  },
  {
    id: 'user-2',
    username: 'VintageFinds',
    full_name: 'Sarah Connor',
    avatar_url: 'https://picsum.photos/seed/user2/200/200',
    cover_url: 'https://picsum.photos/seed/retrocover/1200/400',
    seller_rating: 4.9,
    total_reviews: 42,
    is_verified: true,
    joined_at: '2023-05-20T10:00:00Z',
    about: 'Curating the best vintage furniture and clothing from around the world.',
    subscription_tier: 'base',
    email: 'base@example.com',
    password: 'password123'
  },
  {
    id: 'user-3',
    username: 'AutoDealer_77',
    avatar_url: 'https://picsum.photos/seed/user3/200/200',
    seller_rating: 4.2,
    total_reviews: 12,
    is_verified: false,
    joined_at: '2023-11-01T10:00:00Z',
    about: 'Best deals on used cars in Moscow.',
    subscription_tier: 'free',
    email: 'free@example.com',
    password: 'password123'
  },
  {
    id: 'user-4',
    username: 'GamerPro',
    full_name: 'Dmitry K',
    avatar_url: 'https://picsum.photos/seed/user4/200/200',
    seller_rating: 5.0,
    total_reviews: 8,
    is_verified: true,
    joined_at: '2024-01-10T10:00:00Z',
    subscription_tier: 'free',
    email: 'gamer@example.com',
    password: 'password123'
  },
  {
    id: 'user-5',
    username: 'EnterpriseCorp',
    full_name: 'Global Enterprise',
    avatar_url: 'https://picsum.photos/seed/user5/200/200',
    cover_url: 'https://picsum.photos/seed/entcover/1200/400',
    seller_rating: 5.0,
    total_reviews: 500,
    is_verified: true,
    joined_at: '2021-01-01T10:00:00Z',
    about: 'Global enterprise solutions and wholesale.',
    subscription_tier: 'custom',
    email: 'custom@example.com',
    password: 'password123'
  }
];

export const MOCK_ITEMS: Item[] = [
  // Existing Items
  {
    id: 'item-1',
    title: 'iPhone 15 Pro Max - 256GB Natural Titanium',
    price: 110000,
    original_price: 125000,
    discount_percent: 12,
    description: 'Brand new, sealed box. Unlocked for all carriers. Warranty included. Receipt available upon request.',
    images: ['https://picsum.photos/seed/iphone/800/600', 'https://picsum.photos/seed/iphone2/800/600'],
    location_id: 'loc-1',
    category_id: 3,
    condition: 'new',
    status: 'public',
    created_at: new Date().toISOString(),
    views_count: 1240,
    favorites_count: 56,
    is_verified: true,
    seller_id: 'user-1',
    tags: ['apple', 'iphone', 'mobile'],
    attributes: { storage: '256GB', color: 'Natural Titanium' },
    quantity: 10,
    reserved_quantity: 2,
    sku: 'IP15PM-256-NT'
  },
  {
    id: 'item-2',
    title: 'BMW 3 Series, 2019',
    price: 2500000,
    description: 'Excellent condition, one owner. 45,000 km mileage. Regular maintenance at official dealer. Winter tires included.',
    images: ['https://picsum.photos/seed/bmw/800/600', 'https://picsum.photos/seed/bmw2/800/600'],
    location_id: 'loc-1',
    category_id: 2,
    condition: 'used_good',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    views_count: 5302,
    favorites_count: 210,
    is_verified: true,
    seller_id: 'user-3',
    tags: ['car', 'bmw', 'sedan'],
    attributes: { year: 2019, mileage: 45000, transmission: 'Automatic' },
    quantity: 1,
    reserved_quantity: 0
  },
  {
    id: 'item-3',
    title: 'Vintage Leather Sofa',
    price: 45000,
    original_price: 60000,
    discount_percent: 25,
    description: 'Chesterfield style leather sofa. Genuine leather. Adds character to any living room. Pickup only.',
    images: ['https://picsum.photos/seed/sofa/800/600'],
    location_id: 'loc-2',
    category_id: 4,
    condition: 'used_good',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    views_count: 340,
    favorites_count: 45,
    is_verified: false,
    seller_id: 'user-2',
    tags: ['furniture', 'sofa', 'vintage'],
    quantity: 1,
    reserved_quantity: 0
  },
  {
    id: 'item-4',
    title: 'Professional Plumbing Services',
    price: 2500,
    description: 'Licensed plumber with 10 years experience. Leak repair, pipe installation, bathroom renovation. 24/7 emergency service.',
    images: ['https://picsum.photos/seed/plumber/800/600'],
    location_id: 'loc-3',
    category_id: 6,
    condition: 'new',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    views_count: 89,
    favorites_count: 12,
    is_verified: true,
    seller_id: 'user-1',
    tags: ['service', 'plumbing', 'repair'],
    quantity: 999,
    reserved_quantity: 0
  },
  {
    id: 'item-5',
    title: 'Gaming Laptop ASUS ROG',
    price: 85000,
    description: 'RTX 3060, Ryzen 7, 16GB RAM. Used for 6 months, perfect condition. Box and charger included.',
    images: ['https://picsum.photos/seed/laptop/800/600'],
    location_id: 'loc-2',
    category_id: 3,
    condition: 'used_good',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    views_count: 450,
    favorites_count: 34,
    is_verified: true,
    seller_id: 'user-2',
    tags: ['laptop', 'gaming', 'asus'],
    quantity: 0,
    reserved_quantity: 0
  },
  {
    id: 'item-6',
    title: 'Mountain Bike Merida',
    price: 32000,
    description: 'Hardtail, hydraulic brakes, 29 inch wheels. Size L. Needs minor derailleur adjustment.',
    images: ['https://picsum.photos/seed/bike/800/600'],
    location_id: 'loc-1',
    category_id: 7,
    condition: 'used_fair',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    views_count: 120,
    favorites_count: 8,
    is_verified: false,
    seller_id: 'user-2',
    tags: ['bike', 'sport', 'outdoor'],
    quantity: 1,
    reserved_quantity: 0
  },
  // New Items
  {
    id: 'item-7',
    title: 'PlayStation 5 Slim',
    price: 48000,
    description: 'Digital edition. Comes with two controllers and FC24.',
    images: ['https://picsum.photos/seed/ps5/800/600'],
    location_id: 'loc-4',
    category_id: 7,
    condition: 'used_good',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    views_count: 220,
    favorites_count: 45,
    is_verified: true,
    seller_id: 'user-4',
    tags: ['gaming', 'ps5', 'console'],
    quantity: 3,
    reserved_quantity: 1
  },
  {
    id: 'item-8',
    title: 'Zara Winter Coat',
    price: 4500,
    description: 'Size M. Worn once. Very warm and stylish.',
    images: ['https://picsum.photos/seed/coat/800/600'],
    location_id: 'loc-2',
    category_id: 5,
    condition: 'used_good',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    views_count: 80,
    favorites_count: 5,
    is_verified: false,
    seller_id: 'user-2',
    tags: ['fashion', 'coat', 'winter'],
    quantity: 1,
    reserved_quantity: 0
  },
  {
    id: 'item-9',
    title: '2-Room Apartment, Center',
    price: 15000000,
    description: '54 sq.m. Renovation required. Great view of the park.',
    images: ['https://picsum.photos/seed/apartment/800/600'],
    location_id: 'loc-1',
    category_id: 1,
    condition: 'used_fair',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    views_count: 8000,
    favorites_count: 1200,
    is_verified: true,
    seller_id: 'user-3',
    tags: ['real-estate', 'apartment', 'sale'],
    quantity: 1,
    reserved_quantity: 0
  },
  {
    id: 'item-10',
    title: 'Golden Retriever Puppies',
    price: 35000,
    description: 'Purebred puppies with documents. Vaccinated.',
    images: ['https://picsum.photos/seed/puppies/800/600'],
    location_id: 'loc-5',
    category_id: 8,
    condition: 'new',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    views_count: 300,
    favorites_count: 89,
    is_verified: true,
    seller_id: 'user-2',
    tags: ['pets', 'dogs'],
    quantity: 5,
    reserved_quantity: 2
  },
  {
    id: 'item-11',
    title: 'Sony A7III Camera Body',
    price: 130000,
    description: 'Low shutter count (5k). Perfect working order.',
    images: ['https://picsum.photos/seed/camera/800/600'],
    location_id: 'loc-1',
    category_id: 3,
    condition: 'used_good',
    status: 'public',
    created_at: new Date().toISOString(),
    views_count: 150,
    favorites_count: 22,
    is_verified: true,
    seller_id: 'user-1',
    tags: ['camera', 'sony', 'photo'],
    quantity: 2,
    reserved_quantity: 0
  },
  {
    id: 'item-12',
    title: 'Electric Guitar Fender Stratocaster',
    price: 75000,
    description: 'Made in Mexico. Sunburst finish. Hard case included.',
    images: ['https://picsum.photos/seed/guitar/800/600'],
    location_id: 'loc-2',
    category_id: 7,
    condition: 'used_good',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    views_count: 410,
    favorites_count: 67,
    is_verified: false,
    seller_id: 'user-4',
    tags: ['music', 'guitar'],
    quantity: 1,
    reserved_quantity: 0
  },
    {
    id: 'item-13',
    title: 'MacBook Air M1',
    price: 65000,
    description: 'Space Gray, 8/256. Battery 92%. Small scratch on lid.',
    images: ['https://picsum.photos/seed/macbook/800/600'],
    location_id: 'loc-6',
    category_id: 3,
    condition: 'used_good',
    status: 'public',
    created_at: new Date().toISOString(),
    views_count: 600,
    favorites_count: 40,
    is_verified: true,
    seller_id: 'user-1',
    tags: ['apple', 'macbook', 'laptop'],
    quantity: 1,
    reserved_quantity: 0
  },
    {
    id: 'item-14',
    title: 'IKEA Desk White',
    price: 3000,
    description: 'Simple white desk. Good for students. Pickup.',
    images: ['https://picsum.photos/seed/desk/800/600'],
    location_id: 'loc-1',
    category_id: 4,
    condition: 'used_fair',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    views_count: 90,
    favorites_count: 10,
    is_verified: false,
    seller_id: 'user-2',
    tags: ['furniture', 'desk', 'ikea'],
    quantity: 1,
    reserved_quantity: 0
  },
  {
    id: 'item-15',
    title: 'Toyota Camry 2021',
    price: 3100000,
    description: '3.5L engine. Full option. Black leather interior.',
    images: ['https://picsum.photos/seed/camry/800/600'],
    location_id: 'loc-4',
    category_id: 2,
    condition: 'used_good',
    status: 'public',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    views_count: 2100,
    favorites_count: 150,
    is_verified: true,
    seller_id: 'user-3',
    tags: ['car', 'toyota'],
    quantity: 1,
    reserved_quantity: 0
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: 'story-1',
    seller_id: 'user-1',
    image_url: 'https://picsum.photos/seed/story1/600/1000',
    title: '🔥 Flash Sale Weekend!',
    description: 'Get up to 20% off on all electronics this weekend. Don\'t miss out!',
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    is_seen: false
  },
  {
    id: 'story-2',
    seller_id: 'user-2',
    image_url: 'https://picsum.photos/seed/story2/600/1000',
    title: 'New Vintage Collection',
    description: 'Just arrived: Mid-century modern furniture. Click to see the sofa.',
    item_id: 'item-3',
    expires_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    is_seen: false
  },
  {
    id: 'story-3',
    seller_id: 'user-3',
    image_url: 'https://picsum.photos/seed/story3/600/1000',
    title: 'BMW Test Drive Day',
    description: 'Experience the thrill. Book your test drive for the 3 Series today.',
    item_id: 'item-2',
    expires_at: new Date(Date.now() + 86400000 * 3).toISOString(),
    is_seen: true
  },
  {
    id: 'story-4',
    seller_id: 'user-1',
    image_url: 'https://picsum.photos/seed/story4/600/1000',
    title: 'Unboxing the iPhone 15',
    description: 'Check out the stunning Natural Titanium finish in our latest drop.',
    item_id: 'item-1',
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    is_seen: true
  },
  {
    id: 'story-5',
    seller_id: 'user-4',
    image_url: 'https://picsum.photos/seed/story5/600/1000',
    title: 'Gamer Setup',
    description: 'Rate my new setup! All parts available in my store.',
    item_id: 'item-7',
    expires_at: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    is_seen: false
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'price_drop',
    title: 'Price Drop Alert',
    message: 'The iPhone 15 Pro Max you liked is now 5% cheaper!',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    image_url: 'https://picsum.photos/seed/iphone/100/100'
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New Message',
    message: 'VintageFinds sent you a message regarding "Vintage Leather Sofa"',
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    image_url: 'https://picsum.photos/seed/user2/100/100'
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'Welcome to MarketGenius',
    message: 'Thanks for joining! Complete your profile to start selling.',
    is_read: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: 'notif-4',
    type: 'story_like',
    title: 'Story Reaction',
    message: 'GamerPro liked your story.',
    is_read: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    image_url: 'https://picsum.photos/seed/user4/100/100'
  }
];

export const MOCK_REQUESTS: BuyerRequest[] = [
  {
    id: 'req-1',
    buyer_id: 'user-2',
    item_id: 'item-1',
    status: 'pending',
    message: 'Hi, is this still available? Would you accept 105,000?',
    preferred_contact: 'chat',
    offer_price: 105000,
    created_at: new Date().toISOString(),
    buyer_name: 'Sarah Connor',
    item_title: 'iPhone 15 Pro Max',
    item_image: 'https://picsum.photos/seed/iphone/100/100'
  },
  {
    id: 'req-2',
    buyer_id: 'user-4',
    item_id: 'item-1',
    status: 'accepted',
    message: 'I can pick it up tomorrow evening.',
    preferred_contact: 'phone',
    contact_info: '+7 999 000 00 00',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    buyer_name: 'Dmitry K',
    item_title: 'iPhone 15 Pro Max',
    item_image: 'https://picsum.photos/seed/iphone/100/100'
  },
  {
    id: 'req-3',
    buyer_id: 'user-3',
    item_id: 'item-13',
    status: 'sold',
    message: 'Payment sent via transfer.',
    preferred_contact: 'chat',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    buyer_name: 'AutoDealer_77',
    item_title: 'MacBook Air M1',
    item_image: 'https://picsum.photos/seed/macbook/100/100'
  }
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'Moscow Central',
    code: 'MSC-01',
    type: 'main',
    occupancy_percentage: 78,
    zones: [
      { id: 'zone-1', name: 'Electronics A', code: 'Z-EL-A', type: 'rack', bins_count: 120 },
      { id: 'zone-2', name: 'Bulk Storage', code: 'Z-BLK-1', type: 'bulk', bins_count: 50 },
    ]
  },
  {
    id: 'wh-2',
    name: 'St. Petersburg Reserve',
    code: 'SPB-RES',
    type: 'reserve',
    occupancy_percentage: 34,
    zones: [
      { id: 'zone-3', name: 'Zone A', code: 'ZA', type: 'rack', bins_count: 200 }
    ]
  }
];

export const MOCK_BATCHES: ItemBatch[] = [
  {
    id: 'batch-1',
    item_id: 'item-1',
    batch_number: 'B-2024-001',
    quantity_received: 100,
    quantity_available: 45,
    received_date: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: 'active'
  },
  {
    id: 'batch-2',
    item_id: 'item-2',
    batch_number: 'B-2024-002',
    quantity_received: 10,
    quantity_available: 0,
    received_date: new Date(Date.now() - 86400000 * 45).toISOString(),
    status: 'depleted'
  }
];

export const MOCK_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    item_id: 'item-1',
    location_from_id: 'wh-1',
    location_to_id: 'wh-2',
    user_id: 'user-5',
    movement_type: 'transfer',
    quantity: 20,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    notes: 'Stock balancing'
  },
  {
    id: 'mov-2',
    item_id: 'item-1',
    location_to_id: 'wh-1',
    user_id: 'user-5',
    movement_type: 'inbound',
    quantity: 100,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    notes: 'Initial receipt from Supplier X'
  }
];

export const MOCK_AUDITS: StockAudit[] = [
  {
    id: 'audit-1',
    reference_number: 'INV-2024-001',
    warehouse_id: 'wh-1',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'completed',
    items: [
      { item_id: 'item-1', expected_qty: 12, actual_qty: 10, discrepancy: -2 },
      { item_id: 'item-2', expected_qty: 1, actual_qty: 1, discrepancy: 0 }
    ],
    notes: 'Annual count'
  }
];
