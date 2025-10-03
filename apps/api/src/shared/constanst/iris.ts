export type IrisEnv = 'staging' | 'prod';

export interface IrisField {
  id: number;
  uid: number | null;
  field: string;
  value: string;
}
