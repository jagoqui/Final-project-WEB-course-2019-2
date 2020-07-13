import { Observable } from "rxjs";

export type Categorys = 'Picnic' | 'Senderismo' | 'Granja';

export interface Item {
  id: string;
  photosURL: string[];
  name: string;
  description: string;
  category?: Categorys;
  promotionalCode?: Observable<string>;
  discount?: Observable<number>;
  available : boolean;
  price: number;
  quantity: Observable<number>;
  createDate: Date;
}
