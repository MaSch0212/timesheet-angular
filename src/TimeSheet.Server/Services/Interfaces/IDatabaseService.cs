using System.Data;

namespace TimeSheet.Services
{
    public interface IDatabaseService
    {
        IDbConnection Database { get; }

        IDbCommand CreateCommand(string queryString);
    }
}
