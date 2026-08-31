import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RedirectComponent } from './components/redirect/redirect.component';

const routes: Routes = [
  // 1. Kullanıcı siteye ilk girdiğinde (boş URL) doğrudan Login sayfasına yönlendir
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // 2. /login yazıldığında LoginComponent'i çalıştır
  { path: 'login', component: LoginComponent },

  // 3. /dashboard yazıldığında DashboardComponent'i çalıştır
  { path: 'dashboard', component: DashboardComponent },

  { path: 'r/:guid', component: RedirectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
