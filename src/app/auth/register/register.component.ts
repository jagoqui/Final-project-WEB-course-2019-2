import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '@shared/models/user.interface';
import { FileItem } from '@app/shared/uploadFiles/models/file-item';
import { StorageService } from '@shared/uploadFiles/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [StorageService]
})
export class RegisterComponent implements OnInit {
  profileImage: FileItem[] = []; //Crea un objeto tipo FileItem para la imagen de perfil del usuario registrado
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //Patrón de validación de email
  registerForm: FormGroup;
  imageSrc: String | ArrayBuffer | null;
  isOverDrop = false;
  newUser: User;
  constructor(private authSvc: AuthService, private router: Router, private storageSvc: StorageService) { }

  createFormGroup() {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new FormControl('', [Validators.required, Validators.minLength(15), Validators.pattern(this.emailPattern)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]), // TODO :Validar tipo ce contraseña
      passwordVerification: new FormControl('', [Validators.required, Validators.minLength(8)]), //TODO: Validarque tenga la misma contraseña
    });
  }

  async onRegister() {
    const { email, password } = this.registerForm.value;
    try {
      this.newUser = await this.authSvc.register(email, password);
      if (this.newUser) {
        // this.storageSvc.uploadImage(this.profileImage, 'test');
        // console.log(this.profileImage[0].get_downloadURL());
        // this.profileImage[0].downloadURL.subscribe(url => this.newUser.photoURL = url);
        // this.authSvc.updateUserData(this.newUser); //Actualiza la información del usuario
        this.checkUserIsVerified(this.newUser);
      } else {
        this.profileImage = []; //Elimina la imagen de perfil cargada
        this.imageSrc = null; //Le lleva nul al src del la imagen cargada, para que obligue al usuario volver a cargar una imagen
      }
    } catch (error) {
      // this.authSvc.userDelete(email); //TODO: Emilinar loguin si ocurre un error
      this.profileImage = []; //Elimina la imagen de perfil cargada
      this.imageSrc = null; //Le lleva nul al src del la imagen cargada, para que obligue al usuario volver a cargar una imagen
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
