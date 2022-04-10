using System;
using System.Collections.Generic;
using Helperland.Data;
using Helperland.Models;
using MediatR;

namespace Helperland.Queries
{

    public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<User>>
    {
        HelperlandContext _helperlandContext = new HelperlandContext();
        public async Task<List<User>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            List<User> users = _helperlandContext.Users.ToList();
            return users;
        }
    }
}
