import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '@admin/models/item.interface'
import { FormGroup, Validators, FormControl, FormArray, Form } from '@angular/forms';
import { StorageService } from '@shared/uploadFiles/services/storage.service';
import { ItemsDBService } from '@admin/services/items-db.service';
import { FileItem } from '@shared/uploadFiles/models/file-item';
import SwAlert from 'sweetalert2';
import { Observable,of } from 'rxjs';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  providers: [StorageService]
})
export class AddItemComponent implements OnInit {
  @Input() itemUpdate: Item; //Recibe el item a editar
  @Input() action: string; //Recibe la acción que debe hacer (Editar o agregar item)
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  addItemForm: FormGroup;
  descountPattern = '/^-?[0-100]\d*(\.\d+)?$/';
  itemImages: FileItem[] = []; //Crea un objeto tipo FileItem para la imagens del item
  imagesSrc: String[] = [];
  isOverDrop = false;
  photosDownloadURL: any[] = [];
  uploadingFilesFinish = false;
  item: Item = {
    photosURL: [],
    name: '',
    description: '',
    category: null,
    promotionalCode: null,
    discount: null,
    available: null,
    price: 0,
    quantity: null,
    createDate: null,
  }

  constructor(private itemDB: ItemsDBService, private storageSvc: StorageService) { }

  createFormGroup() {
    return new FormGroup({
      name: new FormControl(this.itemUpdate ? this.itemUpdate.name : '', [Validators.required]),
      category: new FormControl(this.itemUpdate ? this.itemUpdate.category : '', [Validators.required]),
      promotionalCode: new FormControl(this.itemUpdate ? this.itemUpdate.promotionalCode : '', [Validators.minLength(10), Validators.maxLength(10)]),
      discount: new FormControl(this.itemUpdate ? this.itemUpdate.discount : '', [Validators.min(0), Validators.max(100)]),
      available: new FormControl(this.itemUpdate ? this.itemUpdate.available : '', [Validators.required]),
      price: new FormControl(this.itemUpdate ? this.itemUpdate.price : '', [Validators.required, Validators.min(0)]),
      quantity: new FormControl(this.itemUpdate ? this.itemUpdate.quantity : '', [Validators.required, Validators.min(0)]),
      description: new FormControl(this.itemUpdate ? this.itemUpdate.description : '', [Validators.required, Validators.minLength(10)]),
      photosURL: new FormControl(this.itemUpdate ? this.itemUpdate.photosURL : []),
      createDate: new FormControl(this.itemUpdate ? this.itemUpdate.createDate : '')
    });
  }

  onAddItem() {
    try {
      this.addItemForm.patchValue({'createDate': new Date(), 'photosURL' : this.photosDownloadURL})
      console.log(this.addItemForm.value);
      this.item = this.addItemForm.value;
      if (this.action == 'ADD') {
        this.itemDB.addItem(this.item); //Agrega el item a la base de datos
        SwAlert.fire({
          icon: 'success',
          title: 'Your item has been added',
          showConfirmButton: false,
          timer: 1500
        });
      }else{
        this.itemDB.updateItem(this.item); //Actuliza el item a la base de datos
        SwAlert.fire({
          icon: 'success',
          title: 'Your item has been updated',
          showConfirmButton: false,
          timer: 1500
        });
      }
      this.closeModal.emit(true);
    } catch (error) {
      SwAlert.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: 'Error uploading data of item'
      })
    }
  }

  getImagesURL(aux: any) {
    if (!this.photosDownloadURL.includes(aux)) { //Comprueba si no se ha alamcenado la URL de la imagen
      this.photosDownloadURL.push(aux);
    }
    if (this.photosDownloadURL.length == this.imagesSrc.length) { //Detecta si ya se recuperan todas las URL de las imagenes subidas a Firebase
      this.uploadingFilesFinish = true;
    }
  }

  deleteItemImage(pos: number, itemImages?: FileItem[]) { //Elimina un fichero del arreglo de ficheros
    let auxFileItem: FileItem[] = [];
    let auxImageSrc: any[] = [];
    if (!itemImages) {
      for (let i = 0; i < this.itemImages.length; i++) {
        if (i != pos) {
          auxFileItem.push(this.itemImages[i]);
          auxImageSrc.push(this.imagesSrc[i]);
        }
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
    if(this.itemUpdate){
      // let aux$: Observable<string[]>;
      let i = 0;
      for(const url of this.itemUpdate.photosURL) {
        this.imagesSrc.push(url);
        // aux$ = of(this.itemUpdate.photosURL)
        // this.itemImages.push();
        // this.itemImages[i].downloadURL = aux$[i]
        // i++;
      }
    }
  }

  get_ImageName(image: FileItem, hide: number) {
    if (!hide)
      return image.name;
  }
}
