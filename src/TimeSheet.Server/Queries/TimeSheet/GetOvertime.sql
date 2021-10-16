SELECT (
	SELECT SUM(julianday([end]) - julianday([start])) * 24 - SUM([target])
	FROM [timesheetentries]
	WHERE [sheetid] = @timesheetid AND [end] IS NOT NULL
) - (
	SELECT SUM(julianday(b.[end]) - julianday(b.[start])) * 24
	FROM [timesheetentrybreaks] b
	JOIN [timesheetentries] e ON b.[entryid] = e.[id]
	WHERE e.[sheetid] = @timesheetid AND e.[end] IS NOT NULL AND b.[end] IS NOT NULL
)
