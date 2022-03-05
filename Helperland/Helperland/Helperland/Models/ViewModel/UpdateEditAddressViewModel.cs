using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class UpdateEditAddressViewModel
    {
        [Required]
        public int AddressId { get; set; }
        [Required]
        public string AddressLine1 { get; set; }
        [Required]
        public string AddressLine2 { get; set; }
        public string PostalCode { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Mobile { get; set; }
    }
}