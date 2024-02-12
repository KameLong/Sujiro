using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Sujiro.Data;
using Sujiro.WebAPI.Service.AuthService;
using Sujiro.WebAPI.SignalR;

namespace Sujiro.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class RouteStationController : SujiroAPIController
    {
        public RouteStationController(IHubContext<SujirawHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }
        [HttpGet("{companyID}/{routeID}")]
        public async Task<ActionResult> Get(long companyID, long routeID)
        {
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            try
            {
                string filePath = Configuration["ConnectionStrings:DBdir"] + $"company_{companyID}.sqlite";
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                var routeStations = RouteStation.GetAllRouteStations<RouteStation>(filePath, routeID);
                return Ok(routeStations);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("{companyID}")]
        public async Task<ActionResult> Put(long companyID, [FromBody]RouteStation routeStation)
        {
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            try
            {
                string filePath = Configuration["ConnectionStrings:DBdir"] + $"company_{companyID}.sqlite";
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                RouteStation.PutRouteStation(filePath, routeStation);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpDelete("{companyID}/{routeStationID}")]
        public async Task<ActionResult> Delete(long companyID, long routeStationID)
        {
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            try
            {
                string filePath = Configuration["ConnectionStrings:DBdir"] + $"company_{companyID}.sqlite";
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                RouteStation.DeleteRouteStation(filePath, routeStationID);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
