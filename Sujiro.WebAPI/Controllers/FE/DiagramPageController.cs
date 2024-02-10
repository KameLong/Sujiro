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
    public class DiagramPageController : SujiroAPIController
    {
        class DiagramStation : OldStation
        {
            public int stationTime { get; set; } = 0;
            public DiagramStation(SqliteDataReader reader) : base(reader)
            {
            }
        }
        class DiagramTrip : Trip
        {
            public DiagramTrip(SqliteDataReader reader) : base(reader)
            {
            }
            public List<StopTime> stopTimes { get; set; } = new List<StopTime>();
            public OldTrainType trainType { get; set; } = new OldTrainType();
        }


        class DiagramData
        {
            public List<DiagramTrip> downTrips { get; set; } = new List<DiagramTrip>();
            public List<DiagramTrip> upTrips { get; set; } = new List<DiagramTrip>();
            public List<DiagramStation> stations { get; set; } = new List<DiagramStation>();
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

                var trainTypes = new List<OldTrainType>();


                using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
                {
                    conn.Open();

                    var command = conn.CreateCommand();
                    command.CommandText = $"SELECT * FROM {OldStation.TABLE_NAME}";
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            DiagramStation station = new DiagramStation(reader);
                            result.stations.Add(station);
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

                    command.CommandText = 
                        $@"SELECT * FROM {StopTime.TABLE_NAME} 
                            inner join {Trip.TABLE_NAME} on {StopTime.TABLE_NAME}.{nameof(StopTime.tripID)}={Trip.TABLE_NAME}.tripID
                            order by {StopTime.TABLE_NAME}.{nameof(StopTime.tripID)},
                            {StopTime.TABLE_NAME}.{nameof(StopTime.routeStationID)}";
                    using (var reader = command.ExecuteReader())
                    {
                        DiagramTrip? trip = null;
                        while (reader.Read())
                        {
                            if (trip == null || trip.TripID != (long)reader[nameof(Trip.TripID)])
                            {
                                trip = new DiagramTrip(reader);
                                if (trip.direct == 0)
                                {
                                    result.downTrips.Add(trip);
                                }
                                else
                                {
                                    result.upTrips.Add(trip);

                                }
                            }
                            StopTime stopTime = new StopTime(reader);
                            trip.stopTimes.Add(stopTime);
                            trip.trainType= trainTypes.Find(x => x.TrainTypeID == trip.TypeID);
                        }
                    }
                    for(var i = 0; i < result.stations.Count-1; i++)
                    {
                        int minTime=int.MaxValue;
                        foreach (var trip in result.downTrips)
                        {
                            int depTime = trip.stopTimes[i].GetDAtime();
                            int ariTime = trip.stopTimes[i+1].GetADtime();
                            if (depTime >= 0 && ariTime >= 0)
                            {
                                int time =  ariTime- depTime;
                                if (trip.stopTimes[i].stopType == 2)
                                {
                                    time += 30;
                                }
                                if (trip.stopTimes[i+1].stopType == 2)
                                {
                                    time += 30;
                                }
                                if (time < minTime)
                                {
                                    minTime = time;
                                }
                            }
                            
                        }
                        foreach (var trip in result.downTrips)
                        {
                            int depTime = trip.stopTimes[i].GetDAtime();
                            int ariTime = trip.stopTimes[i + 1].GetADtime();
                            if (depTime >= 0 && ariTime >= 0)
                            {
                                int time = ariTime - depTime;
                                if (trip.stopTimes[i].stopType == 2)
                                {
                                    time += 30;
                                }
                                if (trip.stopTimes[i + 1].stopType == 2)
                                {
                                    time += 30;
                                }
                                if (time < minTime)
                                {
                                    minTime = time;
                                }
                            }

                        }
                        foreach (var trip in result.upTrips)
                        {
                            int depTime = trip.stopTimes[i+1].GetDAtime();
                            int ariTime = trip.stopTimes[i].GetADtime();
                            if (depTime >= 0 && ariTime >= 0)
                            {
                                int time = ariTime - depTime;
                                if (trip.stopTimes[i].stopType == 2)
                                {
                                    time += 30;
                                }
                                if (trip.stopTimes[i + 1].stopType == 2)
                                {
                                    time += 30;
                                }
                                if (time < minTime)
                                {
                                    minTime = time;
                                }
                            }

                        }
                        if (minTime < 120)
                        {
                            minTime = 120;
                        }
                        result.stations[i+1].stationTime = result.stations[i].stationTime+minTime;


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

