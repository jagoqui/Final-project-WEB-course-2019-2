import { Component, OnInit } from '@angular/core';
import { StorageService } from '@shared/uploadFiles/services/storage.service';
import { ItemsDBService } from '@admin/services/items-db.service'
import { Router } from '@angular/router';
import { Item } from '@admin/models/item.interface'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store-items',
  templateUrl: './store-items.component.html',
  styleUrls: ['./store-items.component.scss'],
  providers: [StorageService]
})
export class StoreItemsComponent implements OnInit {
  public Items$: Observable<Item[]>;
  public newItem$: Observable<Item>;

  constructor(private readonly storageSvc: StorageService, private itemDB: ItemsDBService, private router: Router,) { }

  onDeleteItem(item: Item): void {
    const confirmation = confirm('Are you sure?. Data user can´t will recovered');
    if (confirmation) {
      this.itemDB.deleteUser(item.id);
    }
  }

  onUpdateItem(item: Item): void {
    // this.router.navigate(['/createNewItem', item.id]);
  }

  ngOnInit(): void {
    this.Items$ = this.itemDB.getAllUsers();
  }

}
