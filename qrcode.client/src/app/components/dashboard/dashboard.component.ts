import { Component, OnInit } from '@angular/core';
import { QrcodeService, Qrcode } from '../../services/qrcode.service';
import { AuthService } from '../../services/auth.service'; // AUTH SERVICE EKLENDİ
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  qrcodes: Qrcode[] = [];
  newUrl: string = '';
  isAdmin: boolean = false; // KULLANICI YETKİSİNİ TUTACAĞIMIZ DEĞİŞKEN

  constructor(
    private qrcodeService: QrcodeService,
    private authService: AuthService, // İÇERİ AKTARILDI
    private router: Router
  ) { }

  ngOnInit(): void {
    // Sayfa açıldığında kişinin yetkisini kontrol et
    this.isAdmin = this.authService.isAdmin();

    this.loadQrcodes();
  }

  // Listeyi Backend'den Çekme
  loadQrcodes(): void {
    this.qrcodeService.getAll().subscribe({
      next: (data) => this.qrcodes = data,
      error: (err) => console.error('Veriler yüklenirken hata oluştu:', err)
    });
  }

  // Yeni QR Kod Ekleme
  createQrcode(): void {
    if (!this.newUrl.trim()) return;

    const newQr: Qrcode = {
      id: 0,
      url: this.newUrl,
      // Tarayıcının kendi kütüphanesini kullanarak benzersiz bir şifreli metin (GUID) üretiyoruz
      guid: crypto.randomUUID(),
      active: true
    };

    this.qrcodeService.create(newQr).subscribe({
      next: () => {
        this.newUrl = '';
        this.loadQrcodes(); // Listeyi güncelle
      },
      error: (err) => {
        console.error('Ekleme hatası:', err);
        alert('Ekleme başarısız oldu. Lütfen konsolu kontrol edin.');
      }
    });
  }

  // QR Kod Silme
  deleteQrcode(id: number): void {
    if (confirm('Bu QR kodu silmek istediğinize emin misiniz?')) {
      this.qrcodeService.delete(id).subscribe({
        next: () => this.loadQrcodes(),
        error: (err) => console.error('Silme hatası:', err)
      });
    }
  }

  // Çıkış Yapma
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
