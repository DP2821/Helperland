using Helperland.Commands;
using Helperland.Data;
using Helperland.Models;
using Helperland.Models.TempViewModel;
using Helperland.Models.ViewModel;
using Helperland.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Helperland.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerWebApiController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CustomerWebApiController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public IActionResult GetData()
        {
            var query = new GetAllUsersQuery();
            var result = _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetData(int id)
        {
            var query = new GetUserQuery(id);
            var result = _mediator.Send(query);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost("")]
        public IActionResult PostData([FromBody]CustomerViewModel model)
        {
            var query = new CreateCustomerCommand(model);
            var result = _mediator.Send(query);
            return Ok(result);
        }
    }
}