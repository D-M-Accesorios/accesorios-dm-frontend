import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Asegúrate de que esté esta línea
import { FooterComponent } from './components/footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent], // Y que esté agregado aquí
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'accesorios-dm-frontend-web';
}
