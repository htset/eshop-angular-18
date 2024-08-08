using eshop_angular_18.Server.Helpers;
using eshop_angular_18.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace eshop_angular_18.Server.Controllers
{
  [Route("api/users")]
  [EnableCors("angular_eshop_AllowSpecificOrigins")]
  [ApiController]
  public class UserController : ControllerBase
  {
    private readonly EshopContext Context;
    private readonly AppSettings AppSettings;

    public UserController(EshopContext context,
        IOptions<AppSettings> appSettings)
    {
      Context = context;
      AppSettings = appSettings.Value;
    }

    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate([FromBody] User formParams)
    {
      if (formParams == null || formParams.Password == null)
        return BadRequest(new { message = "Log in failed" });

      var user = await Context.Users
          .SingleOrDefaultAsync(x => x.Username == formParams.Username);

      if (user == null || user.Password == null)
        return BadRequest(new { message = "Log in failed" });

      if (!PasswordHasher
          .VerifyPassword(formParams.Password, user.Password))
        return BadRequest(new { message = "Log in failed" });

      user.Token = CreateToken(user);
      user.RefreshToken = CreateRefreshToken();
      user.RefreshTokenExpiry = DateTime.Now.AddDays(7);
      Context.SaveChanges();

      user.Password = null;

      return Ok(user);
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
      return await Context.Users
          .Select(x => new User()
          {
            Id = x.Id,
            FirstName = x.FirstName,
            LastName = x.LastName,
            Username = x.Username,
            Password = null,
            Role = x.Role,
            Email = x.Email
          })
          .ToListAsync();
    }

    private string CreateToken(User user)
    {
      var jwtTokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(AppSettings.Secret);
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
        Expires = DateTime.Now.AddMinutes(2),
        SigningCredentials = credentials
      };

      var token = jwtTokenHandler.CreateToken(tokenDescriptor);
      return jwtTokenHandler.WriteToken(token);
    }

    private string CreateRefreshToken()
    {
      var randomNum = new byte[64];
      using (var generator = RandomNumberGenerator.Create())
      {
        generator.GetBytes(randomNum);
        return Convert.ToBase64String(randomNum);
      }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] User data)
    {
      var user = await Context.Users
          .SingleOrDefaultAsync(u => (u.RefreshToken == data.RefreshToken)
              && (u.Token == data.Token));

      if (user == null || DateTime.Now > user.RefreshTokenExpiry)
        return BadRequest(new { message = "Invalid token" });

      user.Token = CreateToken(user);
      user.RefreshToken = CreateRefreshToken();
      user.RefreshTokenExpiry = DateTime.Now.AddDays(7);
      Context.SaveChanges();

      user.Password = null;

      return Ok(user);
    }

    [Authorize]
    [HttpPost("revoke")]
    public async Task<IActionResult> RevokeToken([FromBody] User data)
    {
      var user = await Context.Users
          .SingleOrDefaultAsync(u => (u.RefreshToken == data.RefreshToken));

      if (user == null || DateTime.Now > user.RefreshTokenExpiry)
        return BadRequest(new { message = "Invalid token" });

      user.Token = null;
      user.RefreshToken = null;
      user.RefreshTokenExpiry = null;
      Context.SaveChanges();

      user.Password = null;

      return Ok(user);
    }
  }
}
