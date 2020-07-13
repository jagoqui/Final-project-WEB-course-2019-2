import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from '@shared/Components/navbar/navbar.component';
import { SendEmailComponent } from './auth/send-email/send-email.component';

import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireModule } from '@angular/fire'
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';

import { CanSuscriptorGuard } from '@app/auth/guards/can-suscriptor.guard';
import { CanAdminGuard } from '@auth/guards/can-admin.guard';
import { CanEditGuard } from '@auth/guards/can-edit.guard';
import { AuthService } from '@auth/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module'; //Se importa acá porque posiblemente lo utilice en varios componentes o módulos

@NgModule({
  declarations: [
    AppComponent, NavbarComponent,SendEmailComponent //TODO: Revisar si es necesario importar aquí el SendEmailCompanent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    AuthService,
    CanEditGuard,
    CanAdminGuard,
    CanSuscriptorGuard,
    { provide: BUCKET, useValue: 'gs://capripic.appspot.com/'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
