using System.Security.Claims;
using TimeSheet.Models;

namespace TimeSheet.Services
{
    public interface ISessionService
    {
        string Authenticate(string username, string password, bool stayLoggedIn);
        string Register(string username, string password, User userInfo);
        void ChangePassword(int userId, string oldPassword, string newPassword);

        User ValidateApiKey(string key);
        User GetUserInfo(int userId);
        string EditUserInfoAndRetrieveNewToken(ClaimsPrincipal user, User newInfo);

        int GetUserId(ClaimsPrincipal user);
    }
}
