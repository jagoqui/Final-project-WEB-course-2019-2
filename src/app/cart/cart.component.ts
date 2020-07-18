import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { ItemsDBService } from '@admin/services/items-db.service';
import { Item } from '@admin/models/item.interface'
import {Cart} from '../cart/models/cart.interface';
import {CartDbService} from '../cart/services/cart-db.service';
import { User } from '@shared/models/user.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public CartsUser$: Observable<Cart[]>
  user: User = {
    uid: null,
    email: null,
    emailVerified: null,
    cartId: null,
  }
  constructor(private itemDB: ItemsDBService, private autSvc: AuthService, private cartDB: CartDbService, private router: Router) { }

  ngOnInit(): void {
    // this.autSvc.isAuth().subscribe(user  => this.user = user);
    // this.cartDB.getAllCarts().subscribe(Carts => {
    //   for  (const cart of Carts) {
    //     if(cart.userId == this.user.uid){
    //       this.user.cartId.push(cart.id);
    //       this.CartsUser$.push(this.cartDB.getOneCart(cart.id));
    //     }
    //   }
    // })
  }

}
