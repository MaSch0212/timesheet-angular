SELECT 1
FROM [timesheetentries]
WHERE [sheetid] = @sheetid AND date([start]) = date(@day) AND [id] != @excludedid
