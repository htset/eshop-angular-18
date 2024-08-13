using eshop_angular_18.Server.Helpers;
using eshop_angular_18.Server.Models;
using eshop_angular_18.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using my_eshop_api.Controllers;

namespace eshop_angular_18.Server.tests
{
  public class Tests
  {
    AppSettings appSettings;
    User user;
    Mock<IUserService> mockService;
    UserController controller;

    [SetUp]
    public void Setup()
    {
      appSettings = new AppSettings()
      {
        Secret = "this is a very long string to be used as secret",
        SmtpHost = "smtp.host",
        SmtpPort = 587,
        SmtpUsername = "username@mysite.com",
        SmtpPassword = "passssss"
      };

      var iop = Options.Create(appSettings);

      user = new User()
      {
        Id = 1,
        FirstName = "a1",
        LastName = "b1",
        Username = "user1",
        Password = "Ln0g6rm/5ZZsk7aiTD4m+u04VvVttKlrTLtlsdUE1FeFdeoT",
        Email = "user1@gmail.com",
        Role = "admin",
        Status = "Active"
      };

      mockService = new Mock<IUserService>();
      controller = new UserController(mockService.Object, iop);

      mockService.Setup(s => s.GetUserByUsername("user1111"))
          .ReturnsAsync((User)null);
      mockService.Setup(s => s.GetUserByUsername("user1"))
          .ReturnsAsync(user);
      mockService.Setup(s => s.UpdateUser(It.IsAny<User>()));

    }

    [Test]
    public async Task WhenLoginFormIsNull_ReturnBadRequest()
    {
      User? testUser = null;

      var response = await controller.Authenticate(testUser)
          as BadRequestObjectResult;
      Assert.IsInstanceOf<BadRequestObjectResult>(response);
    }

    [Test]
    public async Task WhenWrongUsername_ReturnBadRequest()
    {
      var testUser = new User()
      {
        Username = "user1111",
        Password = "pass1"
      };

      var response = await controller.Authenticate(testUser)
          as BadRequestObjectResult;
      Assert.IsInstanceOf<BadRequestObjectResult>(response);
    }

    [Test]
    public async Task WhenUserIsPending_ReturnBadRequest()
    {
      user.Status = "Pending";

      var testUser = new User()
      {
        Username = "user1",
        Password = "user"
      };

      var response = await controller.Authenticate(testUser) as BadRequestObjectResult;
      Assert.IsInstanceOf<BadRequestObjectResult>(response);
    }

    [Test]
    public async Task WhenCorrectCredentials_ReturnOK()
    {
      var testUser = new User()
      {
        Username = "user1",
        Password = "user"
      };

      var response = await controller.Authenticate(testUser)
          as OkObjectResult;
      Assert.IsInstanceOf<OkObjectResult>(response);
      var model = response.Value as User;
      Assert.IsNotNull(model);
      Assert.IsNotNull(model.Token);
      Assert.IsNotNull(model.RefreshToken);
      Assert.IsNull(model.Password);
    }
  }
}