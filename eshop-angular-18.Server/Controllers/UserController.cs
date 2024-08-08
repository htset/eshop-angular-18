using eshop_angular_18.Server.Helpers;
using eshop_angular_18.Server.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace eshop_angular_18.Server.Controllers
{
  [Route("api/users")]
  [EnableCors("angular_eshop_AllowSpecificOrigins")]
  [ApiController]
  public class UserController : ControllerBase
  {
    private readonly EshopContext Context;
    private readonly string Secret
        = "this is a very long string to be used as secret";

    public UserController(EshopContext context)
    {
      Context = context;
    }

    [HttpPost("authenticate")]
    public IActionResult Authenticate([FromBody] User formParams)
    {
      if (formParams == null || formParams.Password == null)
        return BadRequest(new { message = "Log in failed" });

      var user = Context.Users
          .SingleOrDefault(x => x.Username == formParams.Username);

      if (user == null || user.Password == null)
        return BadRequest(new { message = "Log in failed" });

      if (!PasswordHasher
          .VerifyPassword(formParams.Password, user.Password))
        return BadRequest(new { message = "Log in failed" });

      user.Token = CreateToken(user);
      user.Password = null;

      return Ok(user);
    }

    private string CreateToken(User user)
    {
      var jwtTokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(Secret);
      var identity = new ClaimsIdentity(new Claim[]
      {
        new Claim(ClaimTypes.Role, user.Role)
      });
      var credentials
        = new SigningCredentials(new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = identity,
        Expires = DateTime.Now.AddMinutes(120),
        SigningCredentials = credentials
      };

      var token = jwtTokenHandler.CreateToken(tokenDescriptor);
      return jwtTokenHandler.WriteToken(token);
    }
  }
}
