import { BaseModel } from "./api";

export interface MerchantTransaction extends BaseModel {
  id: string;
  merchant: string;
  amount: string;
  exception: string;
  processor: string;
  mid: string;
  date: string;
  status: "Unreviewed" | "In Progress" | "Reviewed";
}
