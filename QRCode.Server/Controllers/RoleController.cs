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
    }
}