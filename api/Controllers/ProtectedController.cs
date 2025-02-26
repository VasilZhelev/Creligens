using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyFirebaseApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProtectedController : ControllerBase
    {
        // This endpoint does not require authentication.
        [HttpGet("public-data")]
        public IActionResult GetPublicData()
        {
            return Ok("This is public data accessible to anyone.");
        }

        // This endpoint is protected by the [Authorize] attribute.
        [HttpGet("secure-data")]
        [Authorize]
        public IActionResult GetSecureData()
        {
            return Ok("This is protected data, you are authenticated!");
        }
    }
}
