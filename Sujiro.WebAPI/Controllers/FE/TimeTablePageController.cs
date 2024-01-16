using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;
using static System.Formats.Asn1.AsnWriter;

namespace Sujiro.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeTablePageController : SujiroAPIController
    {

        public class TimetableTrip : Trip
        {
            public TimetableTrip()
            {

            }

            public List<StopTime> stopTimes { get; set; } = new List<StopTime>();
            public TrainType trainType { get; set; } = new TrainType();
            
            public TimetableTrip(SqliteDataReader reader) : base(reader)
            {
            }

        }
        public class TimeTableData
        {
            public List<TimetableTrip> trips { get; set; }=new List<TimetableTrip>();
            public List<Station> stations { get; set; } = new List<Station>();
        }


        public TimeTablePageController(IHubContext<ChatHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpGet("{routeID}/{direct}")]
        public async Task<ActionResult> GetTimeTaleData(long routeID,int direct)
        {
            try
            {

                Debug.WriteLine($"GetTimeTaleData {routeID} {direct}");
                var result = new TimeTableData();
                var trainTypes= new List<TrainType>();


                using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
                {
                    conn.Open();

                    var command = conn.CreateCommand();

                    command.CommandText = @"SELECT * FROM stations";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Station trip = new Station(reader);
                            result.stations.Add(trip);
                        }
                    }
                    command.CommandText = @"SELECT * FROM traintypes";
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            TrainType trainType = new TrainType(reader);
                            trainTypes.Add(trainType);
                        }
                    }

                    command.CommandText = @"SELECT * FROM stop_time inner join trips on stop_time.tripID=trips.tripID where trips.direct=:direct order by stop_time.tripID";
                    command.Parameters.Add(new SqliteParameter(":direct", direct));
                    using (var reader = command.ExecuteReader())
                    {
                        TimetableTrip trip = null;
                        while (reader.Read())
                        {
                            if(trip == null || trip.TripID != (long)reader["tripID"])
                            {
                                trip = new TimetableTrip(reader);
                                trip.trainType = trainTypes.Find(x => x.TrainTypeID == trip.Type);
                                result.trips.Add(trip);
                            }
                            StopTime stopTime = new StopTime(reader);
                            trip.stopTimes.Add(stopTime);
                        }
                    }


                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return StatusCode(500);
            }
        }

        [HttpPut("trip")]
        public async Task<ActionResult> PutTrip(TimetableTrip trip)
        {

            try
            {
               Debug.WriteLine($"PostTrip");
                using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
                {
                    conn.Open();
                    var tran = conn.BeginTransaction();
                    var command = conn.CreateCommand();
                    trip.Update(ref command);
                    command.ExecuteNonQuery();
                    foreach(var stopTime in trip.stopTimes)
                    {
                        var command2 = conn.CreateCommand();
                        stopTime.Update(ref command2);
                        try
                        {
                            command2.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {
                            Debug.WriteLine(ex);
                        }
                    }

                    tran.Commit();
                }
                await _hubContext.Clients.All.SendAsync("UpdateTripStopTime", trip);
                return Ok("");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return StatusCode(500);
            }
        }
    }
}
