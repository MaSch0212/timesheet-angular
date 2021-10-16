using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TimeSheet.Common;
using TimeSheet.Models;
using TimeSheet.Models.Response;
using TimeSheet.Services;

namespace TimeSheet.Controllers
{
    [Authorize]
    [Route("api/settings")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsService _settingsService;
        private readonly ISessionService _sessionService;

        public SettingsController(ISettingsService settingsService, ISessionService sessionService)
        {
            _settingsService = settingsService;
            _sessionService = sessionService;
        }

        [HttpGet]
        public IActionResult GetSettings()
        {
            try
            {
                var settings = _settingsService.GetSettings(_sessionService.GetUserId(User));
                return Ok(settings);
            }
            catch(ValidationException ex) { return StatusCode(ex.StatusCode, ex.Message); }
        }

        [HttpPost("edit")]
        public IActionResult UpdateSettings([FromBody] Settings settings)
        {
            try
            {
                _settingsService.UpdateSettings(_sessionService.GetUserId(User), settings);
                return Ok();
            }
            catch(ValidationException ex) { return StatusCode(ex.StatusCode, ex.Message); }
        }

        [HttpPost("createapikey")]
        public IActionResult CreateApiKey(string name)
        {
            try
            {
                var key = _settingsService.CreateApiKey(_sessionService.GetUserId(User), name);
                return Ok(new CreateApiKeyResponse
                {
                    Key = key.key,
                    KeyInfo = key.keyInfo
                });
            }
            catch(ValidationException ex) { return StatusCode(ex.StatusCode, ex.Message); }
        }

        [HttpPost("deleteapikey")]
        public IActionResult DeleteApiKey(int keyId)
        {
            try
            {
                _settingsService.RemoveApiKey(_sessionService.GetUserId(User), keyId);
                return Ok();
            }
            catch(ValidationException ex) { return StatusCode(ex.StatusCode, ex.Message); }
        }
    }
}
