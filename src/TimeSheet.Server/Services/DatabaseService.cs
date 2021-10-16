using System;
using System.Data;
using System.IO;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using TimeSheet.Extensions;

namespace TimeSheet.Services
{
    public class DatabaseService : IDatabaseService
    {
        private readonly IConfiguration _configuration;

        private readonly object _databaseLock = new();
        private IDbConnection _database;
        public IDbConnection Database => GetDatabaseConnection();

        public DatabaseService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IDbCommand CreateCommand(string queryString)
        {
            var result = Database.CreateCommand();
            result.CommandText = queryString;
            return result;
        }

        private IDbConnection GetDatabaseConnection()
        {
            lock (_databaseLock)
            {
                if (_database != null)
                    return _database;

                var dataPath = _configuration["RUNSINDOCKER"] == "true" ? "/data" : Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data");
                var file = Path.Combine(dataPath, "timesheet.db");
                bool isNew = !File.Exists(file);

                Directory.CreateDirectory(Path.GetDirectoryName(file));
                var connectionString = $"Mode=ReadWriteCreate;Data Source={file};Cache=Shared;";

                var connection = new SqliteConnection(connectionString);
                connection.Open();
                if (isNew)
                    CreateTables(connection);
                MigrateIfNeeded(connection);
                _database = connection;
                return connection;
            }
        }

        private static void CreateTables(IDbConnection connection)
        {
            using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = SqlQueryAccessor.CreateTables;
                cmd.ExecuteNonQuery();
            }
        }

        private static void MigrateIfNeeded(IDbConnection connection)
        {
            using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = SqlQueryAccessor.GetDbVersion;
                int dbVersion = 0;
                try { dbVersion = (int)(long)cmd.ExecuteScalar(); } catch { }

                if (dbVersion < 2)
                {
                    cmd.CommandText = SqlQueryAccessor.MigrateV1ToV2;
                    cmd.ExecuteNonQuery();
                }

                cmd.CommandText = SqlQueryAccessor.UpdateAppVersion;
                cmd.AddParameterWithValue("@appversion", typeof(DatabaseService).Assembly.GetName().Version.ToString());
                cmd.ExecuteNonQuery();
            }
        }
    }
}
