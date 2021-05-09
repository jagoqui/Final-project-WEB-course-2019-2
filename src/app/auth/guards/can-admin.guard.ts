import { AuthService } from '@auth/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import SwAlert from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CanAdminGuard implements CanActivate {
  constructor(private authSvc: AuthService, private route: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authSvc.user$.pipe(
      take(1),
      map((user) => user && this.authSvc.isAdmin(user)),
      tap((canEdit) => {
        if (!canEdit) {
          SwAlert.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<span>Access denied. Must have permission to manage data. <span>'
          }).then((result) => {
            this.route.navigate(['home/']);
          });
        }
      })
    );
  }
}
