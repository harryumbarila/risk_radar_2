export interface MerchantHold {
  id: string;
  dbaName: string;
  mid: string;
  holdType: 'Manual' | 'Auto-Hold';
  reason: string;
  datePlaced: Date;
  placedBy: 'analyst' | 'system';
  placedByName: string;
  holdStatus: 'Active' | 'Released';
  expirationDate?: Date;
  releasedDate?: Date;
  releasedBy?: 'analyst' | 'system';
  releasedByName?: string;
}

export interface HoldHistoryEntry {
  id: string;
  action: 'placed' | 'released' | 'extended' | 'modified';
  date: Date;
  performedBy: string;
  performedByType: 'analyst' | 'system';
  reason?: string;
  notes?: string;
}

export interface PlaceHoldData {
  mid: string;
  dbaName: string;
  reason: string;
  expirationDate?: Date;
}

export interface ActivityEntry {
  id: string;
  transmissionDate: string;
  transactionDate: string;
  transactionAmt: string;
  authCode: string;
  cardF6: string;
  cardL4: string;
  cardType: string;
  posEntryMode: string;
  posEntryModeCalculated: string;
  cardNotPresent: 'Yes' | 'No';
  timestamp: Date; // For sorting and filtering
}