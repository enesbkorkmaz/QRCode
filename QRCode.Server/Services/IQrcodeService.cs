using QRCode.Server.Models;

namespace QRCode.Server.Services
{
    public interface IQrcodeService
    {
        Task<IEnumerable<Qrcode>> GetAllAsync();
        Task<Qrcode> GetByIdAsync(int id);
        Task<Qrcode> GetByGuidAsync(string guid);
        Task<Qrcode> CreateAsync(Qrcode qrcode);
        Task UpdateAsync(Qrcode qrcode);
        Task DeleteAsync(int id);
    }
}