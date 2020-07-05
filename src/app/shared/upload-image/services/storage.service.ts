import { Injectable } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { FileItem } from '@shared/upload-image/models/file-item';

@Injectable()
export class StorageService {
  private MEDIA_STORAGE_PATH = 'images';

  constructor(private readonly storage: AngularFireStorage) {}

  uploadImage(images: FileItem[]) {
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
  private generateFileName(): string {
    const id = Math.random().toString(36).substring(2);
    return `${this.MEDIA_STORAGE_PATH}/${id}`;
  }
}
