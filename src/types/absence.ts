export type AbsenceType = "Vacation" | "Sick" | "Flex";
export type AbsenceStatus = "Pending" | "Approved" | "Rejected";

export interface Absence {
  id: number;
  user_id: number;
  start_date: string;  // YYYY-MM-DD
  end_date: string;    // YYYY-MM-DD
  type: AbsenceType;
  status: AbsenceStatus;
  requested_at: string; // ISO-Datetime
}

export type AbsenceInput = Omit<Absence, "id" | "requested_at" | "status"> & {
  status?: AbsenceStatus; // Default 'Pending' beim Insert
};

export type AbsenceUpdate = Partial<Omit<Absence, "id" | "user_id">>;
