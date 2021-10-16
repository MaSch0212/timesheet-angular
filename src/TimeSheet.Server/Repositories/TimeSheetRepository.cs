using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using TimeSheet.Extensions;
using TimeSheet.Models;
using TimeSheet.Services;

namespace TimeSheet.Repositories
{
    public class TimeSheetRepository : ITimeSheetRepository
    {
        private readonly IDatabaseService _databaseService;

        public TimeSheetRepository(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public void AddEntry(TimeSheetEntry newEntry)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.CreateEntry))
            {
                cmd.AddParameterWithValue("@sheetid", newEntry.SheetId);
                cmd.AddParameterWithValue("@start", newEntry.Start.ToUniversalTime().ToString("o"));
                cmd.AddParameterWithValue("@end", newEntry.End?.ToUniversalTime().ToString("o"));
                cmd.AddParameterWithValue("@target", newEntry.TargetHours);

                newEntry.Id = (int)(long)cmd.ExecuteScalar();
            }

            foreach (var b in newEntry.Breaks)
                AddBreak(newEntry.Id, b);
        }

        public void DeleteEntry(int entryId)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.DeleteEntry))
            {
                cmd.AddParameterWithValue("@entryid", entryId);

                cmd.ExecuteNonQuery();
            }
        }

        public int GetDefaultTimeSheetId(int userId)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetDefaultTimeSheetId))
            {
                cmd.AddParameterWithValue("@userid", userId);

                return (int)(long)cmd.ExecuteScalar();
            }
        }

        public IEnumerable<TimeSheetEntry> GetEntries(int timeSheetId, int skip, int take, bool descending)
        {
            var query = string.Format(SqlQueryAccessor.GetEntries, descending ? "DESC" : "ASC");
            using (var cmd = _databaseService.CreateCommand(query))
            {
                cmd.AddParameterWithValue("@sheetid", timeSheetId);
                cmd.AddParameterWithValue("@skip", skip);
                cmd.AddParameterWithValue("@take", take);

                using (var reader = cmd.ExecuteReader())
                    return GetEntries(reader).ToArray();
            }
        }

        public TimeSheetEntry GetEntry(int entryId)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetEntry))
            {
                cmd.AddParameterWithValue("@entryid", entryId);

                using (var reader = cmd.ExecuteReader())
                    return GetEntries(reader).FirstOrDefault();
            }
        }

        public TimeSheetEntry GetEntry(int timeSheetId, DateTime day)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetEntryOfDay))
            {
                cmd.AddParameterWithValue("@sheetid", timeSheetId);
                cmd.AddParameterWithValue("@day", day.ToUniversalTime().ToString("o"));

                using (var reader = cmd.ExecuteReader())
                    return GetEntries(reader).FirstOrDefault();
            }
        }

        public double GetOvertime(int timeSheetId, double workDayHours)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetOvertime))
            {
                cmd.AddParameterWithValue("@workdayhours", workDayHours);
                cmd.AddParameterWithValue("@timesheetid", timeSheetId);

                var result = cmd.ExecuteScalar();
                return result == DBNull.Value ? 0 : (double)result;
            }
        }

        public void UpdateEntry(TimeSheetEntry updatedEntry)
        {
            var oldEntry = GetEntry(updatedEntry.Id);
            if (oldEntry == null)
                throw new InvalidOperationException($"An entry with the id {updatedEntry.Id} does not exist. Update not possible.");
            if (oldEntry.SheetId != updatedEntry.SheetId)
                throw new InvalidOperationException("Entries cannot be moved between sheets.");

            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.UpdateEntry))
            {
                cmd.AddParameterWithValue("@entryid", updatedEntry.Id);
                cmd.AddParameterWithValue("@start", updatedEntry.Start.ToUniversalTime().ToString("o"));
                cmd.AddParameterWithValue("@end", updatedEntry.End?.ToUniversalTime().ToString("o"));
                cmd.AddParameterWithValue("@target", updatedEntry.TargetHours);

                cmd.ExecuteNonQuery();
            }

            var oldIds = new HashSet<int>(oldEntry.Breaks.Select(x => x.Id));
            var newIds = new HashSet<int>(updatedEntry.Breaks.Select(x => x.Id));

            // Delete old breaks
            foreach (var b in oldEntry.Breaks.Where(x => !newIds.Contains(x.Id)))
                DeleteBreak(b.Id);

            // Update breaks
            foreach (var b in updatedEntry.Breaks.Where(x => oldIds.Contains(x.Id)))
                UpdateBreak(b);

            // Add breaks
            foreach (var b in updatedEntry.Breaks.Where(x => !oldIds.Contains(x.Id)))
                AddBreak(updatedEntry.Id, b);
        }

        public TimeSheetEntry GetLastOpenEntry(int timeSheetId)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetLastOpenEntry))
            {
                cmd.AddParameterWithValue("@sheetid", timeSheetId);

                using (var reader = cmd.ExecuteReader())
                    return GetEntries(reader).FirstOrDefault();
            }
        }

        public bool HasEntryAtDay(int timeSheetId, DateTime day, int entryIdToExclude)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.HasEntryAtDay))
            {
                cmd.AddParameterWithValue("@sheetid", timeSheetId);
                cmd.AddParameterWithValue("@day", day.ToUniversalTime().ToString("o"));
                cmd.AddParameterWithValue("@excludedid", entryIdToExclude);

                return ((long?)cmd.ExecuteScalar() ?? 0) > 0;
            }
        }

        private IEnumerable<TimeSheetEntry> GetEntries(IDataReader reader)
        {
            TimeSheetEntry current = null;
            while (reader.Read())
            {
                if (current == null || current.Id != reader.GetInt32(0))
                {
                    if (current != null)
                        yield return current;
                    current = new TimeSheetEntry
                    {
                        Id = reader.GetInt32(0),
                        SheetId = reader.GetInt32(1),
                        Start = reader.GetDateTime(2).ToUniversalTime(),
                        End = reader.IsDBNull(3) ? (DateTime?)null : reader.GetDateTime(3).ToUniversalTime(),
                        TargetHours = reader.GetFloat(7)
                    };
                }

                if (!reader.IsDBNull(4))
                {
                    current.Breaks.Add(new Break
                    {
                        Id = reader.GetInt32(4),
                        Start = reader.GetDateTime(5).ToUniversalTime(),
                        End = reader.IsDBNull(6) ? (DateTime?)null : reader.GetDateTime(6).ToUniversalTime()
                    });
                }
            }
            if (current != null)
                yield return current;
        }

        private void AddBreak(int entryId, Break newBreak)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.CreateEntryBreak))
            {
                cmd.AddParameterWithValue("@entryid", entryId);
                cmd.AddParameterWithValue("@start", newBreak.Start.ToUniversalTime().ToString("o"));
                cmd.AddParameterWithValue("@end", newBreak.End?.ToUniversalTime().ToString("o"));

                newBreak.Id = (int)(long)cmd.ExecuteScalar();
            }
        }

        private void UpdateBreak(Break updatedBreak)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.UpdateEntryBreak))
            {
                cmd.AddParameterWithValue("@breakid", updatedBreak.Id);
                cmd.AddParameterWithValue("@start", updatedBreak.Start.ToUniversalTime().ToString("o"));
                cmd.AddParameterWithValue("@end", updatedBreak.End?.ToUniversalTime().ToString("o"));

                cmd.ExecuteNonQuery();
            }
        }

        private void DeleteBreak(int breakId)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.DeleteEntryBreak))
            {
                cmd.AddParameterWithValue("@breakid", breakId);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
