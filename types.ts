
export enum Genre {
  ROMANCE = 'Romance',
  DARK_ROMANCE = 'Dark Romance',
  HORROR = 'Horror',
  THRILLER = 'Thriller',
  FANTASY = 'Fantasy',
  SCI_FI = 'Sci-Fi',
  MYSTERY = 'Mystery'
}

export interface StoryChapter {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export interface Story {
  id: string;
  title: string;
  genre: Genre;
  country: string;
  synopsis: string;
  chapters: StoryChapter[];
  coverImage: string;
  views: number;
  createdAt: number;
}

export interface DiscoveryState {
  step: number;
  genrePref?: Genre;
  tonePref?: string;
  settingPref?: string;
}

export interface LocalHistory {
  storyId: string;
  lastReadChapterId: string;
  lastReadAt: number;
}
