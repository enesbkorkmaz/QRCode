import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Tarayıcının hafızasından token'ı alıyoruz
    const token = localStorage.getItem('token');

    // 2. Eğer token varsa, dışarı giden isteğin (Request) Header kısmına ekliyoruz
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 3. İsteği yoluna devam etmesi için bırakıyoruz
    return next.handle(request);
  }
}
