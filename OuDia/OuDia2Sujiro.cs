using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;
using Sujiro.Data;

namespace OuDia
{
    public class OuDia2Sujiro
    {
        public static async  Task<int> Reset()
        {
            var now = DateTime.Now;

//            var lineFile = new OuDia.LineFile(@"C:\Users\kamelong\Downloads\京成電鉄.oud");
            var lineFile = new LineFile(@"C:\Users\kamelong\Downloads\阪急宝塚線.oud");
            const string DbFile = @"C:\Users\kamelong\Desktop\阪急宝塚線.db";
            if (File.Exists(DbFile))
            {
                File.Delete(DbFile);
            }


            var route = lineFile.routes.First();
            Console.WriteLine((DateTime.Now - now).TotalMilliseconds);

            var routeContext = new RouteContext(DbFile);
            await routeContext.Database.EnsureCreatedAsync();

            Console.WriteLine((DateTime.Now - now).TotalMilliseconds);
            routeContext.SaveChanges();
            foreach (var station in route.Stations)
            {
                Console.WriteLine(station.Name);
                Sujiro.Data.Station station1 = new Sujiro.Data.Station();
                station1.StationID = route.Stations.IndexOf(station);
                station1.Name = station.Name;
                switch (station.type)
                {
                    case "Jikokukeisiki_NoboriChaku":
                        station1.Style = 0x21;
                        break;
                    case "Jikokukeisiki_KudariChaku":
                        station1.Style = 0x12;
                        break;
                    case "Jikokukeisiki_Hatsuchaku":
                        station1.Style = 0x33;
                        break;
                    default:
                        station1.Style = 0x11;
                        break;
                }
                routeContext.stations.Add(station1);
            }
            routeContext.SaveChanges();
            routeContext.AddRange(
            route.TrainTypes.Select(type =>
            {
                Sujiro.Data.TrainType trainType = new Sujiro.Data.TrainType();
                trainType.TrainTypeID = route.TrainTypes.IndexOf(type);
                trainType.Name = type.Name;
                trainType.ShortName = type.ShortName;
                trainType.color = "#" + type.TextColor.Substring(6, 2) + type.TextColor.Substring(4, 2) + type.TextColor.Substring(2, 2);
                return trainType;
            }));
            foreach (var train in route.Diagrams[0].down.trains)
            {
                Sujiro.Data.Trip trip = new Sujiro.Data.Trip();
                trip.TripID = route.Diagrams[0].down.trains.IndexOf(train);
                trip.direct = 0;
                trip.Name = train.Name;
                trip.Number = train.Number;
                trip.Type = train.Type;
                routeContext.trips.Add(trip);
                for (int i = 0; i < train.times.Count; i++)
                {
                    StopTime stopTime = new StopTime();
                    stopTime.tripID = trip.TripID;
                    stopTime.stationID = i;
                    stopTime.ariTime = train.times[i].AriTime;
                    stopTime.depTime = train.times[i].DepTime;
                    stopTime.stopType = train.times[i].StopType;
                    routeContext.stop_time.Add(stopTime);

                }

            }
            foreach (var train in route.Diagrams[0].up.trains)
            {
                Sujiro.Data.Trip trip = new Sujiro.Data.Trip();
                trip.TripID = route.Diagrams[0].down.trains.Count + route.Diagrams[0].up.trains.IndexOf(train);
                trip.direct = 1;
                trip.Name = train.Name;
                trip.Number = train.Number;
                trip.Type = train.Type;
                routeContext.trips.Add(trip);
                for (int i = 0; i < train.times.Count; i++)
                {
                    StopTime stopTime = new StopTime();
                    stopTime.tripID = trip.TripID;
                    stopTime.stationID = i;
                    stopTime.ariTime = train.times[i].AriTime;
                    stopTime.depTime = train.times[i].DepTime;
                    stopTime.stopType = train.times[i].StopType;
                    routeContext.stop_time.Add(stopTime);

                }

            }
            routeContext.SaveChanges();
            Console.WriteLine((DateTime.Now - now).TotalMilliseconds);
            return 0;
        }
    }
    internal class RouteContext : DbContext
    {
        public DbSet<Sujiro.Data.Station>? stations { get; set; }
        public DbSet<Sujiro.Data.Trip>? trips { get; set; }
        public DbSet<Sujiro.Data.StopTime>? stop_time { get; set; }
        public DbSet<Sujiro.Data.TrainType>? trainTypes { get; set; }

        public string DbPath { get; }

        public RouteContext(string fileName)
        {
            // 特殊フォルダ（デスクトップ）の絶対パスを取得
            var path = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);

            // DBファイルの保存先とDBファイル名
            DbPath = fileName;
        }

        // デスクトップ上にSQLiteのDBファイルが作成される
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source={DbPath}");
    }


}


