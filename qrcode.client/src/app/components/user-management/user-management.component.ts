import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'; // YENİ: SweetAlert2 kütüphanesini içe aktardık

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isAdmin: boolean = false;
  currentUserId: number | null = null;

  newUser = { email: '', firstname: '', lastname: '', roleid: 2, active: true, pwhash: '123456' };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      Swal.fire('Yetkisiz Erişim!', 'Bu sayfayı görüntüleme yetkiniz yok.', 'error');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.currentUserId = this.authService.getCurrentUserId();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Kullanıcılar yüklenirken hata', err)
    });
  }

  createUser(): void {
    if (!this.newUser.email || !this.newUser.firstname) {
      // ESKİ: alert('Lütfen en azından İsim ve E-posta alanlarını doldurun!');
      Swal.fire('Eksik Bilgi', 'Lütfen İsim ve E-posta alanlarını doldurun!', 'warning');
      return;
    }

    this.userService.create(this.newUser).subscribe({
      next: () => {
        // ESKİ: alert('Kullanıcı başarıyla eklendi!');
        Swal.fire({
          title: 'Başarılı!',
          text: 'Yeni kullanıcı sisteme eklendi.',
          icon: 'success',
          timer: 2000, // 2 saniye sonra kendi kendine kapanır
          showConfirmButton: false
        });

        this.loadUsers();
        this.newUser.email = '';
        this.newUser.firstname = '';
        this.newUser.lastname = '';
        this.newUser.roleid = 2;
      },
      error: (err) => {
        console.error('Ekleme hatası:', err);
        Swal.fire('Hata!', 'Kullanıcı eklenirken bir sorun oluştu.', 'error');
      }
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu kullanıcı kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe({
          next: () => {
            Swal.fire('Silindi!', 'Kullanıcı sistemden başarıyla kaldırıldı.', 'success');
            this.loadUsers();
          },
          error: (err) => {
            console.error('Silme hatası:', err);
            Swal.fire('Hata!', 'Kullanıcı silinemedi!', 'error');
          }
        });
      }
    });
  }

  // Kullanıcı Hesabını Dondurma/Açma
  toggleStatus(user: any): void {
    // BUSINESS LOGIC: Kendi kendini dondurmayı engelle!
    if (user.id === this.currentUserId) {
      Swal.fire('İşlem Reddedildi', 'Kendi hesabınızı askıya alamazsınız!', 'warning');
      return;
    }

    this.userService.toggleStatus(user.id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Güncellendi!',
          text: `Kullanıcı hesabı ${user.active ? 'askıya alındı (Pasif)' : 'yeniden aktifleştirildi'}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.loadUsers(); // Tabloyu yenile
      },
      error: (err) => Swal.fire('Hata!', 'Kullanıcı durumu değiştirilemedi.', 'error')
    });
  }

}
