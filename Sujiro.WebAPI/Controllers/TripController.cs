using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;

namespace Sujiro.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly IConfiguration Configuration;
        private readonly IHubContext<ChatHub> _hubContext;
        public TripController(IHubContext<ChatHub> hubContext, IConfiguration configuration)
        {
            _hubContext = hubContext;
            Configuration = configuration;

        }

        [HttpGet]
        public IEnumerable<Trip> Get(int direct)
        {
            try
            {

            DateTime now = DateTime.Now;
            var trips = new List<Trip>();
            using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
            {
                conn.Open();
                var tran = conn.BeginTransaction();
                var command = conn.CreateCommand();

                command.CommandText = @"SELECT * FROM trips where direct=:direct";
                command.Parameters.Add(new SqliteParameter(":direct", direct));

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Trip trip = new Trip(reader);
                            trips.Add(trip);
                    }
                }
                    var command2 = conn.CreateCommand();
                    command2.CommandText = @"SELECT * FROM stop_time";
                    using (var reader2 = command2.ExecuteReader())
                    {
                        while (reader2.Read())
                        {
                            StopTime stopTime = new StopTime(reader2);
                            var t = trips.Find(t => t.TripID == stopTime.tripID);
                            if (t != null)
                            {
//                                    t.stopTimes.Add(stopTime);

                            }
                        }
                    }


                }
                Debug.WriteLine((DateTime.Now - now).TotalMilliseconds);

            return trips;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
                throw e;
            }
        }
        [HttpDelete("{tripID}")]
        public async Task<ActionResult> DeleteTrip(long tripID)
        {
            Debug.WriteLine($"DeleteTrip {tripID}");
            using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
            {
                conn.Open();
                var tran = conn.BeginTransaction();
                var command = conn.CreateCommand();
                command.CommandText = @"DELETE from trips where id=:id";
                command.Parameters.Add(new SqliteParameter(":id", tripID));
                int res=command.ExecuteNonQuery();
                tran.Commit();

                if (res == 0)
                {
                    return NotFound();
                }
                await _hubContext.Clients.All.SendAsync("DeleteTrip", tripID);
                return NoContent();
            }
        }
    }
}
