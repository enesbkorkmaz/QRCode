import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://localhost:7118/api/User';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  create(user: any): Observable<any> { return this.http.post(this.apiUrl, user); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
