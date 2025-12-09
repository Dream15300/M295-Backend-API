export type ChangeType = 'Insert' | 'Update' | 'Delete';

export interface ChangeLog {
  id: number;
  changedTable: string;
  changedRecordId: number;
  changedBy: number;
  changeTime: string; // ISO-Datetime
  changeType: ChangeType;
  details: string | null;
}

export interface ChangeLogInput {
  changedTable: string;
  changedRecordId: number;
  changedBy: number;
  changeType: ChangeType;
  details?: string | null;
}
