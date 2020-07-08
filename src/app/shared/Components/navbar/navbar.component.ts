import { User } from '@shared/models/user.interface';
import { Observable } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent{
  public user$: Observable<User>;

  constructor(public authSvc: AuthService, private router: Router) {
    try {
      this.user$ = this.authSvc.isAuth();
    } catch (error) {
      console.log(error);
    }
  }

  async onLogout() {
    try {
      await this.authSvc.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}