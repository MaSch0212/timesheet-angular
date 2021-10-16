SELECT e.[id]
     , e.[sheetid]
     , e.[start]
     , e.[end]
     , b.[id]
     , b.[start]
     , b.[end]
     , e.[target]
FROM [timesheetentries] e
LEFT JOIN [timesheetentrybreaks] b ON e.[id] = b.[entryid]
WHERE e.[id] = @entryid
