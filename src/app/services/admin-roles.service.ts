import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminRole {
  id_rol: number;
  nombre: string;
  descripcion?: string;
}

export interface RoleRequest {
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminRolesService {
  private readonly apiUrl = 'http://localhost:8889/api/v1/roles/';

  constructor(private readonly http: HttpClient) {}

  getRoles(): Observable<AdminRole[]> {
    return this.http.get<AdminRole[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  createRole(role: RoleRequest): Observable<AdminRole> {
    return this.http.post<AdminRole>(this.apiUrl, role, {
      headers: this.getHeaders()
    });
  }

  updateRole(id: number, role: Partial<RoleRequest>): Observable<AdminRole> {
    return this.http.put<AdminRole>(`${this.apiUrl}${id}`, role, {
      headers: this.getHeaders()
    });
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`, {
      headers: this.getHeaders()
    });
  }

  assignRoleToEmployee(employeeId: number, roleId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}${employeeId}/rol/${roleId}`, {}, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') ?? '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}