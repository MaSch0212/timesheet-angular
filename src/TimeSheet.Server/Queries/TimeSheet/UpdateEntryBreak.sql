UPDATE [timesheetentrybreaks]
SET [start] = @start,
    [end] = @end
WHERE [id] = @breakid
