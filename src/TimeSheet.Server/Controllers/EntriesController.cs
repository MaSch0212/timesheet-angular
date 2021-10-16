using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TimeSheet.Common;
using TimeSheet.Models;
using TimeSheet.Services;

namespace TimeSheet.Controllers
{
    [Authorize]
    [Route("api/entries")]
    [ApiController]
    public class EntriesController : ControllerBase
    {
        private readonly ITimeSheetService _timeSheetService;
        private readonly ISessionService _sessionService;

        public EntriesController(ITimeSheetService timeSheetService, ISessionService sessionService)
        {
            _timeSheetService = timeSheetService;
            _sessionService = sessionService;
        }

        [HttpGet]
        public IActionResult GetEntries(int skip = 0, int take = 50, bool desc = true)
        {
            return DoActionWithValidation(() =>
            {
                var entries = _timeSheetService.GetEntries(_sessionService.GetUserId(User), skip, take, desc);
                return Ok(entries);
            });
        }

        [HttpGet("overtime")]
        public IActionResult GetOvertime()
        {
            return DoActionWithValidation(() =>
            {
                var overtime = _timeSheetService.GetOvertime(_sessionService.GetUserId(User));
                return Ok(overtime);
            });
        }

        [HttpPost("checkin")]
        public IActionResult CheckIn()
        {
            return DoActionWithValidation(() =>
            {
                _timeSheetService.CheckIn(_sessionService.GetUserId(User), DateTime.UtcNow);
                return Ok();
            });
        }

        [HttpPost("checkout")]
        public IActionResult CheckOut()
        {
            return DoActionWithValidation(() =>
            {
                _timeSheetService.CheckOut(_sessionService.GetUserId(User), DateTime.UtcNow);
                return Ok();
            });
        }

        [HttpPost("action")]
        public IActionResult PostAction(string status)
        {
            if (string.Equals(status, "entered", StringComparison.OrdinalIgnoreCase))
                return CheckIn();
            else if (string.Equals(status, "exited", StringComparison.OrdinalIgnoreCase))
                return CheckOut();
            else
                return BadRequest($"The status \"{status}\" is unknown.");
        }

        [HttpPost("delete")]
        public IActionResult DeleteEntry(int id)
        {
            return DoActionWithValidation(() =>
            {
                _timeSheetService.DeleteEntry(_sessionService.GetUserId(User), id);
                return Ok();
            });
        }

        [HttpPost("add")]
        public IActionResult AddEntry([FromBody] TimeSheetEntry entry)
        {
            return DoActionWithValidation(() =>
            {
                var entryId = _timeSheetService.AddEntry(_sessionService.GetUserId(User), entry);
                return Ok(new { entryId });
            });
        }

        [HttpPost("edit")]
        public IActionResult EditEntry([FromBody] TimeSheetEntry entry)
        {
            return DoActionWithValidation(() =>
            {
                _timeSheetService.EditEntry(_sessionService.GetUserId(User), entry);
                return Ok();
            });
        }

        private IActionResult DoActionWithValidation(Func<IActionResult> action)
        {
            try
            {
                return action();
            }
            catch(ValidationException ex)
            {
                return StatusCode(ex.StatusCode, ex.Message);
            }
        }
    }
}
