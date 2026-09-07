using Microsoft.AspNetCore.Mvc;
using QRCode.Server.Models;
using QRCode.Server.Services;

namespace QRCode.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        // GET: api/Role
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            var roles = await _roleService.GetAllAsync();
            return Ok(roles);
        }

        // GET: api/Role/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(int id)
        {
            var role = await _roleService.GetByIdAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            return Ok(role);
        }

        // POST: api/Role (Yeni Rol Ekleme)
        [HttpPost]
        public async Task<ActionResult<Role>> PostRole(Role role)
        {
            var createdRole = await _roleService.CreateAsync(role);
            return CreatedAtAction(nameof(GetRole), new { id = createdRole.Id }, createdRole);
        }

        // DELETE: api/Role/5 (Rol Silme)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            // BACKEND GÜVENLÝÐÝ: Biri Postman gibi dýþ bir araçla silmeye çalýþýrsa diye arka uca da kalkan koyuyoruz
            if (id == 1 || id == 2)
            {
                return BadRequest("Sistem güvenliði: Temel roller silinemez!");
            }

            await _roleService.DeleteAsync(id);
            return NoContent();
        }
    }
        
}