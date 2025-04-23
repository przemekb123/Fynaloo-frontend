export interface AdjustPriceDifferenceRequestModel {
  payerId: number;
  differenceAmount: number;
  affectedUserIds: number[];
}
