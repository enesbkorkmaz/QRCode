import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Backend'deki Qrcode modelimizin TypeScript karşılığı
export interface Qrcode {
  id: number;
  url: string;
  guid?: string;
  createdat?: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QrcodeService {
  // .NET Backend portunuzu kontrol edin (örneğin 7118)
  private apiUrl = 'https://localhost:7118/api/Qrcode';

  constructor(private http: HttpClient) { }

  // Tüm QR kodları getir (GET)
  getAll(): Observable<Qrcode[]> {
    return this.http.get<Qrcode[]>(this.apiUrl);
  }

  // ID'ye göre tek bir QR kod getir (GET)
  getById(id: number): Observable<Qrcode> {
    return this.http.get<Qrcode>(`${this.apiUrl}/${id}`);
  }

  // GUID üzerinden QR kod getir (Yönlendirme için)
  getByGuid(guid: string): Observable<Qrcode> {
    return this.http.get<Qrcode>(`${this.apiUrl}/guid/${guid}`);
  }

  // Yeni QR kod ekle (POST)
  create(qrcode: Qrcode): Observable<Qrcode> {
    return this.http.post<Qrcode>(this.apiUrl, qrcode);
  }

  update(id: number, qrcode: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, qrcode);
  }

  // QR kodu sil (DELETE)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
