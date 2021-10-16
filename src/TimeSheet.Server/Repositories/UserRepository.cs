using System.Collections.Generic;
using System.Data;
using TimeSheet.Extensions;
using TimeSheet.Models;
using TimeSheet.Services;

namespace TimeSheet.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IDatabaseService _databaseService;

        public UserRepository(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public string GetUserPasswordHash(string username)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetUserPasswordHash))
            {
                cmd.AddParameterWithValue("@username", username);
                return (string)cmd.ExecuteScalar();
            }
        }

        public User GetUserByUsername(string username)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetUserByUsername))
            {
                cmd.AddParameterWithValue("@username", username);

                using (var reader = cmd.ExecuteReader())
                    return GetUser(reader);
            }
        }

        public User GetUserById(int userId)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetUserById))
            {
                cmd.AddParameterWithValue("@userid", userId);

                using (var reader = cmd.ExecuteReader())
                    return GetUser(reader);
            }
        }

        public bool IsUsernameGiven(string username)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.IsUsernameGiven))
            {
                cmd.AddParameterWithValue("@username", username);

                return ((long?)cmd.ExecuteScalar() ?? 0) > 0;
            }
        }

        public int CreateUser(string username, string password, User userInfo)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.CreateUser))
            {
                cmd.AddParameterWithValue("@givenname", userInfo.GivenName);
                cmd.AddParameterWithValue("@surname", userInfo.Surname);
                cmd.AddParameterWithValue("@email", userInfo.Email);
                cmd.AddParameterWithValue("@username", username);
                cmd.AddParameterWithValue("@password", password);

                var userId = (long)cmd.ExecuteScalar();
                userInfo.Id = (int)userId;
                return (int)userId;
            }
        }

        public void UpdateUser(User userInfo)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.UpdateUser))
            {
                cmd.AddParameterWithValue("@id", userInfo.Id);
                cmd.AddParameterWithValue("@givenname", userInfo.GivenName);
                cmd.AddParameterWithValue("@surname", userInfo.Surname);
                cmd.AddParameterWithValue("@email", userInfo.Email);

                cmd.ExecuteNonQuery();
            }
        }

        public (string username, string passwordHash)? GetFirstAccountOfUser(int userId)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.GetFirstAccountOfUser))
            {
                cmd.AddParameterWithValue("@userid", userId);

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                        return (reader.GetString(0), reader.GetString(1));
                    return null;
                }
            }
        }

        public void ChangePassword(string username, string newPasswordHash)
        {
            using (var cmd = _databaseService.CreateCommand(SqlQueryAccessor.UpdatePassword))
            {
                cmd.AddParameterWithValue("@name", username);
                cmd.AddParameterWithValue("@password", newPasswordHash);

                cmd.ExecuteNonQuery();
            }
        }

        private static User GetUser(IDataReader reader)
        {
            if (!reader.Read())
                return null;
            return new User
            {
                Id = reader.GetInt32(0),
                GivenName = reader.GetString(1),
                Surname = reader.GetString(2),
                Email = reader.GetString(3)
            };
        }
    }
}
