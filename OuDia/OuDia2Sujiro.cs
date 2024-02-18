using Microsoft.Data.Sqlite;
using Sujiro.Data;


namespace OuDia
{
    public class OuDia2Sujiro
    {
        public static async Task<int> OuDia2Sujiraw(string oudiaFileName, string sqliteCompanyFile,long companyID)
        {
            var lineFile = new LineFile(oudiaFileName);
            var ouDiaRoute = lineFile.routes.First();
            using (var conn = new SqliteConnection("Data Source=" + sqliteCompanyFile))
            {
                conn.Open();
                var tran = conn.BeginTransaction();
                var command = conn.CreateCommand();
                //routeの追加
                Sujiro.Data.Route route = new Sujiro.Data.Route();
                route.Name = ouDiaRoute.Name;
                route.CompanyID = companyID;
                route.Replace(conn);
                var prevStations= Sujiro.Data.Station.GetAllStation(conn);
                var routeStations = ouDiaRoute.Stations.Select(oudiaStation =>
                {
                    //stationの追加
                    Console.WriteLine(oudiaStation.Name);
                    Sujiro.Data.Station station = new Sujiro.Data.Station();
                    station.Name = oudiaStation.Name;
                    if (prevStations.Exists(x => x.Name == station.Name))
                    {
                        station = prevStations.Find(x => x.Name == station.Name);
                    }
                    else
                    {
                        station.ReplaceStation(conn);
                    }
                    //routeStationの追加
                    Sujiro.Data.RouteStation routeStation = new Sujiro.Data.RouteStation();
                    routeStation.RouteID = route.RouteID;
                    routeStation.StationID = station.StationID;
                    routeStation.Seq = ouDiaRoute.Stations.IndexOf(oudiaStation);
                    switch (oudiaStation.type)
                    {
                        case "Jikokukeisiki_NoboriChaku":
                            routeStation.Style = 0x0201;
                            break;
                        case "Jikokukeisiki_KudariChaku":
                            routeStation.Style = 0x0102;
                            break;
                        case "Jikokukeisiki_Hatsuchaku":
                            routeStation.Style = 0x0303;
                            break;
                        default:
                            routeStation.Style = 0x0101;
                            break;
                    }
                    if (oudiaStation.size == "Syuyou")
                    {
                        routeStation.Style |= 0x01000000;
                    }
                    routeStation.Replace(conn);
                    return routeStation;

                }).ToList();
                var prevTrainTypes = Sujiro.Data.TrainType.GetAllTrainType(conn);
                var trainTypes=ouDiaRoute.TrainTypes.Select(type =>
                {
                    Sujiro.Data.TrainType trainType = new Sujiro.Data.TrainType();
                    trainType.TrainTypeID = ouDiaRoute.TrainTypes.IndexOf(type);
                    trainType.Name = type.Name;
                    trainType.ShortName = type.ShortName;
                    trainType.color = "#" + type.TextColor.Substring(6, 2) + type.TextColor.Substring(4, 2) + type.TextColor.Substring(2, 2);
                    if(prevTrainTypes.Exists(x => x.TrainTypeID == trainType.TrainTypeID))
                    {
                        trainType = prevTrainTypes.Find(x => x.TrainTypeID == trainType.TrainTypeID);
                    }
                    else
                    {
                        trainType.ReplaceSqlite(conn);
                    }   

                    return trainType;
                }).ToList();
                //tripの追加
                foreach (var train in ouDiaRoute.Diagrams[0].down.trains)
                {
                    Trip trip = new Trip();
                    trip.RouteID = route.RouteID;
                    trip.direct = 0;
                    trip.TripSeq = ouDiaRoute.Diagrams[0].down.trains.IndexOf(train);
                    trip.Name = train.Name;
                    trip.Number = train.Number;
                    trip.TypeID = trainTypes[train.Type].TrainTypeID;
                    trip.Replace(conn);
                    for (int i = 0; i < train.times.Count; i++)
                    {
                        StopTime stopTime = new StopTime();
                        stopTime.tripID = trip.TripID;
                        stopTime.routeStationID = routeStations[i].RouteStationID;
                        stopTime.ariTime = train.times[i].AriTime;
                        stopTime.depTime = train.times[i].DepTime;
                        stopTime.stopType = train.times[i].StopType;
                        stopTime.Replace(conn);
                    }

                }
                foreach (var train in ouDiaRoute.Diagrams[0].up.trains)
                {
                    Sujiro.Data.Trip trip = new Sujiro.Data.Trip();
                    trip.RouteID = route.RouteID;
                    trip.TripSeq = ouDiaRoute.Diagrams[0].up.trains.IndexOf(train);
                    trip.direct = 1;
                    trip.Name = train.Name;
                    trip.Number = train.Number;
                    trip.TypeID = trainTypes[train.Type].TrainTypeID;
                    trip.Replace(conn);

                    for (int i = 0; i < train.times.Count; i++)
                    {
                        StopTime stopTime = new StopTime();
                        stopTime.tripID = trip.TripID;
                        stopTime.routeStationID = routeStations[ouDiaRoute.Stations.Count - i - 1].RouteStationID;
                        stopTime.ariTime = train.times[i].AriTime;
                        stopTime.depTime = train.times[i].DepTime;
                        stopTime.stopType = train.times[i].StopType;
                        stopTime.Replace(conn);

                    }

                }
                tran.Commit();
            }
            return 0;
        }
    }
}


