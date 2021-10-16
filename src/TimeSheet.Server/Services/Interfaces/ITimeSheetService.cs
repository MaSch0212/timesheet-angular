using System;
using System.Collections.Generic;
using TimeSheet.Models;

namespace TimeSheet.Services
{
    public interface ITimeSheetService
    {
        double GetOvertime(int userId);
        IEnumerable<TimeSheetEntry> GetEntries(int userId, int skip, int take, bool descending);
        void DeleteEntry(int userId, int entryId);
        void EditEntry(int userId, TimeSheetEntry newEntry);
        int AddEntry(int userId, TimeSheetEntry newEntry);
        void CheckIn(int userId, DateTime timeStamp);
        void CheckOut(int userId, DateTime timeStamp);
    }
}
