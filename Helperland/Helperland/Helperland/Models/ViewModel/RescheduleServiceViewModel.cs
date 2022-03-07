using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class RescheduleServiceViewModel
    {
        [Required]
        public int ServiceId { get; set; } 
        [Required]
        public string NewServiceDate { get; set; } = null!;
        [Required]
        public string NewServicetime { get; set; } = null!;
    }
}