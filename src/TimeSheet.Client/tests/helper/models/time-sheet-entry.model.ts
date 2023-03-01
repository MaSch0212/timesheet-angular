export interface TimeSheetEntry {
  id: number;
  sheetId: number;
  start: Date;
  end: Date;
  breaks: Break[];
  targetHours: number;
}

export interface Break {
  id: number;
  start: Date;
  end: Date;
}
