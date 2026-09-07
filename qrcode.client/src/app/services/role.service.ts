import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = 'https://localhost:7118/api/Role'; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  create(role: any): Observable<any> { return this.http.post(this.apiUrl, role); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
