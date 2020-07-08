import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadImageRoutingModule } from './upload-image-routing.module';
import { UploadImageComponent } from './upload-image.component';
import {SharedModule} from '@shared/SharedModule.module';

@NgModule({
  declarations: [UploadImageComponent],
  imports: [
    CommonModule,
    UploadImageRoutingModule,
    SharedModule
  ]
})
export class UploadImageModule { }
