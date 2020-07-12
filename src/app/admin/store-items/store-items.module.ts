import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreItemsRoutingModule } from './store-items-routing.module';
import { StoreItemsComponent } from './store-items.component';


@NgModule({
  declarations: [StoreItemsComponent],
  imports: [
    CommonModule,
    StoreItemsRoutingModule
  ]
})
export class StoreItemsModule { }
