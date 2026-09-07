import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // YENİ EKLENDİ

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    // 1. Boş alan kontrolü
    if (!this.credentials.email || !this.credentials.password) {
      Swal.fire('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi giriniz.', 'warning');
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);

        // 2. Başarılı Giriş Animasyonu
        Swal.fire({
          title: 'Başarılı!',
          text: 'Giriş yapıldı, yönlendiriliyorsunuz...',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        // 3. Hata Yönetimi: Backend'den 403 (Yasaklı/Pasif) geldiyse
        if (err.status === 403) {
          Swal.fire({
            title: 'Hesap Askıya Alındı!',
            text: 'Hesabınız sistem yöneticisi tarafından pasif duruma getirilmiştir. Lütfen yöneticiyle iletişime geçin.',
            icon: 'error',
            confirmButtonText: 'Anladım'
          });
        } else {
          // Yanlış şifre durumu (401 vb.)
          Swal.fire('Giriş Başarısız!', 'E-posta veya şifreniz hatalı.', 'error');
        }
      }
    });
  }
}
