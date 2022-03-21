using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class SignUpViewModel
    {
        [Required]
        [Display(Name = "First name")]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$", 
         ErrorMessage = "Characters are not allowed.")]
        public string FirstName { get; set; } = null!;

        [Required]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$", 
         ErrorMessage = "Characters are not allowed.")]
        [Display(Name = "Last name")]
        public string LastName { get; set; } = null!;

        [Required]
        [Display(Name = "E-mail")]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [Display(Name = "Phone number")]
        [DataType(DataType.PhoneNumber)]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Phone number should be 10 digit only.")]
        public string PhoneNumber { get; set; } = null!;

        [Required]
        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        [RegularExpression("^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$", ErrorMessage = "Passwords must be at least 8 characters and contain at 3 of 4 of the following: upper case (A-Z), lower case (a-z), number (0-9) and special character (e.g. !@#$%^&*)")]
        public string Password { get; set; } = null!;

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The passwords do not match.")]
        public string ConfirmPassword { get; set; } = null!;

        [Required]
        public bool IsPrivacyPolicy { get; set; }
    }
}
