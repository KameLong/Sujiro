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
    public class DiagramPageController : AOdiaApiController
    {
        class DiagramData
        {
            public List<Trip> downTrips { get; set; } = new List<Trip>();
            public List<Trip> upTrips { get; set; } = new List<Trip>();
            public List<Station> stations { get; set; } = new List<Station>();
        }


        public DiagramPageController(IHubContext<ChatHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpGet("{routeID}")]
        public async Task<ActionResult> GetDiagramData(long routeID)
        {
            try
            {
                var result = new DiagramData();


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

                    command.CommandText = @"SELECT * FROM stop_time inner join trips on stop_time.tripID=trips.tripID  order by stop_time.tripID";
                    using (var reader = command.ExecuteReader())
                    {
                        Trip trip = null;
                        while (reader.Read())
                        {
                            if (trip == null || trip.TripID != (long)reader["tripID"])
                            {
                                trip = new Trip(reader);
                                if (trip.direct == 0)
                                {
                                    result.downTrips.Add(trip);
                                }
                                else
                                {

                                }
                                    result.upTrips.Add(trip);
                                }
                            StopTime stopTime = new StopTime(reader);
//                            trip.stopTimes.Add(stopTime);
                        }


                    }
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                throw ex; ;
            }
        }
    }
}

