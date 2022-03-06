using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class CompleteBookingViewModel
    {
        [Required]
        public string ZipCode { get; set; } = null!;
        [Required]
        public string ServiceStartDate { get; set; } = null!;
        [Required]
        public double ServiceHours { get; set; }
        public int[]? ExtraHoursList { get; set; }
        public string Comments { get; set; } = null!;
        public bool HasPets { get; set; }
        [Required]
        public int AddressId { get; set; }
        public int? FevServiceProviderID { get; set; }
    }

}