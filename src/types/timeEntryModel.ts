export type TimeEntryType = 'IN' | 'OUT';

export interface TimeEntry {
  id: number;
  userId: number;
  timestamp: string; // ISO-Datetime
  type: TimeEntryType;
  comment: string | null;
}

export interface TimeEntryInput {
  userId: number;
  timestamp: string;
  type: TimeEntryType;
  comment?: string | null;
}
