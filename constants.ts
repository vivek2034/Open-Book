
import { Genre } from './types';

export const COUNTRIES = [
  'United States', 'Japan', 'South Korea', 'United Kingdom', 'France', 
  'India', 'Brazil', 'Italy', 'Germany', 'Mexico', 'Egypt', 'Russia'
];

export const GENRES = Object.values(Genre);

export const TONES = [
  'Melancholic', 'Heartwarming', 'Terrifying', 'Suspenseful', 'Ethereal', 'Gritty'
];

export const SETTINGS = [
  'Modern City', 'Remote Village', 'Historical Era', 'Future Tech', 'Fantasy Realm'
];

export const STORAGE_KEYS = {
  GLOBAL_STORIES: 'open_book_global_stories',
  LOCAL_HISTORY: 'open_book_local_history',
};
