import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7118/api/Auth'; 

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.role; // Backend'den "1" (Admin) veya "2" (User) olarak geliyor
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === '1';
  }
  // Token'ı çözüp giriş yapan kişinin ID'sini (nameid) okuyan fonksiyon
  getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // .NET Identity, id'yi 'nameid' olarak gömer. Bunu sayıya çeviriyoruz.
        return parseInt(decodedToken.nameid, 10);
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}
