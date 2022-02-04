namespace Helperland.Functionality
{
    public class TokenGenerator
    {
        public String GetToken()
        {
            var allChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%";
            var random = new Random();
            var resultToken = new string(
               Enumerable.Repeat(allChar, 128)
               .Select(token => token[random.Next(token.Length)]).ToArray());

            return resultToken.ToString();
        }

        public String GetToken(int length)
        {
            var allChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%";
            var random = new Random();
            var resultToken = new string(
               Enumerable.Repeat(allChar, length)
               .Select(token => token[random.Next(token.Length)]).ToArray());

            return resultToken.ToString();
        }
    }
}
