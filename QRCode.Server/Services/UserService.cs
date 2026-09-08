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

            if (user.Roleid == 0)
            {
                user.Roleid = 2; //User rolünü atar
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User?> AuthenticateAsync(string email, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == email);

            if (user == null)
            {
                return null;
            }

            if (user.Active == false)
            {
                throw new UnauthorizedAccessException("passive_account");
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Pwhash, password);
            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return null;
            }

            return user;
        }
        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
        public async Task ToggleStatusAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                user.Active = !user.Active;
                await _context.SaveChangesAsync();
            }
        }
    }
        
}