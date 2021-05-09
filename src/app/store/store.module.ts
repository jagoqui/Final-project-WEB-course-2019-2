import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/SharedModule.module';
import { MaterialModule } from '@app/material.module';


@NgModule({
  declarations: [StoreComponent],
  imports: [CommonModule, StoreRoutingModule, ReactiveFormsModule, SharedModule, MaterialModule]
})
export class StoreModule { }
