using Helperland.Data;
using Helperland.GlobalVariable;
using Helperland.Models.ViewModel;

namespace Helperland.Models.ViewModelRepository
{
    public class SignUpRepository : GlobalData
    {
        HelperlandContext _helperlandContext = new HelperlandContext();

        public User GetUser(SignUpViewModel signUpViewModel)
        {
            User user = new User();

            if (_helperlandContext.Users.Max(u => (int?)u.UserId) == null)
            {
                /*user.UserId = 1;*/
                user.ModifiedBy = 1;
            }
            else
            {
                /*user.UserId = (int)(_helperlandContext.Users.Max(u => u.UserId) + 1);*/
                user.ModifiedBy = (int)(_helperlandContext.Users.Max(u => u.UserId) + 1);
            }
            user.FirstName = signUpViewModel.FirstName;
            user.LastName = signUpViewModel.LastName;
            user.Email = signUpViewModel.Email;
            user.Mobile = signUpViewModel.PhoneNumber;
            user.Password = signUpViewModel.Password;
            user.UserTypeId = CustomerTypeId;
            user.CreatedDate = DateTime.Now;
            user.ModifiedDate = DateTime.Now;

            return user;


        }
    }
}
