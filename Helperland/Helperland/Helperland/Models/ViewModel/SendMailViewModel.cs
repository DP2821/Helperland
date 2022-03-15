using System.ComponentModel.DataAnnotations;

namespace Helperland.Models.ViewModel
{
    public class SendMailViewModel{
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Body { get; set; } = null!;
    }
}