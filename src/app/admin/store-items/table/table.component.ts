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
  titlesContainer: string[] = ['Added','Name', 'Category', 'Quantity', 'Available', 'Price', 'Actions'];
  expandedElement: Item | null;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private itemDB: ItemsDBService, public dialog: MatDialog) { }

  onAddItem(){
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
          SwAlert.fire('Deleted!', 'Your  post has been deleted.', 'success');
        }).catch((error) => {
          SwAlert.fire('Error!', 'There was an error deleting this post', 'error');
        });
      }
    });
  }

  onUpdateItem(item: Item): void {
    // SwAlert.fire({
    //   title: 'Custom width, padding, background.',
    //   width: 600,
    //   padding: '3em',
    //   background: '#fff url(/images/trees.png)',
    //   backdrop: `
    //     rgba(0,0,123,0.4)
    //     url("assets/images/nyan-cat.gif")
    //     left top
    //     no-repeat
    //   `
    // });
    this.openDialog(item);
  }

  openDialog(item?: Item): void {
    const config = {
      data: {
        action: item ? 'UPDATE' : 'ADD',
        content: item
      }
    };
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

  ngOnInit(): void {
    this.itemDB.getAllItems().subscribe(items => this.dataSource.data = items);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
