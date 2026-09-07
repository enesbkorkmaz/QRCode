import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import Swal from 'sweetalert2'; // YENİ EKLENDİ

@Component({
  selector: 'app-role-management',
  standalone: false,
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  roles: any[] = [];
  isAdmin: boolean = false;
  newRole = { name: '', desc: '' };

  constructor(private roleService: RoleService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (!this.isAdmin) {
      Swal.fire('Yetkisiz Erişim!', 'Bu sayfayı görüntüleme yetkiniz yok.', 'error');
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Roller yüklenirken hata oluştu', err)
    });
  }

  createRole(): void {
    if (!this.newRole.name) {
      Swal.fire('Eksik Bilgi', 'Lütfen rol adını giriniz!', 'warning');
      return;
    }

    this.roleService.create(this.newRole).subscribe({
      next: () => {
        Swal.fire({ title: 'Başarılı!', text: 'Yeni rol eklendi.', icon: 'success', timer: 2000, showConfirmButton: false });
        this.loadRoles();
        this.newRole.name = '';
        this.newRole.desc = '';
      },
      error: (err) => Swal.fire('Hata!', 'Rol eklenemedi!', 'error')
    });
  }

  deleteRole(id: number): void {
    // BUSINESS LOGIC GUARD: Temel rollerin silinmesini engelle
    if (id === 1 || id === 2) {
      Swal.fire('Sistem Güvenliği', 'Admin (1) ve User (2) temel rolleri silinemez!', 'error');
      return;
    }

    Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu rol kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.delete(id).subscribe({
          next: () => {
            Swal.fire('Silindi!', 'Rol başarıyla kaldırıldı.', 'success');
            this.loadRoles();
          },
          error: (err) => Swal.fire('Hata!', 'Rol silinemedi! Bu role sahip kullanıcılar olabilir.', 'error')
        });
      }
    });
  }
}
