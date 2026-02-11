
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Phones & Tablets', icon: 'fa-mobile-screen-button', slug: 'phones' },
  { id: '2', name: 'Electronics', icon: 'fa-tv', slug: 'electronics' },
  { id: '3', name: 'Fashion', icon: 'fa-shirt', slug: 'fashion' },
  { id: '4', name: 'Computing', icon: 'fa-laptop', slug: 'computing' },
  { id: '5', name: 'Home & Office', icon: 'fa-couch', slug: 'home' },
  { id: '6', name: 'Health & Beauty', icon: 'fa-pump-soap', slug: 'beauty' },
  { id: '7', name: 'Supermarket', icon: 'fa-cart-shopping', slug: 'supermarket' },
  { id: '8', name: 'Baby Products', icon: 'fa-baby', slug: 'baby' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Samsung Galaxy S23 Ultra 5G - 256GB - Phantom Black',
    brand: 'Samsung',
    price: 950.00,
    originalPrice: 1200.00,
    image: 'https://picsum.photos/seed/s23/400/400',
    category: 'phones',
    rating: 4.8,
    reviewCount: 154,
    isOfficial: true,
    badge: 'Best Seller',
    description: 'The ultimate flagship smartphone with high-performance camera and S-Pen. Features a 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2 for Galaxy, and a revolutionary 200MP camera system.',
    reviews: [
      { id: 'r1', reviewerName: 'John Doe', rating: 5, comment: 'Incredible camera! The zoom is out of this world.', date: '2023-10-12' },
      { id: 'r2', reviewerName: 'Alice Smith', rating: 4, comment: 'Great phone, but quite large for small hands.', date: '2023-11-05' }
    ]
  },
  {
    id: 'p2',
    name: 'Apple iPhone 15 Pro Max - 256GB - Natural Titanium',
    brand: 'Apple',
    price: 1199.00,
    image: 'https://picsum.photos/seed/iphone15/400/400',
    category: 'phones',
    rating: 4.9,
    reviewCount: 89,
    isOfficial: true,
    description: 'Experience the power of Titanium and the most advanced chip in a smartphone. A Grade-5 titanium design makes this the lightest Pro model ever. Advanced camera system with 5x optical zoom.',
    reviews: [
      { id: 'r3', reviewerName: 'Sarah K.', rating: 5, comment: 'The titanium feel is amazing. Super fast!', date: '2023-12-01' }
    ]
  },
  {
    id: 'p3',
    name: 'HP Pavilion 15 - Intel Core i5 - 8GB RAM - 512GB SSD',
    brand: 'HP',
    price: 550.00,
    originalPrice: 650.00,
    image: 'https://picsum.photos/seed/hp/400/400',
    category: 'computing',
    rating: 4.5,
    reviewCount: 42,
    badge: 'Flash Sale',
    description: 'Perfect for productivity and entertainment on the go. Equipped with a powerful Intel Core processor, a crisp 15.6-inch display, and long-lasting battery life.',
    reviews: []
  },
  {
    id: 'p4',
    name: "Men's Casual Sneakers - Breathable Mesh - White",
    brand: 'Generic',
    price: 25.00,
    originalPrice: 45.00,
    image: 'https://picsum.photos/seed/sneakers/400/400',
    category: 'fashion',
    rating: 4.2,
    reviewCount: 312,
    description: 'Comfortable and stylish sneakers for everyday wear. Lightweight mesh upper provides breathability while the padded collar offers extra comfort.',
    reviews: [
      { id: 'r4', reviewerName: 'Mike Ross', rating: 4, comment: 'Very comfortable for walking, slightly small fit.', date: '2023-09-15' }
    ]
  },
  {
    id: 'p5',
    name: 'Smart 4K UHD LED TV - 55 Inch - HDR10',
    brand: 'Generic',
    price: 399.00,
    originalPrice: 500.00,
    image: 'https://picsum.photos/seed/tv/400/400',
    category: 'electronics',
    rating: 4.6,
    reviewCount: 67,
    isOfficial: true,
    description: 'Cinematic quality picture and smart features for your living room. 4K Ultra HD resolution, HDR10 support, and built-in streaming apps.',
    reviews: []
  },
  {
    id: 'p6',
    name: 'Non-Stick Cookware Set - 12 Pieces - Granite Coating',
    brand: 'Generic',
    price: 85.00,
    image: 'https://picsum.photos/seed/pots/400/400',
    category: 'home',
    rating: 4.4,
    reviewCount: 18,
    description: 'Durable and easy-to-clean cookware for the modern kitchen. Includes various sized pots and pans with heat-resistant handles and tempered glass lids.',
    reviews: []
  },
  {
    id: 'p7',
    name: 'Organic Shea Butter - 500g - Raw & Unrefined',
    brand: 'SheaNature',
    price: 12.00,
    originalPrice: 18.00,
    image: 'https://picsum.photos/seed/shea/400/400',
    category: 'beauty',
    rating: 4.7,
    reviewCount: 220,
    description: 'Pure natural shea butter for skin and hair care. Rich in vitamins and fatty acids, perfect for moisturizing and soothing dry skin.',
    reviews: []
  },
  {
    id: 'p8',
    name: 'Washing Machine - 7kg Front Load - Silver',
    brand: 'Generic',
    price: 310.00,
    image: 'https://picsum.photos/seed/washing/400/400',
    category: 'home',
    rating: 4.3,
    reviewCount: 25,
    isOfficial: true,
    description: 'Energy-efficient washing machine with multiple wash programs. 1200 RPM spin speed, child lock feature, and delay start function.',
    reviews: []
  }
];
