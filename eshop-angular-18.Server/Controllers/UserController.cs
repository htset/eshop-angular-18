using eshop_angular_18.Server.Helpers;
using eshop_angular_18.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace eshop_angular_18.Server.Controllers
{
  //********************
  //Helper classes
  //********************
  public class RegistrationCode
  {
    public string? Code { get; set; }
  }

  public class ResetEmail
  {
    public string Email { get; set; }
  }

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

    //********************
    //REST handlers
    //********************

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

      if (user.Status != "Active")
        return BadRequest(new
        {
          message = "Registration has not been confirmed"
        });

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

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<User?>> GetUser(int id)
    {
      var user = await Context.Users.FindAsync(id);
      if (user != null)
        user.Password = null;
      return user;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<User>> Register([FromBody] User user)
    {
      if (await Context.Users.AnyAsync(u => u.Username == user.Username))
      {
        return BadRequest("Username is already used");
      }

      if (await Context.Users.AnyAsync(u => u.Email == user.Email))
      {
        return BadRequest("Email is already used");
      }

      user.Role = "customer";
      user.Password = PasswordHasher.HashPassword(user.Password);
      user.Status = "Pending";
      user.RegistrationCode = CreateConfirmationToken();

      await Context.Users.AddAsync(user);
      await Context.SaveChangesAsync();

      SendConfirmationEmail(user);

      return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPost("confirm_registration")]
    [AllowAnonymous]
    public async Task<ActionResult<User>> ConfirmRegistration([FromBody] RegistrationCode code)
    {
      var user = await Context.Users.SingleOrDefaultAsync(u => u.RegistrationCode == code.Code);
      if (user == null)
      {
        return BadRequest("Registration code not found");
      }

      if (user.Status == "Active")
      {
        return BadRequest("User is already activated");
      }

      user.Status = "Active";
      user.Token = CreateToken(user);
      user.RefreshToken = CreateRefreshToken();
      user.RefreshTokenExpiry = DateTime.Now.AddDays(7);

      await Context.SaveChangesAsync();

      user.Password = null;

      return Ok(user);
    }

    [HttpPost("reset_password")]
    [AllowAnonymous]
    public async Task<ActionResult<User>> ResetPassword([FromBody] ResetEmail resetEmail)
    {
      var user = await Context.Users
        .SingleOrDefaultAsync(u => u.Email == resetEmail.Email);
      if (user == null)
      {
        return BadRequest("Email not found");
      }

      user.Status = "PasswordReset";
      user.Password = null;
      user.RegistrationCode = CreateConfirmationToken();

      await Context.SaveChangesAsync();

      SendPasswordResetEmail(user);

      return Ok(user);
    }

    [HttpPost("change_password")]
    [AllowAnonymous]
    public async Task<ActionResult<User>> ChangePassword([FromBody] User inputUser)
    {
      var user = await Context.Users
        .SingleOrDefaultAsync(u => 
          u.RegistrationCode == inputUser.RegistrationCode);

      if (user == null)
      {
        return BadRequest("User not found");
      }

      user.Password = PasswordHasher.HashPassword(inputUser.Password);
      user.Status = "Active";
      user.Token = CreateToken(user);
      user.RefreshToken = CreateRefreshToken();
      user.RefreshTokenExpiry = DateTime.Now.AddDays(7);

      await Context.SaveChangesAsync();

      user.Password = null;

      return Ok(user);
    }

    //********************
    //private functions
    //********************

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

    private string CreateConfirmationToken()
    {
      var randomNum = new byte[64];
      using (var generator = RandomNumberGenerator.Create())
      {
        generator.GetBytes(randomNum);
        var tempString = Convert.ToBase64String(randomNum);
        return tempString.Replace("\\", "")
          .Replace("+", "").Replace("=", "").Replace("/", "");
      }
    }

    private void SendConfirmationEmail(User user)
    {
      var smtpClient = new SmtpClient()
      {
        Host = AppSettings.SmtpHost,
        Port = AppSettings.SmtpPort,
        Credentials = new System.Net.NetworkCredential(AppSettings.SmtpUsername, AppSettings.SmtpPassword),
        EnableSsl = true
      };

      var message = new MailMessage()
      {
        From = new MailAddress("info@my-eshop.com"),
        Subject = "Confirm Registration",
        Body = "To confirm registration please click <a href=\"https://localhost:4200/confirm_registration?code=" + user.RegistrationCode + "\">here</a>",
        IsBodyHtml = true
      };

      message.To.Add(user.Email);

      //smtpClient.Send(message);
    }

    private void SendPasswordResetEmail(User user)
    {
      var smtpClient = new SmtpClient()
      {
        Host = AppSettings.SmtpHost,
        Port = AppSettings.SmtpPort,
        Credentials = new System.Net
        .NetworkCredential(AppSettings.SmtpUsername, AppSettings.SmtpPassword),
        EnableSsl = true
      };

      var message = new MailMessage()
      {
        From = new MailAddress("info@my-eshop.com"),
        Subject = "Email reset",
        Body = "To insert a new password, please click <a href=\"https://localhost:4200/new_password?code=" + user.RegistrationCode + "\">here</a>",
        IsBodyHtml = true
      };

      message.To.Add(user.Email);

      //smtpClient.Send(message);
    }
  }
}
