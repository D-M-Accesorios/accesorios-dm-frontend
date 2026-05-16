import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AdminComponent } from './pages/admin/admin.component';


export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'catalogo', component: CatalogComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];