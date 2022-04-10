using System;
using System.Collections.Generic;
using Helperland.Data;
using Helperland.Models;
using MediatR;

namespace Helperland.Queries
{

    public class GetUserHandler : IRequestHandler<GetUserQuery, User>
    {
        private HelperlandContext _helperlandContext = new HelperlandContext();

        public async Task<User?> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            int userId = request.UserId;
            return _helperlandContext.Users.Where(u => u.UserId == userId).FirstOrDefault();
        }
    }
}
