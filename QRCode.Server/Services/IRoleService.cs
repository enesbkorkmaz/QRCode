using QRCode.Server.Models;

namespace QRCode.Server.Services
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetAllAsync();
        Task<Role> GetByIdAsync(int id);
    }
}