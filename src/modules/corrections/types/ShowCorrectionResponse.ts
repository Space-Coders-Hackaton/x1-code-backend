import { Correction } from '@database/entities/correction';

export interface ShowCorrectionResponse {
  pending: boolean;
  daysTimeout: number;
  last_correction: Date;
  correction: Correction;
}
