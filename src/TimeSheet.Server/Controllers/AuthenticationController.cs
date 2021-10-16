using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using TimeSheet.Common;
using TimeSheet.Models.Request;
using TimeSheet.Models.Response;
using TimeSheet.Services;

namespace TimeSheet.Controllers
{
    [Authorize]
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private IConfiguration _config;
        private ISessionService _sessionService;

        public AuthenticationController(IConfiguration config, ISessionService sessionService)
        {
            _config = config;
            _sessionService = sessionService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Username))
                return BadRequest("Missing information");

            var token = _sessionService.Authenticate(request.Username, request.Password, request.StayLoggedIn);
            if (string.IsNullOrEmpty(token))
                return Unauthorized();
            return Ok(new LoginResponse
            {
                IsSuccess = true,
                Token = token
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Username) ||
                request.UserInfo == null || string.IsNullOrEmpty(request.UserInfo.GivenName) ||
                string.IsNullOrEmpty(request.UserInfo.Surname) || string.IsNullOrEmpty(request.UserInfo.Email))
            {
                return BadRequest("Missing information");
            }

            try
            {
                var token = _sessionService.Register(request.Username, request.Password, request.UserInfo);
                return Ok(new LoginResponse
                {
                    IsSuccess = true,
                    Token = token
                });
            }
            catch (ValidationException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
        }

        [HttpPost("changepassword")]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (request == null || request.UserId <= 0)
                return BadRequest("Missing information");

            try
            {
                _sessionService.ChangePassword(request.UserId, request.OldPassword, request.NewPassword);
                return Ok();
            }
            catch (ValidationException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
        }

        [HttpGet("check")]
        public IActionResult CheckToken()
        {
            return Ok();
        }
    }
}
