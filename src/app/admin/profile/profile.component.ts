import { User } from '@shared/models/user.interface';
import { Observable } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{
  public user$: Observable<User> = this.authSvc.isAuth(); // Le pasa los datos del servicio Auth y verifica si el usuario está logueado
  constructor(private authSvc: AuthService, private router: Router) { }
}
