import {EventEmitter, Injectable} from '@angular/core';
import {Cart} from '../models/cart.interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'; // Para hacer mapeo entre valores
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CartDbService {
  public onCart$ = new EventEmitter<number>();
  Carts: Observable<Cart[]>;
  Cart: Observable<Cart>; // Observo el item
  private CartsCollection: AngularFirestoreCollection<Cart>; // Le paso los items que hay en Firenbase
  private CartDoc: AngularFirestoreDocument<Cart>; // Le paso los un item desde Firenbase

  constructor(private afs: AngularFirestore) {
    this.CartsCollection = afs.collection<Cart>('Carts'); // Le paso a la colección de la app la colección almacena en la BD
    this.Carts = this.CartsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cart;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))); // Hace una captura del id y todo los dato de cada item de la coleccón.
  }

  getOneCart(idItem: string): Observable<Cart> {
    this.CartDoc = this.afs.doc<Cart>(`Carts/${idItem}`);
    return this.Cart = this.CartDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        // const Cart = action.payload.data() as Cart;
        // Cart.id = action.payload.id;
        return action.payload.data() as Cart;
      }
    }));
  }

  getAllCarts(): Observable<Cart[]> { // Devuelvo todos los items almacenados en la BD
    return this.CartsCollection.snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Cart;
            const id = a.payload.doc.id;
            return {id, ...data};
          })
        )
      );
  }

  async addCart(newItem: Cart) {
    try {
      return await this.CartsCollection.add(newItem);
    } catch (error) {
      console.log('Error in add new cart :> ', error);
    }
  }

  async updateCart(item: Cart) {
    const idItem = item.id;
    this.CartDoc = this.afs.doc<Cart>(`Carts/${idItem}`);
    try {
      return await this.CartDoc.update(item);
    } catch (error) {
      console.log('Error updating cart :> ', error);
    }
  }

  async deleteCart(item: Cart) {
    this.CartDoc = this.afs.doc<Cart>(`Carts/${item.id}`);
    try {
      return await this.CartDoc.delete();
    } catch (error) {
      console.log('Error deleting cart :> ', error);
    }
  }
}
