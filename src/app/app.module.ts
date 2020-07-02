import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { SendEmailComponent } from './auth/send-email/send-email.component';

import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireModule } from '@angular/fire'
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';

import { CanSuscriptorGuard } from '@app/auth/guards/can-suscriptor.guard';
import { CanAdminGuard } from '@auth/guards/can-admin.guard';
import { CanEditGuard } from '@auth/guards/can-edit.guard';
import { AuthService } from '@auth/services/auth.service';

@NgModule({
  declarations: [
    AppComponent, NavbarComponent,SendEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    // AngularFireStorageModule
  ],
  providers: [
    AuthService,
    CanEditGuard,
    CanAdminGuard,
    CanSuscriptorGuard,
    // { provide: BUCKET, useValue: 'gs://capripic.appspot.com/ '}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
