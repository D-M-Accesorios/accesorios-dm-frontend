import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { CartComponent } from './pages/cart/cart.component'; // Importa el componente

export const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'cart', component: CartComponent }, // <--- Esta es la ruta del carrito
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
