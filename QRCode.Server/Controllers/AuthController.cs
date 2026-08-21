using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using QRCode.Server.Models;
using QRCode.Server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QRCode.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            // Şifre boş mu kontrolü
            if (string.IsNullOrWhiteSpace(user.Pwhash))
            {
                return BadRequest("Şifre alanı (Pwhash) zorunludur.");
            }

            var createdUser = await _userService.RegisterAsync(user);
            return Ok(new { message = "Kullanıcı başarıyla oluşturuldu.", userId = createdUser.Id });
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Kullanıcıyı doğrula (UserService'teki PBKDF2 hash kontrolü çalışır)
            var user = await _userService.AuthenticateAsync(request.Email, request.Password);

            if (user == null)
            {
                return Unauthorized("Geçersiz e-posta veya şifre.");
            }

            // 2. Başarılıysa JWT Token üret
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Roleid.ToString()) // İleride yetki kontrolü için
                }),
                Expires = DateTime.UtcNow.AddHours(2), // Token 2 saat geçerli olsun
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // 3. Token'ı istemciye (Angular'a) gönder
            return Ok(new { Token = tokenString });
        }
    }

    // Sadece giriş isteğinde e-posta ve şifreyi almak için küçük bir yardımcı sınıf
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}