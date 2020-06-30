import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CarouselComponent } from '../shared/carousel/carousel.component';
import { LoginComponent } from '../auth/login/login.component';



@NgModule({
  declarations: [HomeComponent, CarouselComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
