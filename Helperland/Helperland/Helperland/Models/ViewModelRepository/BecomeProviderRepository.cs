using Helperland.Data;
using Helperland.GlobalVariable;
using Helperland.Models.ViewModel;
using System.Security.Cryptography;

namespace Helperland.Models.ViewModelRepository
{
    public class BecomeProviderRepository : GlobalData
    {

        HelperlandContext _helperlandContext = new HelperlandContext();
        MD5 md5Hash = MD5.Create();

        public User GetUser(BecomeProviderViewModel becomeProviderViewModel)
        {
            User user = new User();

            if(_helperlandContext.Users.Max(u => (int?)u.UserId) == null)
            {
                /*user.UserId = 1;*/
                user.ModifiedBy = 1;
            }
            else
            {
                /*user.UserId = (int)(_helperlandContext.Users.Max(u => u.UserId) + 1);*/
                user.ModifiedBy = (int)(_helperlandContext.Users.Max(u => u.UserId) + 1);
            }
            user.FirstName = becomeProviderViewModel.FirstName;
            user.LastName = becomeProviderViewModel.LastName;
            user.Email = becomeProviderViewModel.Email;
            user.Mobile = becomeProviderViewModel.PhoneNumber;

            string hashPassword = new MD5Hashing().GetMd5Hash(md5Hash, becomeProviderViewModel.Password);
            user.Password = hashPassword;
            user.UserTypeId = SpTypeId;
            user.CreatedDate = DateTime.Now;
            user.ModifiedDate = DateTime.Now;

            return user;


        }


    }

}