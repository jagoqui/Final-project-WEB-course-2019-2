import { Component } from '@angular/core';
import { StorageService } from '@shared/uploadFiles/services/storage.service';
import { FileItem } from '@shared/uploadFIles/models/file-item';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  providers: [StorageService],
})
export class UploadImageComponent {
  files: FileItem[] = []; //Crea un arreglo de archivos y los setea en null
  isOverDrop = false;

  constructor(private readonly storageSvc: StorageService) {}

  onUpload(): void {
    this.storageSvc.uploadImage(this.files, 'test');
  }
}
