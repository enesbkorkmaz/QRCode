import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Angular'ın yönlendirme servisini (Router) içeri aktarıyoruz
  const router = inject(Router);

  // Tarayıcı hafızasında (LocalStorage) JWT biletimiz var mı bakıyoruz
  const token = localStorage.getItem('token');

  if (token) {
    // Bileti var, sayfanın açılmasına İZİN VER
    return true;
  } else {
    // Bileti yok (Kaçak giriş), onu Login sayfasına GERİ ŞUTLA
    router.navigate(['/login']);
    return false;
  }
};
