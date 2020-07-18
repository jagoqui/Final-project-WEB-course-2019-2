import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemsDBService } from '@admin/services/items-db.service'
import { Item } from '@admin/models/item.interface'
import SwAlert from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './../modal/modal.component';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['createDate', 'name', 'category', 'quantity', 'available', 'price', 'actions'];
  titlesContainer: string[] = ['Added', 'Name', 'Category', 'Quantity', 'Available', 'Price', 'Actions'];
  expandedElement: Item | null;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private itemDB: ItemsDBService, public dialog: MatDialog) { }

  onAddItem() {
    this.openDialog();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDeleteItem(item: Item): void {
    SwAlert.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.itemDB.deleteItem(item).then(() => {
          SwAlert.fire(
            {
              icon: 'success',
              title: 'Deleted!',
              text: 'Your  item has been deleted.',
              showConfirmButton: false,
              timer: 1500
            }
          )
        }).catch((error) => {
          SwAlert.fire('Error!', 'There was an error deleting this item', error);
        });
      }
    });
  }

  onUpdateItem(item: Item): void {
    this.openDialog(item);
  }

  openDialog(item?: Item): void {
    const config = {
      data: {
        action: item ? 'UPDATE' : 'ADD',
        content: item
      },
      height: 'auto',
      width: '900px',
      disableClose : true,
      autoFocus : true,
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
  }

  ngOnInit(): void {
    this.itemDB.getAllItems().subscribe(items => this.dataSource.data = items);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
