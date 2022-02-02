using Helperland.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.Models.ViewModelRepository
{
    public class ContactUsRepository
    {
        public ContactU GetContactU(ContactUViewModel viewContactU)
        {
            ContactU contactU = new ContactU();
            contactU.Name = viewContactU.FirstName + " " + viewContactU.LastName;
            contactU.PhoneNumber = viewContactU.PhoneNumber;
            contactU.Email = viewContactU.Email;
            contactU.Subject = viewContactU.Subject;
            contactU.Message = viewContactU.Message;

            return contactU;
        }
    }
}
