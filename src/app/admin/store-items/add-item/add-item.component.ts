import { Component, OnInit, Input } from '@angular/core';
import { Item } from '@admin/models/item.interface'
import { FormGroup, Validators, FormControl, FormArray, Form } from '@angular/forms';
import { StorageService } from '@shared/uploadFiles/services/storage.service';
import { ItemsDBService } from '@admin/services/items-db.service';
import { FileItem } from '@shared/uploadFiles/models/file-item';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  providers: [StorageService]
})
export class AddItemComponent implements OnInit {
  @Input() item?: Item; //Recibe el item a editar
  addItemForm: FormGroup;
  descountPattern = '/^-?[0-100]\d*(\.\d+)?$/';
  itemImages: FileItem[] = []; //Crea un objeto tipo FileItem para la imagens del item
  imagesSrc: String[] | ArrayBuffer[] | null = [];
  isOverDrop = false;

  constructor(private itemDB: ItemsDBService, private storageSvc: StorageService) { }

  createFormGroup() {
    return new FormGroup({
      name: new FormControl(this.item ? this.item.name : '', [Validators.required]),
      description: new FormControl(this.item ? this.item.description : '', [Validators.required, Validators.minLength(20)]),
      category: new FormControl(this.item ? this.item.category : '', [Validators.required]),
      promotionalCode: new FormControl(this.item ? this.item.promotionalCode : '', [Validators.min(15), Validators.max(15)]),
      discount: new FormControl(this.item ? this.item.discount : '', [Validators.pattern(this.descountPattern)]),
      available: new FormControl(this.item ? this.item.available : '', [Validators.required]),
      price: new FormControl(this.item ? this.item.available : '', [Validators.required, Validators.min(0)]),
      quantity: new FormControl(this.item ? this.item.quantity : '', [Validators.required, Validators.min(1)]),
      photosURL: new FormControl(this.item ? this.item.photosURL : [], [Validators.required]),
      createDate: new FormControl(this.item ? this.item.createDate : '')
    });
  }

  addItem(item: Item) {
  }

  deleteItemImage(pos: number){ //Elimina un fichero del arreglo de ficheros
    let auxFileItem: FileItem[]=[];
    let auxImageSrc: any[] = [];
    for (let i = 0; i < this.itemImages.length; i++) {
      if(i!=pos){
        auxFileItem.push(this.itemImages[i]);
        auxImageSrc.push(this.imagesSrc[i]);
      }
    }
    this.itemImages = [];
    this.itemImages = [...auxFileItem];
    this.imagesSrc = [];
    this.imagesSrc = [...auxImageSrc];
  }

  onUpload(): void {
    this.storageSvc.uploadImage(this.itemImages, 'items');
  }

  ngOnInit(): void {
    this.addItemForm = this.createFormGroup();
  }

  get_ImageName(image: FileItem, hide: number){
    if(hide==0)
      return image.name;
  }
}
