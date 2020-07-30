import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { ItemsDBService } from '@admin/services/items-db.service';
import { Item } from '@admin/models/item.interface'
import { Cart } from '../cart/models/cart.interface';
import { CartDbService } from '../cart/services/cart-db.service'
import { User } from '@shared/models/user.interface';
import SwAlert from 'sweetalert2';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {

  public Items$: Observable<Item[]>
  isUserLoguin: boolean = false;
  onNewItems = false;
  onNewCart = false;
  user: User = {
    uid: null,
    email: null,
    emailVerified: null,
    cartsId: null,
  }
  cart: Cart = {
    itemsId: [],
    numItems: null,
    totalPay: null,
    isPaid: false,
    isBilled: false,
    dateCreate: null,
    dateLastUpdate: null
  };

  constructor(private itemDB: ItemsDBService, private autSvc: AuthService, private cartDB: CartDbService, private router: Router) { }

  async onAddCart(item?: Item) {
    if (item) {
      if (this.isUserLoguin) { //Si hay algun usaurio logueado
        this.cart.itemsId.push(item.id);
        this.cart.numItems++;
        this.onNewItems = true;
        let numCartsUser = this.user.cartsId.length? this.user.cartsId.length : 1; //Si no hay carritos registrado en el usuario, entoces registra su primer carrito
        this.autSvc.numCartsUser$.emit(numCartsUser); //Muestra el número de carritos que el usuario tiene
        this.cartDB.onCart$.emit(this.cart.numItems);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      SwAlert.fire(
        'Oops selected item no avalaible!',
        'The item is not available at the moment',
        'warning'
      )
    }
  }

  ngOnInit(): void {
    this.Items$ = this.itemDB.getAllItems(); //Obtengo todos lo items
    this.autSvc.isAuth().subscribe(currentUser => { //Obtiene desde el auth de Google de el actual usuario logueado
      if (currentUser) { //Si hay algun usuario logueado
        this.isUserLoguin = true; //Activa la badera de usuario logueado
        this.autSvc.getOneUser(currentUser.uid).subscribe(user => { //Devuelve la data del usaurio logueado
          this.user = user;
          this.cartDB.getOneCart(this.user.cartsId[this.user.cartsId.length - 1]).subscribe(cart => { //Obtinene el último carrito rgistrado por el usuario
            if (cart) { //Si existe al menos un carrito almacenado en el usuario logueado
              if (!cart.isBilled) { //Si el carrito  no ha sido facturado
                this.cart = cart;
              } else { //Si el carriro fue facturado habilita la bandera para agregar otro carrito
                this.onNewCart = true; //Activa la bandera de nuevo carrito
              }
            }else{
              this.user.cartsId[this.user.cartsId.length - 1] = null; //Por si hubo un error con la recuperación del documento correspondiente con el cartId, entonces lo elimina, para evitar errores
              this.autSvc.updateUserData(this.user); //Actuliza la data del usuario
              this.onNewCart = true; //Activa la bandera de nuevo carrito
            }
          });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.onNewItems) { //Si agregó nuevos items
      if (this.onNewCart) { //Si se agrega un nuevo carrito
        const docRef = this.cartDB.addCart(this.cart); //Almacena el nuevo carrito y captura la data del documento
        docRef.then(res => { //Obtine la data data del docuento
          this.cart.dateCreate = new Date(); //Registra la fecha de creación de carrito
          this.cart.dateLastUpdate = this.cart.dateCreate; //Registra la hora de últma actulización
          this.user.cartsId.push(res.id); //Al usuario le pasa el id del nuevo carrito almacenado
          this.autSvc.updateUserData(this.user); //Actualiza la data del usuario
        });
      } else {
        this.cart.dateLastUpdate = new Date(); //Registra la fecha de la última actualización del carrito
        try {
          this.cartDB.updateCart(this.cart); //Actualiza la data del carrito
        } catch (error) {
          console.log('Error in updating cart :> ', error);
          this.cartDB.addCart(this.cart); //Por si el documento correspodiente con ese id no existe ya, entonces se actuliza los daros
        }
      }
    }
  }
}
