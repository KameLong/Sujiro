using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;
using System.Security.Claims;
using static System.Formats.Asn1.AsnWriter;

namespace Sujiro.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TimeTablePageController : SujiroAPIController
    {
        public class InsertTimetableTrip 
        {
            public TimetableTrip trip { get; set; } = new TimetableTrip();
            public long insertTripID { get; set; } = -1;

        }

        public class TimetableTrip : Trip
        {
            public TimetableTrip()
            {

            }

            public List<StopTime> stopTimes { get; set; } = new List<StopTime>();
            public OldTrainType trainType { get; set; } = new OldTrainType();
            
            public TimetableTrip(SqliteDataReader reader) : base(reader)
            {
            }

        }
        public class TimeTableData
        {
            public List<TimetableTrip> trips { get; set; }=new List<TimetableTrip>();
            public List<OldStation> stations { get; set; } = new List<OldStation>();
        }


        public TimeTablePageController(IHubContext<ChatHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpGet("{routeID}/{direct}")]
        public async Task<ActionResult> GetTimeTaleData(long routeID,int direct)
        {
            string userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
            try
            {
                Debug.WriteLine($"GetTimeTaleData {routeID} {direct}");
                var result = new TimeTableData();
                var trainTypes= new List<OldTrainType>();


                using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
                {
                    conn.Open();

                    var command = conn.CreateCommand();

                    command.CommandText = $"SELECT * FROM {OldStation.TABLE_NAME}";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            OldStation trip = new OldStation(reader);
                            result.stations.Add(trip);
                        }
                    }
                    command.CommandText = $"SELECT * FROM {OldTrainType.TABLE_NAME}";
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            OldTrainType trainType = new OldTrainType(reader);
                            trainTypes.Add(trainType);
                        }
                    }

                    command.CommandText = $"SELECT * FROM {StopTime.TABLE_NAME} inner join {Trip.TABLE_NAME} on {StopTime.TABLE_NAME}.{nameof(StopTime.tripID)}={Trip.TABLE_NAME}.{nameof(Trip.TripID)} where {Trip.TABLE_NAME}.{nameof(Trip.direct)}=:direct order by {Trip.TABLE_NAME}.{nameof(Trip.Seq)}";
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
                return StatusCode(500);
            }
        }
        [HttpPost("insertTrip")]
        public async Task<ActionResult> InsertTrip(InsertTimetableTrip insert)
        {
            TimetableTrip trip = insert.trip;

            try
            {
                Debug.WriteLine($"insertTrip");
                using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
                {
                    conn.Open();
                    var tran = conn.BeginTransaction();
                    var command = conn.CreateCommand();

                    command.CommandText = $"select seq from {Trip.TABLE_NAME} WHERE direct=:direct and tripID=:tripID";
                    command.Parameters.Add(new SqliteParameter(":direct", trip.direct));
                    command.Parameters.Add(new SqliteParameter(":tripID", insert.insertTripID));
                    int seq=(int)(long)command.ExecuteScalar();



                    command = conn.CreateCommand();
                    command.CommandText = $"UPDATE {Trip.TABLE_NAME} SET seq=seq+1 WHERE direct=:direct and seq>=:seq";
                    command.Parameters.Add(new SqliteParameter(":direct", trip.direct));
                    command.Parameters.Add(new SqliteParameter(":seq", seq));
                    command.ExecuteNonQuery();

                    command = conn.CreateCommand();
                    command.CommandText = $"INSERT INTO {Trip.TABLE_NAME} (tripID,direct,name,number,type,seq) VALUES (:tripID,:direct,:name,:number,:type,:seq)";
                    command.Parameters.Add(new SqliteParameter(":tripID", trip.TripID));
                    command.Parameters.Add(new SqliteParameter(":direct", trip.direct));
                    command.Parameters.Add(new SqliteParameter(":name", trip.Name));
                    command.Parameters.Add(new SqliteParameter(":number", trip.Number));
                    command.Parameters.Add(new SqliteParameter(":type", trip.Type));
                    command.Parameters.Add(new SqliteParameter(":seq", seq));
                    command.ExecuteNonQuery();
                    foreach (var stop in trip.stopTimes)
                    {
                        command=    conn.CreateCommand();
                        command.CommandText = $"INSERT INTO {StopTime.TABLE_NAME} (tripID,stationID,ariTime,depTime,stopType) VALUES (:tripID,:stationID,:ariTime,:depTime,:stopType)";
                        command.Parameters.Add(new SqliteParameter(":tripID", trip.TripID));
                            command.Parameters.Add(new SqliteParameter(":stationID", stop.stationID));
                        command.Parameters.Add(new SqliteParameter(":ariTime", stop.ariTime));
                        command.Parameters.Add(new SqliteParameter(":depTime", stop.depTime));
                        command.Parameters.Add(new SqliteParameter(":stopType", stop.stopType));
                        command.ExecuteNonQuery();


                    }


                    tran.Commit();
                }
                await _hubContext.Clients.All.SendAsync("UpdateTrips");

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
