export interface PaymentRequest {
  payerId: number;
  payeeId: number;
  amount: number;
  currency: string;
  description: string;
}
