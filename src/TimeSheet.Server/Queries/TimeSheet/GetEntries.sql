SELECT e.[id]
     , e.[sheetid]
     , e.[start]
     , e.[end]
     , b.[id]
     , b.[start]
     , b.[end]
     , e.[target]
FROM (
	SELECT *
	FROM [timesheetentries]
	WHERE [sheetid] = @sheetid
	ORDER BY [start] {0}
	LIMIT @take OFFSET @skip
) e
LEFT JOIN [timesheetentrybreaks] b ON e.[id] = b.[entryid]
ORDER BY e.[start] {0}, b.[start] ASC
