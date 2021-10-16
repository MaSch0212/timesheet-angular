namespace TimeSheet.Services
{
    public interface IHashingService
    {
        string CreateHash(string password);
        bool ValidateHash(string password, string correctHash);
    }
}
