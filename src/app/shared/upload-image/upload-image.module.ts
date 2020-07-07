import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadImageRoutingModule } from './upload-image-routing.module';
import { UploadImageComponent } from './upload-image.component';
import {UploadFilesDirectiveDirective} from '@shared/uploadFiles/directives/upload-files-directive.directive'

@NgModule({
  declarations: [UploadImageComponent, UploadFilesDirectiveDirective],
  imports: [
    CommonModule,
    UploadImageRoutingModule
  ]
})
export class UploadImageModule { }
