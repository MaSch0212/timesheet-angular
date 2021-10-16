using System.Collections.Generic;
using TimeSheet.Models;

namespace TimeSheet.Repositories
{
    public interface IUserRepository
    {
        string GetUserPasswordHash(string username);
        User GetUserByUsername(string username);
        User GetUserById(int userId);
        int CreateUser(string username, string password, User userInfo);
        void UpdateUser(User userInfo);

        bool IsUsernameGiven(string username);
        (string username, string passwordHash)? GetFirstAccountOfUser(int userId);
        void ChangePassword(string username, string newPasswordHash);
    }
}
