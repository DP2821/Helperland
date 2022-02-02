using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.Models.ViewModel
{
    public class ContactUViewModel
    {
        [Required]
        [Display(Name = "First name")]
        public String FirstName { get; set; }

        [Required]
        [Display(Name = "Last name")]
        public String LastName { get; set; }

        [Required]
        [Display(Name = "Phone number")]
        [DataType(DataType.PhoneNumber)]
        public String PhoneNumber { get; set; }

        [Required]
        [Display(Name = "E-mail")]
        [EmailAddress]
        public String Email { get; set; }

        [Required]
        [Display(Name = "Subject")]
        public String Subject { get; set; }

        [Required]
        [Display(Name ="Message")]
        public String Message { get; set; }
    }
}
