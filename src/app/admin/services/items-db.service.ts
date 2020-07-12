import { Injectable } from '@angular/core';
import { Item } from '../../admin/models/item.interface'
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators'; // Para hacer mapeo entre valores
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ItemsDBService {
  private ItemsCollection: AngularFirestoreCollection<Item>; // Le paso los items que hay en Firenbase
  Items: Observable<Item[]>; // Observo los items
  private ItemDoc: AngularFirestoreDocument<Item>; // Le paso los un item desde Firenbase
  Item: Observable<Item>; // Observo el item

  constructor(private afs: AngularFirestore) {
    this.ItemsCollection = afs.collection<Item>('Items'); // Le paso a la colección de la app la colección almacena en la BD
    this.Items = this.ItemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))); // Hace una captura del id y todo los dato de cada item de la coleccón.
  }

  getOneUser(idItem: string): Observable<Item> {
    this.ItemDoc = this.afs.doc<Item>(`Items/${idItem}`);
    return this.Item = this.ItemDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const Item = action.payload.data() as Item;
        Item.id = action.payload.id;
        return Item;
      }
    }));
  }

  getAllUsers(): Observable<Item[]> { // Devuelvo todos los items almacenados en la BD
    return this.ItemsCollection.snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Item;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  async addItem(newItem: Item) {
    try {
      return await this.ItemsCollection.add(newItem);
    } catch (error) {
      console.log("Error in add new item :> ",error);
    }
  }

  async updateUser(item: Item) {
    const idItem = item.id;
    this.ItemDoc = this.afs.doc<Item>(`Items/${idItem}`);
    try {
      return await this.ItemDoc.update(item);
    } catch (error) {
      console.log("Error updating item :> ",error);
    }
  }

  async deleteUser(idItem: string){
    this.ItemDoc = this.afs.doc<Item>(`Items/${idItem}`);
    try {
      return await this.ItemDoc.delete();
    } catch (error) {
      console.log("Error deleting item :> ",error);
    }
  }
}
