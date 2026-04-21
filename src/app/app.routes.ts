import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { CartComponent } from './pages/cart/cart.component';
// 1. AGREGA ESTA IMPORTACIÓN
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'cart', component: CartComponent },
  // 2. AGREGA ESTA RUTA PARA EL BOTÓN
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
