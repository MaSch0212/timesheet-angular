UPDATE [timesheetentries]
SET [start] = @start,
    [end] = @end,
    [target] = @target
WHERE [id] = @entryid
