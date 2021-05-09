import {User} from '@shared/models/user.interface';
import {EventEmitter, Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {RoleValidator} from '@auth/helpers/roleValidator';
import SwAlert from 'sweetalert2';

@Injectable({providedIn: 'root'})
export class AuthService extends RoleValidator {
  public numCartsUser$ = new EventEmitter<number>(); // Evento que emite el número de carros del usuario
  public user$: Observable<User>;
  private UsersCollection: AngularFirestoreCollection<User>; // Le paso los users que hay en Firenbase
  private UserDoc: AngularFirestoreDocument<User>; // Le paso los un user desde Firenbase

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    super();
    this.UsersCollection = afs.collection<User>('Users_loguin'); // Le paso a la colección de la app la colección almacena en la BD
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`Users_loguin/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  async loginGoogle(): Promise<User> {
    try {
      const {user} = await this.afAuth.signInWithPopup(
        new auth.GoogleAuthProvider()
      );
      this.updateUserData(user);
      return user;
    } catch (error) {
      this.onError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

  async sendVerificationEmail(): Promise<void> {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const {user} = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      this.updateUserData(user); // TODO: No siempre llamar acá , asinar role, primero
      return user;
    } catch (error) {
      this.onError(error);
    }
  }

  async register(email: string, password: string): Promise<User> {
    try {
      const {user} = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      await SwAlert.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: `<span>${error.message}</span>`
      });
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  getOneUser(idUser: string): Observable<User> {
    this.UserDoc = this.afs.doc<User>(`Users_loguin/${idUser}`);
    return this.user$ = this.UserDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        // const User = action.payload.data() as User;
        // User.uid = action.payload.id;
        return action.payload.data() as User;
      }
    }));
  }

  getAllUsers(): Observable<User[]> { // Devuelvo todos los items almacenados en la BD
    return this.UsersCollection.snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return {id, ...data};
          })
        )
      );
  }

  public updateUserData(userToUpdate: User) {
    const ADMIN1 = 'jaidiver.gomez@udea.edu.co';
    const ADMIN2 = 'yeni.hernandez@udea.edu.co';
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `Users_loguin/${userToUpdate.uid}`
    );
    this.getOneUser(userToUpdate.uid).subscribe(user => { // Se busca si existe el usuario en la base de datos
      // tslint:disable-next-line:max-line-length
      const data: User = { // No se utiliza directmante el metodo update de Firestore, porque hay que estar actualizando constantemente la información del usurio desde Google
        uid: userToUpdate.uid,
        email: userToUpdate.email,
        displayName: userToUpdate.displayName ? userToUpdate.displayName : null,
        emailVerified: userToUpdate.emailVerified,
        photoURL: userToUpdate.photoURL,
        role: (userToUpdate.email === ADMIN1 || userToUpdate.email === ADMIN2) ? 'ADMIN' : 'SUSCRIPTOR',
        cartsId: [] = []
      };
      if (user) { // Si el usuario existe en la base de datos, entonces pasa a actulizar el campo 'cartsId' si es necesario
        data.cartsId = userToUpdate.cartsId ? userToUpdate.cartsId : user.cartsId;
      }
      try {
        return userRef.set(data, {merge: true}); // Actuliza la data del usuario en el base de datos
      } catch (error) { // Captura, si se preseta, un error con el upadate
        this.onError(error);
      }
    });
  }

  async userDelete(user: User) { // TODO: Refactorizar
    this.UserDoc = this.afs.doc<User>(`Users_loguin/${user.uid}`);
    try {
      // if (user.password) {
      //   this.afAuth.signInWithEmailAndPassword(user.email, user.password)
      //     .then(function (info) {
      //       var user = this.afAuth.auth().currentUser;
      //       user.delete();
      //     });
      // }else{

      // }
      return await this.UserDoc.delete();
    } catch (error) {
      this.onError(error);
    }
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(auths => auths));
  }

  onError(error) {
    SwAlert.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: `<span>${error.message}</span>`
    }).then();
  }

}
