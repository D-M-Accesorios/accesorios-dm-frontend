import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  correo: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  nombre: string;
  correo: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl =
    'http://localhost:8889/api/v1/auth/login';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.apiUrl,
      data
    );
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem(
      'access_token',
      response.access_token
    );

    localStorage.setItem(
      'admin_user',
      JSON.stringify(response)
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin_user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

 isAdmin(): boolean {
  const user = localStorage.getItem('admin_user');

  if (!user) {
    return false;
  }

  const parsedUser = JSON.parse(user);
  const role = String(parsedUser.rol ?? '').trim().toUpperCase();

  return role === 'ADMIN';
}
}