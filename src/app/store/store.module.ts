import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/SharedModule.module';


@NgModule({
  declarations: [StoreComponent],
  imports: [CommonModule,StoreRoutingModule, ReactiveFormsModule, SharedModule]
})
export class StoreModule { }
