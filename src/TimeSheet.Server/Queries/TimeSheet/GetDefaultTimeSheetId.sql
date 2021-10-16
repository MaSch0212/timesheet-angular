INSERT OR IGNORE
INTO [timesheets] ([id], [name], [userid])
    VALUES (
        (SELECT [id]
	     FROM [timesheets]
	     WHERE [userid] = @userid AND [name] = '<default>')
      , '<default>'
      , @userid);

SELECT [id]
FROM [timesheets]
WHERE [userid] = @userid AND [name] = '<default>';
