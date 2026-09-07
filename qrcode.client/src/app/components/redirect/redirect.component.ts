import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QrcodeService } from '../../services/qrcode.service';

@Component({
  selector: 'app-redirect',
  standalone: false,
  // Bembeyaz sayfa yerine durum kodlarına göre çalışan şık bir tasarım ekledik
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background-color: #f8f9fa;">
      <h2 *ngIf="status === 'loading'" style="color: #007bff;">Yönlendiriliyorsunuz... 🚀</h2>
      
      <div *ngIf="status === 'passive'" style="text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #dc3545; font-size: 3rem; margin-top:0;">⚠️</h1>
        <h2 style="color: #343a40;">Erişim Engellendi</h2>
        <p style="color: #6c757d;">Bu QR Kod sistem yöneticisi tarafından devre dışı bırakılmıştır.</p>
      </div>

      <div *ngIf="status === 'error'" style="text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #dc3545; font-size: 3rem; margin-top:0;">❌</h1>
        <h2 style="color: #343a40;">Bulunamadı</h2>
        <p style="color: #6c757d;">Geçersiz veya süresi dolmuş bir QR Kod okuttunuz.</p>
      </div>
    </div>
  `
})
export class RedirectComponent implements OnInit {
  status: 'loading' | 'passive' | 'error' = 'loading';

  constructor(
    private route: ActivatedRoute,
    private qrcodeService: QrcodeService
  ) { }

  ngOnInit(): void {
    const guid = this.route.snapshot.paramMap.get('guid');

    if (guid) {
      this.qrcodeService.getByGuid(guid).subscribe({
        next: (data) => {
          // İŞ MANTIĞI: Sadece aktifse yönlendir!
          if (data.active) {
            window.location.href = data.url;
          } else {
            this.status = 'passive'; // Kodu durdur ve uyarı ekranını göster
          }
        },
        error: () => this.status = 'error'
      });
    } else {
      this.status = 'error';
    }
  }
}
