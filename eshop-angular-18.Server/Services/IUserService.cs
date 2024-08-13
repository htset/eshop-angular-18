using eshop_angular_18.Server.Models;

namespace eshop_angular_18.Server.Services
{
  public interface IUserService
  {
    public Task<List<User>> GetUsers();
    public Task<User?> GetUserById(int id);
    public Task<User?> GetUserByUsername(string? username);
    public Task<User?> GetUserByEmail(string? email);
    public Task<User?> GetUserByRegistrationCode(string? code);
    public Task<User?> GetUserFromTokens(string? token, string? refreshToken);
    public Task<User?> GetUserFromRefreshToken(string? refreshToken);
    public Task CreateUser(User user);
    public Task UpdateUser(User user);
  }
}
