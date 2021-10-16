ALTER TABLE [timesheetentries] ADD COLUMN [target] FLOAT NULL;

UPDATE [timesheetentries]
SET [target] = (
    SELECT s.value
    FROM [timesheets] t
    JOIN [settings] s ON s.userid = t.userid AND s.settingid = 1
    WHERE t.id = timesheetentries.sheetid
    UNION ALL
    SELECT 8
    LIMIT 1
);

PRAGMA writable_schema = 1;
UPDATE SQLITE_MASTER SET SQL = 'CREATE TABLE [timesheetentries] ( [id] INTEGER NOT NULL PRIMARY KEY, [sheetid] INTEGER NOT NULL, [start] DATETIME NOT NULL, [end] DATETIME NULL, [target] FLOAT NOT NULL, FOREIGN KEY ([sheetid]) REFERENCES [timesheets] ([id]) ON DELETE CASCADE )' WHERE NAME = 'timesheetentries';
PRAGMA writable_schema = 0;

CREATE TABLE [metadata] (
    [dbversion]     INTEGER NOT NULL,
    [appversion]    VARCHAR(50) NOT NULL
);
INSERT INTO [metadata] ([dbversion], [appversion]) VALUES (2, '0');
