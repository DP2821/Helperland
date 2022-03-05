using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class CancelServiceViewModel
    {
        [Required]
        public int ServiceId { get; set; } 
        [Required]
        public string Comments { get; set; }

    }
}