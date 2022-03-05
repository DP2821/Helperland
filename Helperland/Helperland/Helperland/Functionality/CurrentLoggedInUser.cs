using Helperland.Data;
using Helperland.Models;

namespace Helperland.Functionality
{
    public class CurrentLoggedInUser
    {
        HelperlandContext _helperlandContext = new HelperlandContext();
        
        public String? GetName(String token)
        {
            if (token != null)
            {
                string? userName = _helperlandContext.Users.Where(u => u.KeepMeLoggedInToken == token).Select(u => u.FirstName).FirstOrDefault();

                if (userName != null)
                {
                    return userName;
                }
            }
            return null;
        }

        public int GetUserTypeId(String token)
        {
            if (token != null)
            {
                int  userTypeId = _helperlandContext.Users.Where(u => u.KeepMeLoggedInToken == token).Select(u => u.UserTypeId).FirstOrDefault();

                if (userTypeId != 0)
                {
                    return userTypeId;
                }
            }
            return -1;
        }

        public int GetUserId(string token){
            if(token != null){
                int  userId = _helperlandContext.Users.Where(u => u.KeepMeLoggedInToken == token).Select(u => u.UserId).FirstOrDefault();

                if(userId != 0){
                    return userId;
                }
            }
            return -1;
        }        

        public string? GetEmail(string token){
            if(token != null){
                string? userEmail = _helperlandContext.Users.Where(u => u.KeepMeLoggedInToken == token).Select(u => u.Email).FirstOrDefault();

                if(userEmail != null){
                    return userEmail;
                }
            }

            return null;
        }
    }
}
