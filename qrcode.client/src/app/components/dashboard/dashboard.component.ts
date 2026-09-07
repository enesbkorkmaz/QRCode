import { Component, OnInit } from '@angular/core';
import { QrcodeService, Qrcode } from '../../services/qrcode.service';
import { AuthService } from '../../services/auth.service'; // YENİDEN EKLENDİ
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  qrcodes: Qrcode[] = [];
  newUrl: string = '';

  // YENİDEN EKLENDİ: Rol kontrol değişkeni
  isAdmin: boolean = false;

  constructor(
    private qrcodeService: QrcodeService,
    private authService: AuthService, // YENİDEN EKLENDİ
    private router: Router
  ) { }

  ngOnInit(): void {
    // YENİDEN EKLENDİ: Giriş yapan kişinin Admin olup olmadığını anlıyoruz
    this.isAdmin = this.authService.isAdmin();

    this.loadQrcodes();
  }

  loadQrcodes(): void {
    this.qrcodeService.getAll().subscribe({
      next: (data) => this.qrcodes = data,
      error: (err) => console.error('Veriler yüklenirken hata oluştu:', err)
    });
  }

  createQrcode(): void {
    if (!this.newUrl.trim()) {
      Swal.fire('Uyarı', 'Lütfen yönlendirilecek bir URL girin!', 'warning');
      return;
    }

    const newQr: Qrcode = { id: 0, url: this.newUrl, active: true };

    this.qrcodeService.create(newQr).subscribe({
      next: () => {
        Swal.fire({
          title: 'Eklendi!',
          text: 'Yeni QR Kod başarıyla oluşturuldu.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.newUrl = '';
        this.loadQrcodes();
      },
      error: (err) => Swal.fire('Hata!', 'QR Kod eklenirken bir sorun oluştu.', 'error')
    });
  }

  deleteQrcode(id: number): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu QR kod kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.qrcodeService.delete(id).subscribe({
          next: () => {
            Swal.fire('Silindi!', 'QR Kod sistemden kaldırıldı.', 'success');
            this.loadQrcodes();
          },
          error: (err) => Swal.fire('Hata!', 'Silme işlemi başarısız oldu.', 'error')
        });
      }
    });
  }

  // Durumu (Aktif/Pasif) Değiştirme Fonksiyonu
  toggleStatus(item: Qrcode): void {
    const updatedItem = { ...item, active: !item.active }; // Durumu tersine çevir

    this.qrcodeService.update(item.id, updatedItem).subscribe({
      next: () => {
        Swal.fire({
          title: 'Güncellendi!',
          text: `QR Kod durumu ${updatedItem.active ? 'Aktif' : 'Pasif'} yapıldı.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.loadQrcodes(); // Tabloyu yenile
      },
      error: (err) => Swal.fire('Hata!', 'Durum güncellenemedi.', 'error')
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
