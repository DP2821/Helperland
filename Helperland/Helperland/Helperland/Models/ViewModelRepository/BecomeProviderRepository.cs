using Helperland.Data;
using Helperland.GlobalVariable;
using Helperland.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace Helperland.Models.ViewModelRepository
{
    public class BecomeProviderRepository : GlobalData
    {

        HelperlandContext _helperlandContext = new HelperlandContext();

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
            user.Password = becomeProviderViewModel.Password;
            user.UserTypeId = SpTypeId;
            user.CreatedDate = DateTime.Now;
            user.ModifiedDate = DateTime.Now;

            return user;


        }


    }

}