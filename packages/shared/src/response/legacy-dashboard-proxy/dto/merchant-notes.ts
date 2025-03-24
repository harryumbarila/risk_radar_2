export interface MerchantNotesResponseDto {
  notes: MetchantNote[];
}

export interface MetchantNote {
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
