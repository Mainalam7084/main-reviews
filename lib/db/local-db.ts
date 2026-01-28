import Dexie, { type EntityTable } from 'dexie';

export type Verdict = 
  | 'NEVER_WATCH' 
  | 'WATCH' 
  | 'RECOMMEND' 
  | 'STRONGLY_RECOMMEND' 
  | 'BEST_EVER';

export interface LocalReview {
  id?: number;
  movieKey: string;
  movieSource: 'tmdb' | 'omdb';
  title: string;
  year?: string;
  poster?: string;
  genres: string[];
  runtime?: string;
  director?: string;
  actors: string[];
  overview?: string;
  ratingStars: number;
  verdict: Verdict;
  prosText?: string;
  consText?: string;
  reviewText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const db = new Dexie('MainReviewsDB') as Dexie & {
  reviews: EntityTable<LocalReview, 'id'>;
};

// Schema declaration
db.version(1).stores({
  reviews: '++id, movieKey, movieSource, title, year, ratingStars, verdict, createdAt, updatedAt',
});

export { db };
