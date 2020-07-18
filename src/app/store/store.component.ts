import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { ItemsDBService } from '@admin/services/items-db.service';
import { Item } from '@admin/models/item.interface'
import { Cart } from '../cart/models/cart.interface';
import { CartDbService } from '../cart/services/cart-db.service'

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {

  public Items$: Observable<Item[]>
  numItemsCart: number = 0;

  cart: Cart = {
    userId: '',
    itemsId: [],
    numItem: null,
    totalPay: null,
    isPaid: false,
    dateCreate: null
  };

  constructor(private itemDB: ItemsDBService, private autSvc: AuthService, private cartDB: CartDbService, private router: Router) { }

  onAddCart(item?: Item) {
    if (item) {
      this.autSvc.isAuth().subscribe(user => {
        if (user) {
          this.cart.userId = user.uid;
          this.cart.userId = item.id;
          this.cart.itemsId.push(item.id);
          this.cart.numItem = this.numItemsCart;
          this.numItemsCart++;
          this.cartDB.onCart$.emit(this.numItemsCart);
        } else {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  ngOnInit(): void {
    this.Items$ = this.itemDB.getAllItems();
  }

  ngOnDestroy() {
    if (this.numItemsCart > 0) {
      this.cart.dateCreate = new Date();
      for (const itemId of this.cart.itemsId) {
        let item: Item = {
          photosURL: null,
          name: null,
          description: null,
          available: null,
          price: null,
          quantity: null,
          createDate: null
        };
        this.itemDB.getOneItem(itemId).subscribe(res => {
          item = res;
          this.cart.totalPay = this.cart.totalPay + item.price;
        });
      }
      console.log(this.cartDB.addCart(this.cart));
    }
  }
}
