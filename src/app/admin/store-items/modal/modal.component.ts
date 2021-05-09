import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import SwAlert from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  onCloseEventReceived = false; // Detecta el evento de cerrar modal desde 'app-add-item'

  constructor(public dialog: MatDialogRef<ModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(close: boolean){
    if (close) {
      this.dialog.close();
    }
  }
  isClose(){
    SwAlert.fire({
      title: 'Are you sure?',
      text: 'Changes will not be saved!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.value) {
        SwAlert.fire(
          {
            icon: 'error',
            title: 'Cancelled!',
            showConfirmButton: false,
            timer: 1500
          }
        );
        this.onClose(true);
      }
    });
  }
  ngOnInit() {
  }

}
