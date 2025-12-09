export type TimeEntryType = "IN" | "OUT";

export interface TimeEntry {
  id: number;
  user_id: number;
  timestamp: string; // ISO-Datetime
  type: TimeEntryType;
  comment: string | null;
}

export type TimeEntryInput = Omit<TimeEntry, "id">;
export type TimeEntryUpdate = Partial<TimeEntryInput>;
