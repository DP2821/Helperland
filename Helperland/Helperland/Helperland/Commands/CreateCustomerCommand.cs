using Helperland.Models.TempViewModel;
using MediatR;

namespace Helperland.Commands
{
    public class CreateCustomerCommand : IRequest<HttpResponseMessage>
    {
        public string FirstName { get; } = null!;

        public string LastName { get; } = null!;

        public string Email { get; } = null!;

        public string PhoneNumber { get; } = null!;

        public string Password { get; } = null!;

        public CreateCustomerCommand(CustomerViewModel model)
        {
            FirstName = model.FirstName;
            LastName = model.LastName;
            Email = model.Email;
            PhoneNumber = model.PhoneNumber;
            Password = model.Password;

        }
    }
}
