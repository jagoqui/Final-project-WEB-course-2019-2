import { AuthService } from '@auth/services/auth.service';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import SwAlert from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  userEmail = new FormControl('');
  constructor(private authSvc: AuthService, private router: Router) { }

  async onReset() {
    try {
      const email = this.userEmail.value;
      await this.authSvc.resetPassword(email);
      let timerInterval
      SwAlert.fire({
        title: 'Auto close alert!',
        html: 'I will close in <b></b> milliseconds.',
        timer: 2000,
        timerProgressBar: true,
        onBeforeOpen: () => {
          SwAlert.showLoading()
          timerInterval = setInterval(() => {
            const content = SwAlert.getContent()
            if (content) {
              const b = content.querySelector('b')
              if (b) {
                b.textContent += SwAlert.getTimerLeft()
              }
            }
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === SwAlert.DismissReason.timer) {
          console.log('I was closed by the timer')
        }
      })
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
