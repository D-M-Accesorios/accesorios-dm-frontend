import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Asegúrate de que esté esta línea

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Y que esté agregado aquí
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'accesorios-dm-frontend-web';
}
