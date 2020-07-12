import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ImageValidator } from '@shared/uploadFiles/helpers/imageValidator';
import { FileItem } from '@shared/uploadFiles/models/file-item.ts';

@Directive({
  selector: '[appUploadFilesDirective]'
})
export class UploadFilesDirectiveDirective extends ImageValidator {
  //Comunicación entre el componente que utilice el selector 'appUploadFilesDirective' (ésta directiva)
  @Input() files: FileItem[] = []; //Recibe información de los ficheros cargados
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter(); //Enviar información de los eventos generados
  @Output() imageSrc: EventEmitter<string | ArrayBuffer | null> = new EventEmitter();

  @HostListener('dragover', ['$event']) //Decorador para 'onDragEnter'
  onDragEnter(event: Event) { //Detecta cuando entra el mouse entró
    this.avoidOpeningBrowser(event); //Evita que se abra el navegador al activarse el evento
    this.mouseOver.emit(true); //Emite que el mouse entró
  }

  @HostListener('dragleave', ['$event']) //Decorador para 'onDragLeave'
  onDragLeave() { //Detecta cuando salga el mouse
    this.mouseOver.emit(false); //Emite que se mouse salió
  }

  @HostListener('drop', ['$event']) //Decorador para 'onDrop'
  onDrop(event: Event) { //Detecta cuando se arrastra un fichero al contenedor
    const dataTransfer = this.getDataTransfer(event); //Obtiene la data del fichero transferido
    if (!dataTransfer) { //Si hay algún error en la transferecia
      return; //Detiene el flujo del programa
    }
    this.avoidOpeningBrowser(event);
    this.extractFiles(dataTransfer.files); //Extrae lo ficheros de la tranferencia
    this.mouseOver.emit(false); //Emite que se mouse salió
  }

  @HostListener('change', ['$event']) //Decorador para 'onDrop'
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.extractFiles(event.target.files); //Extrae lo ficheros de la tranferencia
      const file = event.target.files[0]; //Obtine el primer archivo
      const reader = new FileReader(); //TODO: Posiblemente haya redundancia al crear un archivo, teniendo ya a 'this.files'
      reader.onload = e => this.imageSrc.emit( reader.result); //Obtine el src del fichero
      reader.readAsDataURL(file);
    }
  }

  private getDataTransfer(event: any) { //Obtiene la data del fichero transferido si no hay errores
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer
  }

  private extractFiles(fileList: FileList): void { //Extrae los archivos de la lista de archivos cargados (FileList, es un tipo de dato de TS)
    for (const property in Object.getOwnPropertyNames(fileList)) {
      const tempFile = fileList[property];
      if (this.canBeUploaded(tempFile)) {
        const newFile = new FileItem(tempFile);
        this.files.push(newFile);
      }
    }
  }

  private canBeUploaded(file: File): boolean { //Devuelve true para indicar que se puede subir el  arrastrado, si este cumple con con las validaciones (File hace referencia a el tipo de dato de TS, tipo 'File')
    if (!this.checkDropped(file.name, this.files) && this.validateType(file.type)) {
      return true;
    } else {
      return false;
    }
  }

  private avoidOpeningBrowser(event: Event) { //Evita que el navegador se abra cuando se arrastra un fichero
    event.preventDefault();
    event.stopPropagation();
  }
}

