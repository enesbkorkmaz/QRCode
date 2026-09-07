using Microsoft.EntityFrameworkCore;
using QRCode.Server.Data;
using QRCode.Server.Models;

namespace QRCode.Server.Services
{
    public class QrcodeService : IQrcodeService
    {
        private readonly QrcodeDBContext _context;

        public QrcodeService(QrcodeDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Qrcode>> GetAllAsync()
        {
            // Veritabanı tablosu çoğul: Qrcodes
            return await _context.Qrcodes.ToListAsync();
        }

        public async Task<Qrcode> GetByIdAsync(int id)
        {
            return await _context.Qrcodes.FindAsync(id);
        }

        public async Task<Qrcode> GetByGuidAsync(string guid)
        {
            return await _context.Qrcodes.FirstOrDefaultAsync(q => q.Guid == guid);
        }

        public async Task<Qrcode> CreateAsync(Qrcode qrcode)
        {
            _context.Qrcodes.Add(qrcode);
            await _context.SaveChangesAsync();
            return qrcode;
        }

        public async Task UpdateAsync(Qrcode qrcode)
        {
            _context.Entry(qrcode).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var qrcode = await _context.Qrcodes.FindAsync(id);
            if (qrcode != null)
            {
                _context.Qrcodes.Remove(qrcode);
                await _context.SaveChangesAsync();
            }
        }

    }
}