INSERT INTO [timesheetentries] ([sheetid], [start], [end], [target])
    VALUES (@sheetid, @start, @end, @target);
SELECT last_insert_rowid();
