import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { FileItem } from '@shared/uploadFiles/models/file-item.ts';

@Injectable()
export class StorageService {
  private MEDIA_STORAGE_PATH; //Path para los ficheros en firebase

  constructor(private readonly storage: AngularFireStorage) {}

  uploadImage(images: FileItem[], path) { //Sube los ficheros al storage de firebase
    this.MEDIA_STORAGE_PATH = 'images/' + path; //Crea subdirectorios para almacenar los ficheros
    for (const item of images) {
      item.uploading = true;
      const filePath = this.generateFileName();
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, item.file);
      item.uploadPercent = task.percentageChanges();
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            item.downloadURL = fileRef.getDownloadURL();
            item.uploading = false;
          })
        )
        .subscribe();
    }
  }

  private generateFileName(): string { //Genera un nombre aleatorio para los ficheros
    const id = Math.random().toString(36).substring(2);
    return `${this.MEDIA_STORAGE_PATH}/${id}`;
  }
}
