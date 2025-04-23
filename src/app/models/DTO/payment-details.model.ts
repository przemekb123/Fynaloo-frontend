export interface PaymentDetailsModel {
  id: number;
  payerUsername: string;
  payeeUsername: string;
  amount: number;
  currency: string;
  paidAt: string;       // LocalDateTime -> ISO String
  description: string;
}
