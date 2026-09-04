import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isAdmin: boolean = false;

  // YENİ: E-posta yerine ID tutacağımız değişken
  currentUserId: number | null = null;

  // Yeni eklenecek kullanıcı için taslak model
  newUser = { email: '', firstname: '', lastname: '', roleid: 2, active: true, pwhash: '123456' };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 1. Güvenlik Kontrolü: Admin değilse Dashboard'a geri şutla!
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      alert('Bu sayfayı görüntüleme yetkiniz yok!');
      this.router.navigate(['/dashboard']);
      return;
    }

    // 2. Giriş yapan kişinin ID'sini alıyoruz (Kendi kendini silmeyi engellemek için)
    this.currentUserId = this.authService.getCurrentUserId();

    // 3. Verileri çek
    this.loadUsers();
  }

  // Kullanıcıları Listele (Read)
  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Kullanıcılar yüklenirken hata oluştu', err)
    });
  }

  // Yeni Kullanıcı Ekle (Create)
  createUser(): void {
    if (!this.newUser.email || !this.newUser.firstname) {
      alert('Lütfen en azından İsim ve E-posta alanlarını doldurun!');
      return;
    }

    this.userService.create(this.newUser).subscribe({
      next: () => {
        alert('Kullanıcı başarıyla eklendi!');
        this.loadUsers(); // Tabloyu yenile

        // Formu temizle
        this.newUser.email = '';
        this.newUser.firstname = '';
        this.newUser.lastname = '';
        this.newUser.roleid = 2;
      },
      error: (err) => {
        console.error('Ekleme hatası:', err);
        alert('Ekleme başarısız oldu!');
      }
    });
  }

  // Kullanıcı Sil (Delete)
  deleteUser(id: number): void {
    if (confirm('Bu kullanıcıyı sistemden tamamen silmek istediğinize emin misiniz?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.loadUsers(); // Tabloyu yenile
        },
        error: (err) => {
          console.error('Silme hatası:', err);
          alert('Kullanıcı silinemedi!');
        }
      });
    }
  }
}
