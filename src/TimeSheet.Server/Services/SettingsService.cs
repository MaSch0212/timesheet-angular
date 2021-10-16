using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using Base62;
using Microsoft.AspNetCore.Http;
using TimeSheet.Common;
using TimeSheet.Models;
using TimeSheet.Repositories;

namespace TimeSheet.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly ISettingsRepository _settingsRepository;

        public SettingsService(ISettingsRepository settingsRepository)
        {
            _settingsRepository = settingsRepository;
        }

        public Settings GetSettings(int userId)
        {
            var result = new Settings();

            foreach (var value in _settingsRepository.GetSettings(userId))
            {
                var property = Settings.Metadata.FirstOrDefault(x => x.Id == value.Key);
                if (property == null)
                    continue;

                property.SetString(result, value.Value);
            }

            foreach (var key in _settingsRepository.GetAllApiKeysOfUser(userId))
            {
                result.ApiKeys.Add(new ApiKey
                {
                    Id = key.id,
                    Name = key.name,
                    CreatedAt = key.timestamp
                });
            }

            return result;
        }

        public T GetSetting<T>(int userId, string settingName)
        {
            var property = Settings.Metadata.Single(x => x.Name == settingName);
            var dbValue = _settingsRepository.GetSetting(userId, property.Id);
            if (dbValue == null)
                return (T)property.DefaultValue;
            return property.StringToValue<T>(dbValue);
        }

        public void UpdateSettings(int userId, Settings updatedSettings)
        {
            var oldSettings = GetSettings(userId);

            foreach (var property in Settings.Metadata)
            {
                var oldValue = property.GetValue(oldSettings);
                var newValue = property.GetValue(updatedSettings);
                if (Equals(oldValue, newValue))
                    continue;

                _settingsRepository.SetSetting(userId, property.Id, property.ValueToString(newValue));
            }
        }

        public (string key, ApiKey keyInfo) CreateApiKey(int userId, string name)
        {

            string key;
            using (var cryptoProvider = new RNGCryptoServiceProvider())
            {
                byte[] keyBytes = new byte[32];
                do
                {
                    cryptoProvider.GetBytes(keyBytes);
                    key = keyBytes.ToBase62();
                } while(_settingsRepository.GetUserIdOfApiKey(key).HasValue);
            }

            var result = new ApiKey
            {
                Name = name,
                CreatedAt = DateTime.UtcNow
            };

            result.Id = _settingsRepository.CreateApiKey(key, result.Name, userId, result.CreatedAt);
            return (key, result);
        }

        public void RemoveApiKey(int userId, int keyId)
        {
            var realUserId = _settingsRepository.GetUserIdOfApiKey(keyId);
            if (!realUserId.HasValue)
                throw new ValidationException(StatusCodes.Status400BadRequest, $"The api key does not exist.");
            if (userId != realUserId)
                throw new ValidationException(StatusCodes.Status401Unauthorized, $"The api key is owned by another user.");
            _settingsRepository.RemoveApiKey(keyId);
        }
    }
}
