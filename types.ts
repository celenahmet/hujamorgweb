export interface Theme {
  year: string;
  title: string;
  concept: string;
  color: string;
}

export interface Sponsor {
  name: string;
  tier: 'main' | 'platinum' | 'gold' | 'server' | 'clothing' | 'audio' | 'education';
  logoText?: string;
}

export interface GameProject {
  id: string;
  teamName: string;
  gameTitle: string;
  image: string;
  screenshots: string[];
  engine: string;
  members: string[];
  itchUrl: string;
  downloadUrl?: string;
  description: string;
  assets?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface MediaItem {
  type: 'photo' | 'video';
  src: string;
  alt: string;
}