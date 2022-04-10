using System;
using System.Collections.Generic;
using System.Net;
using Helperland.Commands;
using Helperland.Data;
using Helperland.Models;
using MediatR;

namespace Helperland.Queries
{

    public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, HttpResponseMessage>
    {
        HelperlandContext _helperlandContext = new HelperlandContext();

        public async Task<HttpResponseMessage> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
        {
            User user = new User();
            
            user.ModifiedBy = 1;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.Mobile = request.PhoneNumber;

            user.Password = request.Password;
            user.UserTypeId = 1;
            user.CreatedDate = DateTime.Now;
            user.ModifiedDate = DateTime.Now;

            _helperlandContext.Users.Add(user);
            _helperlandContext.SaveChanges();
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.Created);
            return response;

        }
    }
}
