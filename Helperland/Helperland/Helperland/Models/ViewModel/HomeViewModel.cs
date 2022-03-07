namespace Helperland.Models.ViewModel
{
    public class HomeViewModel
    {
        public LoginViewModel Login { get; set; } = new LoginViewModel();
        public ForgotPasswordViewModel Forgot { get; set; } = new ForgotPasswordViewModel();
    }
}
