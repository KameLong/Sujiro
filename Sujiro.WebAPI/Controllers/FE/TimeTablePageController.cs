using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.Data.Common;
using Sujiro.WebAPI.Service.AuthService;
using Sujiro.WebAPI.SignalR;
using System.ComponentModel.Design;
using System.Diagnostics;
using System.Security.Claims;
using static System.Formats.Asn1.AsnWriter;
using Route = Sujiro.Data.Route;

namespace Sujiro.WebAPI.Controllers
{
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
            public TrainType trainType { get; set; } = new TrainType();
            public TimetableTrip(SqliteDataReader reader) : base(reader)
            {
            }
        }

        /*
         * 時刻表表示用のRouteStation
         * RouteStationとStationを結合
         */
        public class TimeTableStation : RouteStation
        {
            public Station station { get; set; } = new Station();
            public TimeTableStation():base()
            {
            }

            public TimeTableStation(SqliteDataReader reader) : base(reader)
            {
            }
        }
        public class TimeTableData
        {
            public List<TimetableTrip> trips { get; set; }=new List<TimetableTrip>();
            public List<TimeTableStation> stations { get; set; } = new List<TimeTableStation>();
        }


        public TimeTablePageController(IHubContext<SujirawHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpGet("{companyID}/{routeID}/{direct}")]
        public async Task<ActionResult> GetTimeTaleData(long companyID,long routeID,int direct)
        {
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            try
            {
                var result = new TimeTableData();
                var trainTypes= new List<TrainType>();

                string filePath = Configuration["ConnectionStrings:DBdir"] + $"company_{companyID}.sqlite";

                using (var conn = new SqliteConnection("Data Source=" + filePath))
                {
                    conn.Open();
                    Route? route = Route.GetRoute<Route>(conn, routeID);
                    if (route==null)
                    {
                        return NotFound();
                    }
                    result.stations=RouteStation.GetAllRouteStations<TimeTableStation>(conn, routeID).ToList();
                    result.stations.ForEach(x => {
                        var station = Station.GetStation(conn, x.StationID);
                        if(station==null)
                        {
                            station = new Station();
                            station.Name= "Error";
                        }
                        x.station = station;
                     });
                    trainTypes=TrainType.GetAllTrainType(conn).ToList();
                    var command=conn.CreateCommand();
                    command.CommandText = $@"SELECT * FROM {StopTime.TABLE_NAME} 
                            inner join {Trip.TABLE_NAME} on ({StopTime.TABLE_NAME}.{nameof(StopTime.tripID)}={Trip.TABLE_NAME}.tripID 
                                and {Trip.TABLE_NAME}.{nameof(Trip.RouteID)}={routeID}
                                and {Trip.TABLE_NAME}.{nameof(Trip.direct)}=:direct)
                            inner join {RouteStation.TABLE_NAME} on {StopTime.TABLE_NAME}.{nameof(StopTime.routeStationID)}={RouteStation.TABLE_NAME}.{nameof(RouteStation.RouteStationID)}
                            order by {Trip.TABLE_NAME}.{nameof(Trip.TripSeq)},
                            {RouteStation.TABLE_NAME}.{nameof(RouteStation.Seq)}";

                    command.Parameters.Add(new SqliteParameter(":direct", direct));
                    using (var reader = command.ExecuteReader())
                    {
                        TimetableTrip trip = null;
                        while (reader.Read())
                        {
                            if(trip == null || trip.TripID != (long)reader["tripID"])
                            {
                                trip = new TimetableTrip(reader);
                                trip.trainType = trainTypes.Find(x => x.TrainTypeID == trip.TypeID);
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


        /**
         * 既存のTripを置き換えます
         */
        [HttpPut("UpdateTrip/{companyID}")]
        public async Task<ActionResult> UpdateTrip(long companyID,TimetableTrip trip)
        {
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            string dbPath = Configuration["ConnectionStrings:DBdir"] + $"company_{companyID}.sqlite";
            try
            {
                using (var conn = new SqliteConnection("Data Source=" + dbPath))
                {
                    conn.Open();
                    var tran = conn.BeginTransaction();
                    trip.Replace(conn);
                    foreach (var stopTime in trip.stopTimes)
                    {
                        stopTime.Replace(conn);
                    }
                    tran.Commit();
                }
                var trips= new List<Trip>
                {
                    (Trip)trip
                };
                await _hubContext.Clients.Groups(companyID.ToString()).SendAsync("UpdateStopTimes", trip.stopTimes);
                await _hubContext.Clients.Groups(companyID.ToString()).SendAsync("UpdateTrips",trips);
                return Ok("");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }


        }
        [HttpPost("InsertTrip/{companyID}")]
        public async Task<ActionResult> InsertTrip(long companyID,InsertTimetableTrip insert)
        {

            TimetableTrip trip = insert.trip;
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            string dbPath = Configuration["ConnectionStrings:DBdir"] + $"company_{companyID}.sqlite";

            try
            {
                using (var conn = new SqliteConnection("Data Source=" + dbPath))
                {
                    conn.Open();
                    var tran = conn.BeginTransaction();
                    var command = conn.CreateCommand();

                    if (trip.TypeID == -1)
                    {
                        trip.TypeID =TrainType.GetAllTrainType(conn).First().TrainTypeID;
                    }

                    long insertTripID = insert.insertTripID;
                    int seq = 0;
                    if (insertTripID == -1)
                    {
                        command = conn.CreateCommand();
                        command.CommandText=$"select count(*) from {Trip.TABLE_NAME} where RouteID=:RouteID and direct=:direct";
                        command.Parameters.Add(new SqliteParameter(":RouteID", trip.RouteID));
                        command.Parameters.Add(new SqliteParameter(":direct", trip.direct));
                        seq = (int)(long)command.ExecuteScalar();
                    }
                    else
                    {
                        command = conn.CreateCommand();
                        command.CommandText = $"select TripSeq from {Trip.TABLE_NAME} WHERE tripID=:tripID";
                        command.Parameters.Add(new SqliteParameter(":direct", trip.direct));
                        command.Parameters.Add(new SqliteParameter(":tripID", insert.insertTripID));
                        seq = (int)(long)command.ExecuteScalar();
                    }




                    command = conn.CreateCommand();
                    command.CommandText = $"UPDATE {Trip.TABLE_NAME} SET TripSeq=TripSeq+1 WHERE direct=:direct and TripSeq>=:TripSeq";
                    command.Parameters.Add(new SqliteParameter(":direct", trip.direct));
                    command.Parameters.Add(new SqliteParameter(":TripSeq", seq));
                    command.ExecuteNonQuery();
                    trip.TripSeq = seq;
                    trip.Replace(conn);
                    foreach (var stop in trip.stopTimes)
                    {
                        stop.Replace(conn);
                    }
                    tran.Commit();
                }
                await _hubContext.Clients.Groups(companyID.ToString()).SendAsync("InsertTrips", new List<Trip> { trip });
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
