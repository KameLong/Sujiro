using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.Service.AuthService;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;
using System.Security.Claims;
using static System.Formats.Asn1.AsnWriter;
using Route = Sujiro.Data.Route;

namespace Sujiro.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MenuPageController : SujiroAPIController
    {

        public class MenuData
        {
            List<Route> routes;
        }



        public MenuPageController(IHubContext<ChatHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpGet("company/{companyID}")]
        public async Task<ActionResult> GetTimeTaleData(long companyID)
        {
            try
            {
                if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
                {
                    return Forbid();
                }
                string filePath = Configuration["ConnectionStrings:DBdir"] + $"company_{companyID}.sqlite";
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                var routes = Route.GetAllRoute(filePath);
                return Ok(routes);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return StatusCode(500);
            }
        }
    }
}

