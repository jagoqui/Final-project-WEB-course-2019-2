import { Observable } from 'rxjs';
export class FileItem {
  public name: string;
  public fileSrc?: String | ArrayBuffer | null = null;
  public uploading = false;
  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;

  constructor(public file: File = file) { //Le pasa como para
    this.name = file.name;
  }

  get_downloadURL() : any{
    return this.downloadURL;
  }
}
