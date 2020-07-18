export interface Cart {
  id?: string;
  userId: string;
  itemsId: string[];
  numItem: number;
  totalPay: number;
  isPaid: boolean;
  dateCreate: Date;
}

