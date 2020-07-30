export interface Cart {
  id?: string;
  itemsId: string[];
  numItems: number;
  totalPay: number;
  isPaid: boolean;
  isBilled: boolean;
  dateCreate: Date;
  dateLastUpdate: Date;
}

