export interface ImageOption {
  label: string;
  url: string;
  category: 'hotel' | 'room' | 'service' | 'team' | 'blog' | 'logo';
}

export const imageLibrary: ImageOption[] = [
  // Hotels
  { label: 'Luxury Hotel Exterior', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', category: 'hotel' },
  { label: 'Modern Resort', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', category: 'hotel' },
  { label: 'Boutique Hotel Lobby', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', category: 'hotel' },
  { label: 'Alpine Resort', url: 'https://images.unsplash.com/photo-1551882547-ff43c63efe81', category: 'hotel' },
  
  // Rooms
  { label: 'Royal Suite', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', category: 'room' },
  { label: 'Double Deluxe Room', url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a', category: 'room' },
  { label: 'Modern Interior', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', category: 'room' },
  
  // Services
  { label: 'Management Meeting', url: 'https://images.unsplash.com/photo-1454165833267-fe9019457027', category: 'service' },
  { label: 'Concierge Service', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd', category: 'service' },
  { label: 'Restaurant Dining', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', category: 'service' },
  { label: 'Spa & Wellness', url: 'https://images.unsplash.com/photo-1544161515-4af6b1d462c2', category: 'service' },
  
  // Team / Persons
  { label: 'Professional Executive', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a', category: 'team' },
  { label: 'Female Manager', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', category: 'team' },
  { label: 'Experienced Consultant', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', category: 'team' },
  
  // Blog / Industry
  { label: 'Business Strategy', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', category: 'blog' },
  { label: 'Hotel Statistics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', category: 'blog' },
  { label: 'Future Tech', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e', category: 'blog' }
];

export const getImagesByCategory = (category: string) => {
  return imageLibrary.filter(img => img.category === category);
};
