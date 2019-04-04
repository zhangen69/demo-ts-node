import { UserFormComponent } from './user/user-form/user-form.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { UserListComponent } from './user/user-list/user-list.component';

const routes: Routes = [
  { path: 'product', canActivate: [AuthGuard], children: [
    { path: 'list', component: ProductListComponent },
    { path: 'add', component: ProductFormComponent },
    { path: 'edit/:id', component: ProductFormComponent },
  ]},
  { path: 'user', canActivate: [AuthGuard], children: [
    { path: 'list', component: UserListComponent },
    { path: 'add', component: UserFormComponent },
    { path: 'edit/:id', component: UserFormComponent },
  ]},
  { path: 'auth', children: [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
  ]},
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
