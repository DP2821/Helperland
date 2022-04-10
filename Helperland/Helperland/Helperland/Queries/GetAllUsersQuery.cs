using System;
using System.Collections.Generic;
using Helperland.Models;
using MediatR;

namespace Helperland.Queries
{    
    public class GetAllUsersQuery : IRequest<List<User>>
    {

    }
}