import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QrcodeService } from '../../services/qrcode.service';

@Component({
  selector: 'app-redirect',
  standalone: false,
  template: '<h2 style="text-align:center; margin-top:50px;">Yönlendiriliyorsunuz...</h2>'
})
export class RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private qrcodeService: QrcodeService
  ) { }

  ngOnInit(): void {
    // URL'deki GUID değerini yakala
    const guid = this.route.snapshot.paramMap.get('guid');

    if (guid) {
      // Backend'e sor: Bu GUID hangi URL'ye ait?
      this.qrcodeService.getByGuid(guid).subscribe({
        next: (data) => {
          window.location.href = data.url;
        },
        error: () => alert('Geçersiz veya süresi dolmuş QR Kod!')
      });
    }
  }
}
