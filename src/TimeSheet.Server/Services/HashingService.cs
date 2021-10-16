using System;
using System.Linq;
using System.Security.Cryptography;

namespace TimeSheet.Services
{
    public class HashingService : IHashingService
    {
        public const string Pbkdf2AlgorihtmName = "pbkdf2";

        public const string AlgorithmName = Pbkdf2AlgorihtmName;
        public const int SaltSize = 8;
        public const int HashSize = 24;
        public const int IterationCount = 5000;

        public const int AlgorithmIndex = 0;
        public const int IterationIndex = 1;
        public const int SaltIndex = 2;
        public const int HashIndex = 3;

        public const char Separator = ':';

        public string CreateHash(string password)
        {
            var cryptoProvider = new RNGCryptoServiceProvider();
            byte[] salt = new byte[SaltSize];
            cryptoProvider.GetBytes(salt);

            var hash = GetPbkdf2Bytes(password, salt, IterationCount, HashSize);
            return string.Concat(AlgorithmName, Separator, IterationCount, Separator, Base64(salt), Separator, Base64(hash));
        }

        public bool ValidateHash(string password, string correctHash)
        {
            var split = correctHash.Split(Separator);
            var algoName = split[AlgorithmIndex];
            var iterations = int.Parse(split[IterationIndex]);
            var salt = Base64(split[SaltIndex]);
            var hash = Base64(split[HashIndex]);

            byte[] testHash;
            if (algoName == Pbkdf2AlgorihtmName)
                testHash = GetPbkdf2Bytes(password, salt, iterations, hash.Length);
            else
                throw new NotSupportedException($"The hash algorithm \"{algoName}\" is not supported.");

            return hash.SequenceEqual(testHash);
        }

        private static byte[] GetPbkdf2Bytes(string password, byte[] salt, int iterations, int hashSize)
        {
            var pbkdf2 = new Rfc2898DeriveBytes(password ?? string.Empty, salt);
            pbkdf2.IterationCount = iterations;
            return pbkdf2.GetBytes(hashSize);
        }

        private static string Base64(byte[] bytes) => Convert.ToBase64String(bytes);
        private static byte[] Base64(string data) => Convert.FromBase64String(data);
    }
}
