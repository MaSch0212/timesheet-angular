using System.Collections.Generic;
using TimeSheet.Models;

namespace TimeSheet.Services
{
    public interface ISettingsService
    {
        Settings GetSettings(int userId);
        T GetSetting<T>(int userId, string settingName);

        void UpdateSettings(int userId, Settings updatedSettings);

        (string key, ApiKey keyInfo) CreateApiKey(int userId, string name);
        void RemoveApiKey(int userId, int keyId);
    }
}
