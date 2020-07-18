import { User } from '@shared/models/user.interface';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { RoleValidator } from '@auth/helpers/roleValidator';

@Injectable({ providedIn: 'root' })
export class AuthService extends RoleValidator {
  private UsersCollection: AngularFirestoreCollection<User>; // Le paso los users que hay en Firenbase
  Users: Observable<User[]>; // Observo los user
  private UserDoc: AngularFirestoreDocument<User>; // Le paso los un user desde Firenbase
  public user$: Observable<User>;

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
      const { user } = await this.afAuth.signInWithPopup(
        new auth.GoogleAuthProvider()
      );
      this.updateUserData(user);
      return user;
    } catch (error) {
      console.log("Error in login with Google :> ", error);
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
      const { user } = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      this.updateUserData(user); //TODO: No siempre llamar acá , asinar role, primero
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async register(email: string, password: string): Promise<User> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      console.log(error);
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
        const User = action.payload.data() as User;
        User.uid = action.payload.id;
        return User;
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
            return { id, ...data };
          })
        )
      );
  }

  public updateUserData(user: User) {
    const ADMIN1 = 'jaidiver.gomez@udea.edu.co';
    const ADMIN2 = 'yenni.hernandez@udea.edu.co'
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `Users_loguin/${user.uid}`
    );
    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: (user.email == ADMIN1 || user.email == ADMIN2) ? 'ADMIN' : 'SUSCRIPTOR',
    };
    return userRef.set(data, { merge: true });
  }

  async userDelete(user: User) { //TODO: Refactorizar
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
      console.log("Error deleting item :> ", error);
    }
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(auths => auths));
  }

}
