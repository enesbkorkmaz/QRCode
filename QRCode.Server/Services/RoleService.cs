using Microsoft.EntityFrameworkCore;
using QRCode.Server.Data;
using QRCode.Server.Models;

namespace QRCode.Server.Services
{
    public class RoleService : IRoleService
    {
        private readonly QrcodeDBContext _context;

        public RoleService(QrcodeDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            return await _context.Roles.ToListAsync();
        }

        public async Task<Role> GetByIdAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }
    }
}