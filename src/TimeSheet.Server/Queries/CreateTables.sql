CREATE TABLE [users] (
    [id]        INTEGER NOT NULL PRIMARY KEY,
    [givenname] VARCHAR(50) NOT NULL,
    [surname]   VARCHAR(50) NOT NULL,
    [email]     VARCHAR(100) NOT NULL
);

CREATE TABLE [accounts] (
    [name]      VARCHAR(255) NOT NULL PRIMARY KEY,
    [password]  VARCHAR(255) NOT NULL,
    [userid]    INTEGER NOT NULL,
    FOREIGN KEY ([userid]) REFERENCES [users] ([id]) ON DELETE CASCADE
);

CREATE TABLE [apikeys] (
    [id]        INTEGER NOT NULL PRIMARY KEY,
    [key]       VARCHAR(255) NOT NULL,
    [name]      VARCHAR(255) NOT NULL,
    [userid]    INTEGER NOT NULL,
    [timestamp] DATETIME NOT NULL,
    FOREIGN KEY ([userid]) REFERENCES [users] ([id]) ON DELETE CASCADE
);

CREATE TABLE [settings] (
    [userid]    INTEGER NOT NULL,
    [settingid] INTEGER NOT NULL,
    [value]     TEXT NOT NULL,
    PRIMARY KEY ([userid], [settingid]),
    FOREIGN KEY ([userid]) REFERENCES [users] ([id]) ON DELETE CASCADE
);

CREATE TABLE [timesheets] (
    [id]        INTEGER NOT NULL PRIMARY KEY,
    [name]      VARCHAR(255) NOT NULL,
    [userid]    INTEGER NOT NULL,
    FOREIGN KEY ([userid]) REFERENCES [users] ([id]) ON DELETE CASCADE
);

CREATE TABLE [timesheetentries] (
    [id]        INTEGER NOT NULL PRIMARY KEY,
    [sheetid]   INTEGER NOT NULL,
    [start]     DATETIME NOT NULL,
    [end]       DATETIME NULL,
    [target]    FLOAT NOT NULL,
    FOREIGN KEY ([sheetid]) REFERENCES [timesheets] ([id]) ON DELETE CASCADE
);

CREATE TABLE [timesheetentrybreaks] (
    [id]        INTEGER NOT NULL PRIMARY KEY,
    [entryid]   INTEGER NOT NULL,
    [start]     DATETIME NOT NULL,
    [end]       DATETIME NULL,
    FOREIGN KEY ([entryid]) REFERENCES [timesheetentries] ([id]) ON DELETE CASCADE
);

CREATE TABLE [metadata] (
    [dbversion]     INTEGER NOT NULL,
    [appversion]    VARCHAR(50) NOT NULL
);
INSERT INTO [metadata] ([dbversion], [appversion]) VALUES (2, '0');
