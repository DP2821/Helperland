using System;
using System.Collections.Generic;
using Helperland.Models;
using MediatR;

namespace Helperland.Queries
{    
    public class GetUserQuery : IRequest<User>
    {
        public int UserId { get; }

        public GetUserQuery(int id)
        {
            UserId  = id;
        }

    }
}