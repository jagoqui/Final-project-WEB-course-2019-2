import { Observable } from "rxjs";

export type Categorys = 'Picnic' | 'Senderismo' | 'Granja';

export interface Item {
  id: string;
  photoURL: string[];
  name: string;
  description: string;
  category?: Categorys;
  promotionalCode?: Observable<string>;
  discount?: Observable<number>;
  avalaible : boolean;
  price: number;
  quatity: Observable<number>;
}
