import { IrisEnv } from '@/api/shared/constanst/iris';

export enum EquipmentFormFields {
  FDEquipment1 = 'FD Equipment',
  TSYSEquipment1 = 'TSYS Equipment',

  // Terminal 1
  PurchasePrice1 = 'Purchase Price 1',
  QuantityP1 = 'Quantity P1',
  PurchaseTotal1 = 'Purchase Total 1',
  RentalPrice1 = 'Rental Price 1',
  QuantityR1 = 'Quantity R1',
  RentalTotal1 = 'Rental Total 1',

  // Terminal 2
  FDEquipment2 = 'FD Equipment 2',
  TSYSEquipment2 = 'TSYS Equipment 2',
  PurchasePrice2 = 'Purchase Price 2',
  QuantityP2 = 'Quantity P2',
  PurchaseTotal2 = 'Purchase Total 2',
  RentalPrice2 = 'Rental Price 2',
  QuantityR2 = 'Quantity R2',
  RentalTotal2 = 'Rental Total 2',

  // Terminal 3
  FDEquipment3 = 'FD Equipment 3',
  TSYSEquipment3 = 'TSYS Equipment 3',
  PurchasePrice3 = 'Purchase Price 3',
  QuantityP3 = 'Quantity P3',
  PurchaseTotal3 = 'Purchase Total 3',
  RentalPrice3 = 'Rental Price 3',
  QuantityR3 = 'Quantity R3',
  RentalTotal3 = 'Rental Total 3',

  // Payment Details
  PurchaseTotal = 'Purchase Total',
  MonthlyRentalTotal = 'Monthly Rental Total',
}

export const EquipmentFormTab: Record<
  IrisEnv,
  Record<EquipmentFormFields, number | null>
> = {
  staging: {
    [EquipmentFormFields.FDEquipment1]: 6854,
    [EquipmentFormFields.TSYSEquipment1]: 7217,
    [EquipmentFormFields.PurchasePrice1]: 7915,
    [EquipmentFormFields.QuantityP1]: 7917,
    [EquipmentFormFields.PurchaseTotal1]: 8064,
    [EquipmentFormFields.RentalPrice1]: 7916,
    [EquipmentFormFields.QuantityR1]: 7963,
    [EquipmentFormFields.RentalTotal1]: 8065,

    [EquipmentFormFields.FDEquipment2]: 8043,
    [EquipmentFormFields.TSYSEquipment2]: 8044,
    [EquipmentFormFields.PurchasePrice2]: 8047,
    [EquipmentFormFields.QuantityP2]: 8049,
    [EquipmentFormFields.PurchaseTotal2]: 8051,
    [EquipmentFormFields.RentalPrice2]: 8053,
    [EquipmentFormFields.QuantityR2]: 8050,
    [EquipmentFormFields.RentalTotal2]: 8057,

    [EquipmentFormFields.FDEquipment3]: 8045,
    [EquipmentFormFields.TSYSEquipment3]: 8046,
    [EquipmentFormFields.PurchasePrice3]: 8048,
    [EquipmentFormFields.QuantityP3]: 8055,
    [EquipmentFormFields.PurchaseTotal3]: 8052,
    [EquipmentFormFields.RentalPrice3]: 8054,
    [EquipmentFormFields.QuantityR3]: 8056,
    [EquipmentFormFields.RentalTotal3]: 8058,
    [EquipmentFormFields.PurchaseTotal]: 7918,
    [EquipmentFormFields.MonthlyRentalTotal]: 7964,
  },
  prod: {
    [EquipmentFormFields.FDEquipment1]: 6887,
    [EquipmentFormFields.TSYSEquipment1]: 6885,
    [EquipmentFormFields.PurchasePrice1]: 7856,
    [EquipmentFormFields.QuantityP1]: 7855,
    [EquipmentFormFields.PurchaseTotal1]: 7951,
    [EquipmentFormFields.RentalPrice1]: 7857,
    [EquipmentFormFields.QuantityR1]: 7854,
    [EquipmentFormFields.RentalTotal1]: 7952,

    [EquipmentFormFields.FDEquipment2]: 7953,
    [EquipmentFormFields.TSYSEquipment2]: 7955,
    [EquipmentFormFields.PurchasePrice2]: 7957,
    [EquipmentFormFields.QuantityP2]: 7958,
    [EquipmentFormFields.PurchaseTotal2]: 7959,
    [EquipmentFormFields.RentalPrice2]: 7960,
    [EquipmentFormFields.QuantityR2]: 7961,
    [EquipmentFormFields.RentalTotal2]: 7962,

    [EquipmentFormFields.FDEquipment3]: 7954,
    [EquipmentFormFields.TSYSEquipment3]: 7956,
    [EquipmentFormFields.PurchasePrice3]: 7963,
    [EquipmentFormFields.QuantityP3]: 7964,
    [EquipmentFormFields.PurchaseTotal3]: 7965,
    [EquipmentFormFields.RentalPrice3]: 7966,
    [EquipmentFormFields.QuantityR3]: 7967,
    [EquipmentFormFields.RentalTotal3]: 7968,
    [EquipmentFormFields.PurchaseTotal]: 7711,
    [EquipmentFormFields.MonthlyRentalTotal]: 7712,
  },
};
