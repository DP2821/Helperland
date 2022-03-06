using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [Display(Name = "E-mail")]
        [EmailAddress]
        public string? Email { get; set; }
    }
}
