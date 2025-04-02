export interface MerchantNotesResponseDto {
  pkNotes: number;
  sMID: string;
  sNotes: string;
  bHidden: boolean;
  dtCreated: string;
  sUserCreated: string;
  dtIrisMemoRequest: string;
  isPinned: boolean;
  dtIrisMemoRequestFulfilled: string;
  bPushedToIris: boolean;
}
