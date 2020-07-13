import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {UploadFilesDirectiveDirective} from '@shared/uploadFiles/directives/upload-files-directive.directive';
import { MaterialModule } from '@app/material.module'; //Toca importal de nuevo acá porque el app.module no tiene acceso a esta carpeta compartida

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [UploadFilesDirectiveDirective],
  // providers: [MySharedService],
  exports: [UploadFilesDirectiveDirective],
 })
 export class SharedModule { }
