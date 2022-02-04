using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class LoginViewModel
    {
        [Required]
        [Display(Name = "E-mail")]
        [EmailAddress]
        public String Email { get; set; }

        [Required]
        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        public String Password { get; set; }
    }
}
