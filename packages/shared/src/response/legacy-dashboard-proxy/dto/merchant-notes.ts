export interface MerchantNotesResponseDto {
  pkNotes: number;
  sMID: string;
  sNotes: string;
  bHidden: boolean;
  dtCreated: string;
  sUserCreated: string;
  dtIrisMemoRequest: string;
  bPinnedNotes: string;
  dtIrisMemoRequestFulfilled: string;
  bPushedToIris: boolean;
  pkRiskRadarNotes: number;
}
