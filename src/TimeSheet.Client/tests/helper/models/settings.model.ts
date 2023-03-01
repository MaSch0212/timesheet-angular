import { ApiKey } from './api-key.model';

export interface Settings {
  workDayHours: number;
  insertDefaultBreak: boolean;
  defaultBreakStart: number;
  defaultBreakEnd: number;
  defaultStart: number;
  defaultEnd: number;
  apiKeys: ApiKey[];
}
