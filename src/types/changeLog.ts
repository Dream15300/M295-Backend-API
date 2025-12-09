export type ChangeType = "Insert" | "Update" | "Delete";

export interface ChangeLog {
  id: number;
  changed_table: string;
  changed_record_id: number;
  changed_by: number;
  change_time: string;   // ISO-Datetime
  change_type: ChangeType;
  details: string | null;
}

export type ChangeLogInput = Omit<ChangeLog, "id" | "change_time">;
export type ChangeLogUpdate = Partial<ChangeLogInput>;
