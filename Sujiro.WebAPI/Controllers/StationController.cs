using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.Service.AuthService;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;
using System.Security.Claims;

namespace Sujiro.WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class StationController : SujiroAPIController
    {
        public StationController(IHubContext<ChatHub> hubContext, IConfiguration configuration):base(hubContext, configuration)
        {
        }

        [HttpGet("{companyID}")]
        public async Task<ActionResult> Get(long companyID)
        {
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            try
            {
                string filePath = Configuration["ConnectionStrings:DBdir"]+$"company_{companyID}.sqlite";
                if(!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                var stations = Station.GetAllStation(filePath);
                return Ok(stations);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("{companyID}")]
        public async Task<ActionResult> Update(long companyID, [FromBody] Station station)
        {
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            try
            {
                string filePath = Configuration["ConnectionStrings:DBdir"]+$"company_{companyID}.sqlite";
                if(!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                Station.ReplaceStation(filePath, station);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpDelete("{companyID}/{stationID}")]
        public async Task<ActionResult> Update(long companyID, long stationID)
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
                Station.DeleteStation(filePath, stationID);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
