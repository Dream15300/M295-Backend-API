export type AbsenceType = 'Vacation' | 'Sick' | 'Flex';
export type AbsenceStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Absence {
  id: number;
  userId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  type: AbsenceType;
  status: AbsenceStatus;
  requestedAt: string; // ISO-Datetime
}

export interface AbsenceInput {
  userId: number;
  startDate: string;
  endDate: string;
  type: AbsenceType;
  status?: AbsenceStatus; // Default 'Pending' beim Insert
}
