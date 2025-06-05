export interface TravelRoute {
  id: number;
  name: string;
  description: string;
  total_distance: number;
  estimated_duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  best_season: string;
  destinations: Array<{
    id: number;
    name: string;
    short_description: string;
  }>;
  media: string[];
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: number;
  name: string;
  description: string;
  short_description: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  email?: string;
  category: string;
  tags: string[];
  media: string[];
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
  price: number;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
  media: string[];
  created_at: string;
  updated_at: string;
} 