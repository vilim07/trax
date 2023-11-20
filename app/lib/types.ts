import { Timestamp } from '@firebase/firestore-types';

export interface Tracker {
  id: string;
  desc: string;
  createdAt: Timestamp;
  startedAt: Timestamp | null;
  runTime: number;
  paused: boolean;
  stopped: boolean;
  trashed: boolean;
  indices: string[];
  user: string;
}

export interface FilterState {
  start: null | Date; 
  end: null | Date; 
  keywords: string
}