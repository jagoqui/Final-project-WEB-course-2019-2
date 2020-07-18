import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { User } from '@shared/models/user.interface'
import { Observable } from 'rxjs';
import SwAlert from 'sweetalert2';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public Users$: Observable<User[]>;

  constructor(private authSvc: AuthService) { }

  onDeleteUser(user: User){
    SwAlert.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.authSvc.userDelete(user).then(() => {
          SwAlert.fire(
            {
              icon: 'success',
              title: 'Deleted!',
              text: 'Your  item has been deleted.',
              showConfirmButton: false,
              timer: 1500
            }
          )
        }).catch((error) => {
          SwAlert.fire('Error!', 'There was an error deleting this item', error);
        });
      }
    });
  }

  onUpdateUser(user:User){

  }

  ngOnInit(): void {
    this.Users$ = this.authSvc.getAllUsers();
  }
}
