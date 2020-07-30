import { User } from '@shared/models/user.interface';
import { Observable } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartDbService } from '@app/cart/services/cart-db.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public user$: Observable<User>;

  constructor(public authSvc: AuthService, public cartBD: CartDbService, private router: Router) { }

  async onLogout() {
    try {
      await this.authSvc.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    try {
      this.user$ = this.authSvc.isAuth();
      this.user$.subscribe(currentUser => {
        if(currentUser){
          this.authSvc.getOneUser(currentUser.uid).subscribe(user => {
            let numCarts = user.cartsId.length;
            if(numCarts){ //Si el usuario tiene al menos un carrito
              this.authSvc.numCartsUser$.emit(numCarts);
              this.cartBD.getOneCart(user.cartsId[user.cartsId.length - 1]).subscribe(cart => {
                if (cart) {
                  this.cartBD.onCart$.emit(cart.numItems);
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.log('Error in login',error);
    }
  }
}
