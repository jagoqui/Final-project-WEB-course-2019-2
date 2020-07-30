import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { ItemsDBService } from '@admin/services/items-db.service';
import { Item } from '@admin/models/item.interface'
import { Cart } from '../cart/models/cart.interface';
import { CartDbService } from '../cart/services/cart-db.service';
import { User } from '@shared/models/user.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  CartsUser : Cart[] = [];
  CartsUser$ : Observable<Cart[]> = new Observable();
  user: User = {
    uid: null,
    email: null,
    emailVerified: null,
    cartsId: []=[],
  }
  constructor(private itemDB: ItemsDBService, private autSvc: AuthService, private cartDB: CartDbService, private router: Router) { }

  ngOnInit(): void {
    this.autSvc.isAuth().subscribe(user => {
      this.autSvc.getOneUser(user.uid).subscribe(res => {
        this.user = res;
        for (const cartId of this.user.cartsId) {
          this.cartDB.getOneCart(cartId).subscribe(cart => {
            this.CartsUser.push(cart);
            this.CartsUser$.pipe(map(cartsList =>{
              cartsList.push(cart);
              return cartsList;
            }));
          });
        }
      });
    });
    // console.log(this.CartsUser);
    this.CartsUser$.subscribe(cartsUsers => {
      console.log(cartsUsers);
    });
  }
}
