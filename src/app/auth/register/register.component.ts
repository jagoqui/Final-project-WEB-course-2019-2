import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '@shared/models/user.interface';
import { FileItem } from '@app/shared/uploadFiles/models/file-item';
import { StorageService } from '@shared/uploadFiles/services/storage.service';
import { UploadFilesDirectiveDirective } from '@app/shared/uploadFiles/directives/upload-files-directive.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [StorageService, UploadFilesDirectiveDirective]
})
export class RegisterComponent implements OnInit{
  profileImage: FileItem; //Crea un objeto tipo FileItem para la imagen de perfil del usuario registrado
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //Patrón de validación de email
  registerForm: FormGroup;
  imageSrc: any;
  files: FileItem[] = []; //Crea un arreglo de archivos y los setea en null
  isOverDrop = false;

  constructor(private authSvc: AuthService, private router: Router, private readonly storageSvc: StorageService) {}

  createFormGroup() {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new FormControl('', [Validators.required, Validators.minLength(15), Validators.pattern(this.emailPattern)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]), // TODO :Validar tipo ce contraseña
      passwordVerification: new FormControl('', [Validators.required, Validators.minLength(8)]), //TODO: Validarque tenga la misma contraseña

    });
  }

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;
        reader.readAsDataURL(file);
    }
  }
  async onRegister() {
    const { email, password } = this.registerForm.value;
    try {
      const user = await this.authSvc.register(email, password);
      if (user) {
        this.checkUserIsVerified(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private checkUserIsVerified(user: User) {
    if (user && user.emailVerified) {
      this.router.navigate(['/home']);
    } else if (user) {
      this.router.navigate(['/verification-email']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  async onGoogleLogin() {
    try {
      const user = await this.authSvc.loginGoogle();
      if (user) {
        this.checkUserIsVerified(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.createFormGroup();
  }

}
