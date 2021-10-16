INSERT INTO [timesheetentrybreaks] ([entryid], [start], [end])
    VALUES (@entryid, @start, @end);
SELECT last_insert_rowid();
