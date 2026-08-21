using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QRCode.Server.Data;
using QRCode.Server.Models;

namespace QRCode.Server.Services
{
    public class UserService : IUserService
    {
        private readonly QrcodeDBContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public UserService(QrcodeDBContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            // Include kaldırıldı, doğrudan tabloyu çekiyoruz
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> RegisterAsync(User user)
        {
            // Şifreyi Pwhash alanına PBKDF2 algoritmasıyla hash'leyerek kaydediyoruz
            user.Pwhash = _passwordHasher.HashPassword(user, user.Pwhash);

            // Varsayılan olarak sisteme kayıt olanlara "user" rolünü (Örn: Roleid = 2) atayalım
            if (user.Roleid == 0)
            {
                user.Roleid = 2;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User?> AuthenticateAsync(string email, string password)
        {
            // Username yerine Email alanından kullanıcıyı buluyoruz
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == email);

            if (user == null)
            {
                return null; // Böyle bir email yok
            }

            // Gelen düz şifre ile veritabanındaki Hash'lenmiş (Pwhash) şifreyi karşılaştır
            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Pwhash, password);

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return null; // Şifre yanlış
            }

            return user; // Giriş başarılı
        }
    }
}