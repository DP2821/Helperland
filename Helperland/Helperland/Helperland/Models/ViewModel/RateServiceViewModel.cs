using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class RateServiceViewModel{
        [Required]
        public int ServiceId { get; set; }
        [Required]
        public int ServiceProviderId { get; set; }
        [Required]
        public string? Comments { get; set; }
        [Required]
        public int OnTime { get; set; }
        [Required]
        public int Friendly { get; set; }
        [Required]
        public int QualityOfService { get; set; }
        [Required]
        public double Average { get; set; }
    }
}