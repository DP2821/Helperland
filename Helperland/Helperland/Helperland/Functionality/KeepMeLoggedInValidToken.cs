using Helperland.Data;
using Helperland.Models;

namespace Helperland.Functionality
{
    public class KeepMeLoggedInValidToken
    {
        HelperlandContext _helperlandContext = new HelperlandContext();
        public String? GetName(String token)
        {
            if (token != null)
            {
                User user = _helperlandContext.Users.Where(u => u.KeepMeLoggedInToken == token).FirstOrDefault();

                if (user != null)
                {
                    return user.FirstName;
                }
            }
            return null;
        }

        public int? GetUserTypeId(String token)
        {
            if (token != null)
            {
                User user = _helperlandContext.Users.Where(u => u.KeepMeLoggedInToken == token).FirstOrDefault();

                if (user != null)
                {
                    return user.UserTypeId;
                }
            }
            return null;
        }

        public int GetUserId(string token){
            if(token != null){
                User user = _helperlandContext.Users.Where(u => u.KeepMeLoggedInToken == token).FirstOrDefault();

                if(user != null){
                    return user.UserId;
                }
            }

            return -1;
        }        
    }
}
