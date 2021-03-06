import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import SwAlert from 'sweetalert2';
import {ImageValidator} from '../helpers/ImageValidator';
import {FileItem} from '../models/file-item';

@Directive({
  selector: '[appUploadFilesDirective]'
})
export class UploadFilesDirectiveDirective extends ImageValidator {
  // Comunicación entre el componente que utilice el selector 'appUploadFilesDirective' (ésta directiva)
  @Input() files: FileItem[] = []; // Recibe información de los ficheros cargados
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter(); // Enviar información de los eventos generados
  @Output() fileSrc: EventEmitter<string | ArrayBuffer | null> = new EventEmitter();

  private static avoidOpeningBrowser(event: Event) { // Evita que el navegador se abra cuando se arrastra un fichero
    event.preventDefault();
    event.stopPropagation();
  }

  private static getDataTransfer(event: any) { // Obtiene la data del fichero transferido si no hay errores
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  @HostListener('dragover', ['$event']) // Decorador para 'onDragEnter'
  onDragEnter(event: Event) { // Detecta cuando entra el mouse entró
    UploadFilesDirectiveDirective.avoidOpeningBrowser(event); // Evita que se abra el navegador al activarse el evento
    this.mouseOver.emit(true); // Emite que el mouse entró
  }

  @HostListener('dragleave', ['$event']) // Decorador para 'onDragLeave'
  onDragLeave() { // Detecta cuando salga el mouse
    this.mouseOver.emit(false); // Emite que se mouse salió
  }

  @HostListener('drop', ['$event']) // Decorador para 'onDrop'
  onDrop(event: any) { // Detecta cuando se arrastra un fichero al contenedor
    const dataTransfer = UploadFilesDirectiveDirective.getDataTransfer(event); // Obtiene la data del fichero transferido
    if (!dataTransfer) { // Si hay algún error en la transferecia
      return; // Detiene el flujo del programa
    }
    UploadFilesDirectiveDirective.avoidOpeningBrowser(event);
    this.extractFiles(event, dataTransfer.files); // Extrae lo ficheros de la tranferencia
    this.mouseOver.emit(false); // Emite que se mouse salió
  }

  get_FileSrc(file: any) { // Obtiene el src de cada fichero cargado
    const reader = new FileReader(); // TODO: Posiblemente haya redundancia al crear un archivo, teniendo ya a 'this.files'
    reader.onload = () => {
      this.fileSrc.emit(reader.result);
    }; // Obtine el src del fichero
    reader.readAsDataURL(file); // Asocia cada fichero a un data url
  }

  @HostListener('change', ['$event']) // Decorador para 'onChange'
  // tslint:disable-next-line:max-line-length
  private extractFiles(event: any, fileList?: FileList): void { // Extrae los archivos de la lista de archivos cargados (FileList, es un tipo de dato de TS)
    // tslint:disable-next-line:max-line-length variable-name
    const filesList_aux = fileList ? fileList : event.target.files; // Si la función fue activada por el evento de change, le pasa los ficheros desde el evento, sino si fue activada por onDrop, los pasa desde dataTransfer
    // tslint:disable-next-line:forin
    for (const property in Object.getOwnPropertyNames(filesList_aux)) { // Recorre todos los ficheros
      const tempFile = filesList_aux[property]; // Obtiene la data de cada fichero
      if (this.canBeUploaded(tempFile)) { // Verifica que la imagenes si cumpla las validaciones
        const newFile = new FileItem(tempFile); // Crea un nuevo fichero
        this.files.push(newFile); // Se lo agrega a files
        this.get_FileSrc(tempFile); // Obtiene el src local de cada fichero cargado
      }
    }
  }

  // tslint:disable-next-line:max-line-length
  private canBeUploaded(file: File): boolean { // Devuelve true para indicar que se puede subir el  arrastrado, si este cumple con con las validaciones (File hace referencia a el tipo de dato de TS, tipo 'File')
    // tslint:disable-next-line:max-line-length
    if (!this.checkDropped(file.name, this.files) && this.validateType(file.type)) { // Valida que solo se pueda subir un archivo con el mismo nombre y que cumpla las validaciones de la case 'fileValidar'
      return true;
    } else {
      SwAlert.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<span>Remember not to upload duplicate files or files that do not comply with the following format: png, jpeg</span>'
      }).then();
      return false;
    }
  }


}

