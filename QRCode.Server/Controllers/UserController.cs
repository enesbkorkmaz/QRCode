using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QRCode.Server.Models;
using QRCode.Server.Services;

namespace QRCode.Server.Controllers
{
    [Authorize] // Sadece giriş yapanlar erişebilir
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/User (Kullanıcıları Listele)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }
        // POST: api/User (Yeni Kullanıcı Ekle)
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Admin panelinden eklenen kullanıcıya varsayılan şifre belirleyelim
            if (string.IsNullOrWhiteSpace(user.Pwhash)) user.Pwhash = "123456";
            var createdUser = await _userService.RegisterAsync(user);
            return Ok(createdUser);
        }

        // DELETE: api/User/5 (Kullanıcı Sil)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }
}