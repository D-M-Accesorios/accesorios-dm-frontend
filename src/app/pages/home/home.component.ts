import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  loginForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  onLogin() {
    console.log("Intentando iniciar sesión...");
    if (this.loginForm.valid) {
      const { correo, password } = this.loginForm.value;

      // Simulación de validación
      if (correo === 'admin@dm.com' && password === '123456') {
        this.router.navigate(['/tienda']); // Te lleva a la imagen de accesorios
      } else {
        alert("Error: El usuario no existe o los datos son incorrectos.");
      }
    } else {
      alert("Por favor, llena los campos correctamente.");
    }
  }
}
