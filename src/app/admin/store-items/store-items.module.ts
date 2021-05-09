import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreItemsRoutingModule } from './store-items-routing.module';
import { StoreItemsComponent } from './store-items.component';
import { MaterialModule } from '@app/material.module';
import { AddItemComponent } from './add-item/add-item.component';
import {SharedModule} from '@shared/SharedModule.module';
import {TableComponent} from '@admin/store-items/table/table.component';
import { ModalComponent } from './modal/modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StoreItemsComponent, AddItemComponent, TableComponent, ModalComponent],
  imports: [CommonModule, StoreItemsRoutingModule, MaterialModule, ReactiveFormsModule, SharedModule],
  entryComponents: [ModalComponent]
})
export class StoreItemsModule { }
