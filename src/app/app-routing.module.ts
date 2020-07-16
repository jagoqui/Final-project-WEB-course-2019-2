import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendEmailComponent } from './auth/send-email/send-email.component';
import { CanAdminGuard } from './auth/guards/can-admin.guard';
import { CanEditGuard } from './auth/guards/can-edit.guard';
import { CanSuscriptorGuard } from './auth/guards/can-suscriptor.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'store', loadChildren: () => import('./store/store.module').then(m => m.StoreModule) },
  { path: 'about', loadChildren: () => import('./Guest/about/about.module').then(m => m.AboutModule) },
  { path: 'editor', loadChildren: () => import('./editor/editor.module').then((m) => m.EditorModule), canActivate: [CanEditGuard] },
  { path: 'suscriptor', loadChildren: () => import('./suscriptor/suscriptor.module').then((m) => m.SuscriptorModule), canActivate: [CanAdminGuard, CanSuscriptorGuard] }, //TODO: Agregar multiple guards
  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule) },
  { path: 'verification-email', component: SendEmailComponent },
  { path: 'profile', loadChildren: () => import('@admin/profile/profile.module').then((m) => m.ProfileModule), canActivate: [CanAdminGuard, CanSuscriptorGuard] },
  { path: 'forgot-password', loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  { path: 'store-items', loadChildren: () => import('./admin/store-items/store-items.module').then(m => m.StoreItemsModule), canActivate: [CanAdminGuard] },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [CanAdminGuard] },
  { path: 'usersList', loadChildren: () => import('./admin/users-list/users-list.module').then(m => m.UsersListModule) },
  { path: '**', loadChildren: () => import('@shared/Modules/page404/page404.module').then((m) => m.Page404Module) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
