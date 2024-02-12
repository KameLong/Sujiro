using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.Service.AuthService;
using Sujiro.WebAPI.SignalR;
using Route = Sujiro.Data.Route;

namespace Sujiro.WebAPI.Controllers.FE
{
    public class RouteStationAppendDTO
    {
        public long stationID { get; set; }
        public long? routeStationID { get; set; }
    }


    public class  EditRoute :Route
    {
        public List<RouteStation> RouteStations { get; set; } = new List<RouteStation>();
        public EditRoute():base()
        {
        }
        public EditRoute(SqliteDataReader reader):base(reader)
        {
        }
        
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RouteEditPageController : SujiroAPIController
    {
        public RouteEditPageController(IHubContext<SujirawHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
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
                var editRoute = Route.GetRoute<EditRoute>(filePath, routeID);
                if (editRoute == null)
                {
                       return NotFound();
                }
                var routeStations = RouteStation.GetAllRouteStations<RouteStation>(filePath, routeID);
                editRoute.RouteStations = routeStations;
                return Ok(editRoute);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("insert/{companyID}/{routeID}")]
        public async Task<ActionResult> InsertRouteStation(long companyID,long routeID, [FromBody] RouteStationAppendDTO routeStationAppend)
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
                RouteStation routeStation = new RouteStation();
                routeStation.RouteID = routeID;
                routeStation.StationID = routeStationAppend.stationID;
                var editRoute = Route.GetRoute<EditRoute>(filePath, routeID);
                if (editRoute == null)
                {
                    return NotFound();
                }
                RouteStation.InsertRouteStation(filePath, routeID, routeStationAppend.stationID, routeStationAppend.routeStationID);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }
        
        
    }
}
