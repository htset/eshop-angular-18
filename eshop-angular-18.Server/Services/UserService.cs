using eshop_angular_18.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace eshop_angular_18.Server.Services
{
  public class UserService : IUserService
  {
    private readonly EshopContext Context;

    public UserService(EshopContext context)
    {
      Context = context;
    }

    public async Task<List<User>> GetUsers()
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

    public async Task<User?> GetUserById(int id)
    {
      return await Context.Users.FindAsync(id);
    }

    public async Task<User?> GetUserByUsername(string? username)
    {
      return await Context.Users
          .SingleOrDefaultAsync(x => x.Username == username);
    }

    public async Task<User?> GetUserByEmail(string? email)
    {
      return await Context.Users
          .SingleOrDefaultAsync(x => x.Email == email);
    }

    public async Task<User?> GetUserByRegistrationCode(string? code)
    {
      return await Context.Users
          .SingleOrDefaultAsync(u => u.RegistrationCode == code);
    }

    public async Task<User?> GetUserFromTokens(string? token, string? refreshToken)
    {
      return await Context.Users
          .SingleOrDefaultAsync(u => (u.RefreshToken == refreshToken)
              && (u.Token == token));
    }

    public async Task<User?> GetUserFromRefreshToken(string? refreshToken)
    {
      return await Context.Users
          .SingleOrDefaultAsync(u => (u.RefreshToken == refreshToken));
    }

    public async Task CreateUser(User user)
    {
      await Context.Users.AddAsync(user);
      await Context.SaveChangesAsync();
    }

    public async Task UpdateUser(User user)
    {
      Context.Users.Update(user);
      await Context.SaveChangesAsync();
    }
  }
}