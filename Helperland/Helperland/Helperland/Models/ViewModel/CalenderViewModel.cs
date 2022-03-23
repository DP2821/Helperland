using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class CalenderViewModel
    {
        public int? Status { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public int Day { get; set; }
    }
}