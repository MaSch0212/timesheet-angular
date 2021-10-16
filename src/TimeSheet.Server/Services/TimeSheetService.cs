using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using TimeSheet.Common;
using TimeSheet.Models;
using TimeSheet.Repositories;

namespace TimeSheet.Services
{
    public class TimeSheetService : ITimeSheetService
    {
        private readonly ITimeSheetRepository _timeSheetRepository;
        private readonly ISettingsService _settingsService;

        public TimeSheetService(ITimeSheetRepository timeSheetRepository, ISettingsService settingsService)
        {
            _timeSheetRepository = timeSheetRepository;
            _settingsService = settingsService;
        }

        public int AddEntry(int userId, TimeSheetEntry newEntry)
        {
            if (newEntry == null)
                throw new ValidationException(StatusCodes.Status400BadRequest, "The entry was not provided.");

            var timeSheetId = _timeSheetRepository.GetDefaultTimeSheetId(userId);
            newEntry.SheetId = timeSheetId;

            if (_timeSheetRepository.HasEntryAtDay(newEntry.SheetId, newEntry.Start, 0))
                throw new ValidationException(StatusCodes.Status409Conflict, $"Another entry exists for that day. More than 1 entry at a day is not allowed.");

            newEntry.Breaks = newEntry.Breaks?.Where(x => x != null).OrderBy(x => x.Start).ToList() ?? new List<Break>();
            if (!TimeHelper.CheckTimeSheetEntry(newEntry, out string error))
                throw new ValidationException(StatusCodes.Status400BadRequest, $"The entry has errors: {error}");

            _timeSheetRepository.AddEntry(newEntry);
            return newEntry.Id;
        }

        public void CheckIn(int userId, DateTime timeStamp)
        {
            var timeSheetId = _timeSheetRepository.GetDefaultTimeSheetId(userId);
            timeStamp = timeStamp.ToUniversalTime();

            var lastEntry = _timeSheetRepository.GetEntry(timeSheetId, timeStamp);

            if (lastEntry != null && !lastEntry.End.HasValue)
                throw new ValidationException(StatusCodes.Status405MethodNotAllowed, "The last entry has to be checked out.");
            if (lastEntry != null)
            {
                var date = TimeHelper.RoundMinutes(timeStamp, 5);
                if (lastEntry.End.Value < date)
                {
                    lastEntry.Breaks.Add(new Break
                    {
                        Start = lastEntry.End.Value,
                        End = date
                    });
                }
                lastEntry.End = null;

                _timeSheetRepository.UpdateEntry(lastEntry);
            }
            else
            {
                _timeSheetRepository.AddEntry(new TimeSheetEntry
                {
                    SheetId = timeSheetId,
                    Start = TimeHelper.RoundMinutes(timeStamp, 5),
                    TargetHours = _settingsService.GetSetting<double>(userId, nameof(Settings.WorkDayHours))
                });
            }
        }

        public void CheckOut(int userId, DateTime timeStamp)
        {
            var timeSheetId = _timeSheetRepository.GetDefaultTimeSheetId(userId);
            timeStamp = timeStamp.ToUniversalTime();

            var lastEntry = _timeSheetRepository.GetLastOpenEntry(timeSheetId);

            if (lastEntry == null)
                throw new ValidationException(StatusCodes.Status405MethodNotAllowed, "There is no open time sheet entry to end.");
            else
            {
                var date = TimeHelper.RoundMinutes(timeStamp, 5);
                if ((date - lastEntry.Start).TotalMinutes < 30)
                    _timeSheetRepository.DeleteEntry(lastEntry.Id);
                else
                {
                    var lastBreak = lastEntry.Breaks.LastOrDefault();
                    if (lastBreak != null && (date - lastBreak.End.Value).TotalMinutes < 30)
                    {
                        lastEntry.End = lastBreak.Start;
                        lastEntry.Breaks.Remove(lastBreak);
                    }
                    else
                    {
                        var breakStart = _settingsService.GetSetting<double>(userId, nameof(Settings.DefaultBreakStart));
                        var breakEnd = _settingsService.GetSetting<double>(userId, nameof(Settings.DefaultBreakEnd));

                        lastEntry.End = date;
                        var leStart = lastEntry.Start.ToLocalTime();
                        var leEnd = lastEntry.End.Value.ToLocalTime();
                        if (leStart.Hour < breakStart && leEnd.TimeOfDay.TotalHours > breakEnd && lastEntry.Breaks.Count == 0)
                        {
                            lastEntry.Breaks.Add(new Break
                            {
                                Start = leStart.Date.AddHours(breakStart).ToUniversalTime(),
                                End = leStart.Date.AddHours(breakEnd).ToUniversalTime()
                            });
                        }
                    }
                    _timeSheetRepository.UpdateEntry(lastEntry);
                }
            }
        }

        public void DeleteEntry(int userId, int entryId)
        {
            var timeSheetId = _timeSheetRepository.GetDefaultTimeSheetId(userId);

            var entry = _timeSheetRepository.GetEntry(entryId);
            if (entry == null || entry.SheetId != timeSheetId)
                throw new ValidationException(StatusCodes.Status404NotFound, $"An entry with the id {entryId} was not found in the time sheet {timeSheetId}.");

            _timeSheetRepository.DeleteEntry(entryId);
        }

        public void EditEntry(int userId, TimeSheetEntry newEntry)
        {
            if (newEntry == null)
                throw new ValidationException(StatusCodes.Status400BadRequest, "The entry was not provided.");

            var timeSheetId = _timeSheetRepository.GetDefaultTimeSheetId(userId);

            var oldEntry = _timeSheetRepository.GetEntry(newEntry.Id);
            if(oldEntry == null || oldEntry.SheetId != timeSheetId)
                throw new ValidationException(StatusCodes.Status404NotFound, $"An entry with the id {newEntry.Id} was not found in the time sheet {timeSheetId}.");

            newEntry.SheetId = oldEntry.SheetId;
            if (oldEntry.Start.Date != newEntry.Start.Date && _timeSheetRepository.HasEntryAtDay(timeSheetId, newEntry.Start, newEntry.Id))
                throw new ValidationException(StatusCodes.Status409Conflict, $"Another entry exists for that day. More than 1 entry at a day is not allowed.");

            newEntry.Breaks = newEntry.Breaks?.Where(x => x != null).OrderBy(x => x.Start).ToList() ?? new List<Break>();
            if (!TimeHelper.CheckTimeSheetEntry(newEntry, out string error))
                throw new ValidationException(StatusCodes.Status400BadRequest, $"The entry has errors: {error}");

            _timeSheetRepository.UpdateEntry(newEntry);
        }

        public IEnumerable<TimeSheetEntry> GetEntries(int userId, int skip, int take, bool descending)
        {
            var timeSheetId = _timeSheetRepository.GetDefaultTimeSheetId(userId);
            return _timeSheetRepository.GetEntries(timeSheetId, skip, take, descending);
        }

        public double GetOvertime(int userId)
        {
            var workDayHours = _settingsService.GetSetting<double>(userId, nameof(Settings.WorkDayHours));
            var timeSheetId = _timeSheetRepository.GetDefaultTimeSheetId(userId);
            return _timeSheetRepository.GetOvertime(timeSheetId, workDayHours);
        }
    }
}
