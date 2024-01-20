using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.SignalR;

namespace Sujiro.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StopTimeController : SujiroAPIController
    {
        public StopTimeController(IHubContext<ChatHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpPut]
        public async Task<ActionResult> Put(StopTime stopTime)
        {
            try
            {
                DateTime now = DateTime.Now;
                using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
                {
                    conn.Open();
                    var tran = conn.BeginTransaction();
                    var command = conn.CreateCommand();
                    command.CommandText = $@"UPDATE {StopTime.TABLE_NAME} set 
                            {nameof(StopTime.ariTime)}=:ariTime ,
                            {nameof(StopTime.depTime)}=:depTime, 
                            {nameof(StopTime.stopType)}=:stopType 
                               where {nameof(StopTime.StopTimeID)}=:id";
                    command.Parameters.AddWithValue(":id", stopTime.StopTimeID);
                    command.Parameters.AddWithValue(":ariTime", stopTime.ariTime);
                    command.Parameters.AddWithValue(":depTime", stopTime.depTime);
                    command.Parameters.AddWithValue(":stopType", stopTime.stopType);
                    command.ExecuteNonQuery();
                    tran.Commit();
                }
                await _hubContext.Clients.All.SendAsync("UpdateStoptime", stopTime);

                return Ok();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

    }
}
