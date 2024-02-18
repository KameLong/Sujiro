using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.Data.Common;
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
            public List<Route> routes { get; set;}
            public Company company { get; set;}
        }



        public MenuPageController(IHubContext<SujirawHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
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
                var result = new MenuData();
                result.routes= Route.GetAllRoute(filePath);
                result.company=Company.GetCompany(Path.Combine(Configuration["ConnectionStrings:DBdir"],MasterData.MASTER_DATA_FILE), companyID);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return StatusCode(500);
            }
        }
    }
}

