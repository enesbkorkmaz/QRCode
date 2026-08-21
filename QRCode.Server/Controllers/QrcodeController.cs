using Microsoft.AspNetCore.Authorization; // 1. EKLENEN SATIR: Güvenlik Kütüphanesi
using Microsoft.AspNetCore.Mvc;
using QRCode.Server.Models;
using QRCode.Server.Services;

namespace QRCode.Server.Controllers
{
    [Authorize] // 2. EKLENEN SATIR: İŞTE GÜVENLİK KALKANIMIZ! (Token'ı olmayan buraya giremez)
    [Route("api/[controller]")]
    [ApiController]
    public class QrcodeController : ControllerBase
    {
        private readonly IQrcodeService _qrcodeService;

        // Dependency Injection ile servisimizi Controller'a alıyoruz
        public QrcodeController(IQrcodeService qrcodeService)
        {
            _qrcodeService = qrcodeService;
        }

        // GET: api/Qrcode
        // Tüm QR Kodları listeler
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Qrcode>>> GetQrcodes()
        {
            var qrcodes = await _qrcodeService.GetAllAsync();
            return Ok(qrcodes);
        }

        // GET: api/Qrcode/5
        // Sadece belirli bir ID'ye sahip QR Kodu getirir
        [HttpGet("{id}")]
        public async Task<ActionResult<Qrcode>> GetQrcode(int id)
        {
            var qrcode = await _qrcodeService.GetByIdAsync(id);

            if (qrcode == null)
            {
                return NotFound();
            }

            return Ok(qrcode);
        }

        // GET: api/Qrcode/guid/d41d8cd98f00b204e9800998ecf8427e
        // GUID üzerinden QR Kodu bulur (Dokümandaki yönlendirme görevi için kullanacağız)
        [HttpGet("guid/{guid}")]
        public async Task<ActionResult<Qrcode>> GetQrcodeByGuid(string guid)
        {
            var qrcode = await _qrcodeService.GetByGuidAsync(guid);

            if (qrcode == null)
            {
                return NotFound();
            }

            return Ok(qrcode);
        }

        // POST: api/Qrcode
        // Yeni bir QR Kod verisi ekler
        [HttpPost]
        public async Task<ActionResult<Qrcode>> PostQrcode(Qrcode qrcode)
        {
            var createdQrcode = await _qrcodeService.CreateAsync(qrcode);
            return CreatedAtAction(nameof(GetQrcode), new { id = createdQrcode.Id }, createdQrcode);
        }

        // PUT: api/Qrcode/5
        // Var olan bir QR Kodu günceller
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQrcode(int id, Qrcode qrcode)
        {
            if (id != qrcode.Id)
            {
                return BadRequest("ID uyuşmazlığı!");
            }

            await _qrcodeService.UpdateAsync(qrcode);
            return NoContent();
        }

        // DELETE: api/Qrcode/5
        // Belirtilen ID'ye sahip QR Kodu siler
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQrcode(int id)
        {
            await _qrcodeService.DeleteAsync(id);
            return NoContent();
        }
    }
}