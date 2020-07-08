import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {UploadFilesDirectiveDirective} from '@shared/uploadFiles/directives/upload-files-directive.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [UploadFilesDirectiveDirective],
  // providers: [MySharedService],
  exports: [UploadFilesDirectiveDirective],
 })
 export class SharedModule { }
