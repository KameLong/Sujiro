using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.SignalR;

namespace Sujiro.WebAPI.Controllers.SujirawData
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StopTimeController : SujiroAPIController
    {
        public StopTimeController(IHubContext<SujirawHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpPut("{companyID}")]
        public async Task<ActionResult> Put(long companyID, StopTime stopTime)
        {
            try
            {
                DateTime now = DateTime.Now;
                var dbpath = Configuration["ConnectionStrings:DBdir"] + "company_" + companyID + ".sqlite";
                using (var conn = new SqliteConnection("Data Source=" + dbpath))
                {
                    conn.Open();
                    var tran = conn.BeginTransaction();
                    stopTime.Replace(conn);
                    tran.Commit();
                }
                await _hubContext.Clients.Group(companyID.ToString()).SendAsync("UpdateStoptimes", new List<StopTime> { stopTime });
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

    }
}
