import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private http: HttpClient,
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

    // 2. Yetkisi varsa verileri çek
    this.loadUsers();
  }

  loadUsers(): void {
    // .NET Backend portunuzun 7118 olduğundan emin olun
    this.http.get<any[]>('https://localhost:7118/api/User').subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Kullanıcılar yüklenirken hata oluştu', err)
    });
  }
}
