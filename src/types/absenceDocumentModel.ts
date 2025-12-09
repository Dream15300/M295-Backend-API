export interface AbsenceDocument {
  id: number;
  absenceId: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: number;
  uploadedAt: string; // ISO-Datetime
}

export interface AbsenceDocumentInput {
  absenceId: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: number;
}
