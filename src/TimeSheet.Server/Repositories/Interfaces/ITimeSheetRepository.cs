using System;
using System.Collections.Generic;
using TimeSheet.Models;

namespace TimeSheet.Repositories
{
    public interface ITimeSheetRepository
    {
        double GetOvertime(int timeSheetId, double workDayHours);

        IEnumerable<TimeSheetEntry> GetEntries(int timeSheetId, int skip, int take, bool descending);
        TimeSheetEntry GetEntry(int entryId);
        TimeSheetEntry GetEntry(int timeSheetId, DateTime day);
        TimeSheetEntry GetLastOpenEntry(int timeSheetId);

        void AddEntry(TimeSheetEntry newEntry);
        void UpdateEntry(TimeSheetEntry updatedEntry);
        void DeleteEntry(int entryId);

        int GetDefaultTimeSheetId(int userId);

        bool HasEntryAtDay(int timeSheetId, DateTime day, int entryIdToExclude);
    }
}
