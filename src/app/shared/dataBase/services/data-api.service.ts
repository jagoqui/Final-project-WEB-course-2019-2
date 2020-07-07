// import { Injectable } from '@angular/core';
// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { map, finalize } from 'rxjs/operators'; // Para hacer mapeo entre valores
// import { UserAccessIterface } from '@models/user-access';
// import { Router } from '@angular/router';
// import { AngularFireStorage } from '@angular/fire/storage';
// import { File } from '@models/file';

// @Injectable({
//   providedIn: 'root'
// })
// export class DataApiService {
//   private UsersCollection: AngularFirestoreCollection<UserAccessIterface>; // Le paso los items que hay en Firenbase
//   Users: Observable<UserAccessIterface[]>; // Observo los items
//   private UserDoc: AngularFirestoreDocument<UserAccessIterface>; // Le paso los un item desde Firenbase
//   User: Observable<UserAccessIterface>; // Observo el item
//   resetForm = false;
//   private filePath: any;
//   private downloadURL: string;
//   uploadImagePercent: Observable<number>;
//   constructor(private afs: AngularFirestore, private storage: AngularFireStorage, private router: Router) { // Capturo todos los datos de FireStore
//     this.UsersCollection = afs.collection<UserAccessIterface>('Users'); // Le paso a la colección de la app la colección almacena en la BD
//     this.Users = this.UsersCollection.snapshotChanges().pipe(
//       map(actions => actions.map(a => {
//         const data = a.payload.doc.data() as UserAccessIterface;
//         const id = a.payload.doc.id;
//         return { id, ...data };
//       }))); // Hace una captura del id y todo los dato de cada item de la coleccón.
//   }
//   getOneUser(idUser: string): Observable<UserAccessIterface> {
//     this.UserDoc = this.afs.doc<UserAccessIterface>(`Users/${idUser}`);
//     return this.User = this.UserDoc.snapshotChanges().pipe(map(action => {
//       if (action.payload.exists === false) {
//         return null;
//       } else {
//         const User = action.payload.data() as UserAccessIterface;
//         User.rf_id = action.payload.id;
//         return User;
//       }
//     }));
//   }
//   getAllUsers(): Observable<UserAccessIterface[]> { // Devuelvo todos los usuarios almacenados en la BD
//     return this.UsersCollection.snapshotChanges()
//       .pipe(
//         map(actions =>
//           actions.map(a => {
//             const data = a.payload.doc.data() as UserAccessIterface;
//             const id = a.payload.doc.id;
//             return { id, ...data };
//           })
//         )
//       );
//   }
//   async addUser(newUser: UserAccessIterface) {
//     try {
//       return await this.UsersCollection.add(newUser);
//     } catch (error) {
//       alert(error);
//       this.resetForm = true;
//     }
//   }
//   async updateUser(user: UserAccessIterface) {
//     const idUser = user.rf_id;
//     this.UserDoc = this.afs.doc<UserAccessIterface>(`Users/${idUser}`);
//     try {
//       return await this.UserDoc.update(user);
//     } catch (error) {
//       alert(error);
//       this.resetForm = true;
//     }
//   }
//   deleteUser(idUser: string): void {
//     this.UserDoc = this.afs.doc<UserAccessIterface>(`Users/${idUser}`);
//     this.UserDoc.delete();
//   }
//   public uploadImage(image: File) {
//     const id = Math.random().toString(36).substring(2);
//     this.filePath = `images/${id}`;
//     const fileRef = this.storage.ref(this.filePath);
//     const task = this.storage.upload(this.filePath, image);
//     this.uploadImagePercent = task.percentageChanges();
//     try {
//       task.snapshotChanges().pipe(
//         finalize(() => {
//           fileRef.getDownloadURL().subscribe(urlImage => {
//             this.downloadURL = urlImage;
//           });
//         })
//       ).subscribe();
//       console.log('URL => ', this.downloadURL);
//     } catch (error) {
//       console.log('Error! => ', error);
//     }
//   }
//   async pre_AddAndUpdateUser(newUser: UserAccessIterface, action: string, rf_id: string, photo_url: string, date: Date) {
//     try {
//       newUser.photo_url = photo_url;
//       if (action === 'ADD') {
//         console.log(newUser.photo_url);
//         const userCreate = await this.addUser(newUser);
//         newUser.rf_id = userCreate.id;
//         newUser.date = date;
//         this.updateUser(newUser);
//         if (userCreate) {
//           this.router.navigate(['/listUser', userCreate.id]);
//         } else {
//           // TODO: Eliminar la foto subida
//         }
//       } else {
//         if (this.downloadURL == null) { //No actualiza imagen
//           this.updateUser(newUser);
//         } else {
//           this.updateUser(newUser);
//         }
//         this.router.navigate(['/listUser', rf_id]);
//       }
//     } catch (error) {
//       console.log(`Error in onADD!=>${error}`);
//     }
//   }
//   get_uploadImagePercent() {
//     return this.uploadImagePercent;
//   }
//   deleteImage(photoURL: string) {

//   }
//   get_resetForm() {
//     return this.resetForm;
//   }
//   get_downloadURL() {
//     return this.downloadURL;
//   }
// }

