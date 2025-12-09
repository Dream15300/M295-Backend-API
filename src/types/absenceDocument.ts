export interface AbsenceDocument {
  id: number;
  absence_id: number;
  filename: string;       // gespeicherter Dateiname
  original_name: string;  // Originalname beim Upload
  mime_type: string;
  size: number;           // Bytes
  uploaded_by: number;    // User-ID
  uploaded_at: string;    // ISO-Datetime
}

export type AbsenceDocumentInput = Omit<AbsenceDocument, "id" | "uploaded_at">;
export type AbsenceDocumentUpdate = Partial<AbsenceDocumentInput>;
