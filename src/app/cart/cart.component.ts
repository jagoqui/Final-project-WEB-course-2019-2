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
  public CartsUser: Cart[]
  user: User = {
    uid: null,
    email: null,
    emailVerified: null,
    cartId: null,
  }
  constructor(private itemDB: ItemsDBService, private autSvc: AuthService, private cartDB: CartDbService, private router: Router) { }

  ngOnInit(): void {
    this.autSvc.isAuth().subscribe(user  => this.user = user);
    for  (const cartsId of this.user.cartId) {
      this.cartDB.getOneCart(cartsId).subscribe(cart => this.CartsUser.push(cart));
    }
    console.log(this.CartsUser);

  }

}
