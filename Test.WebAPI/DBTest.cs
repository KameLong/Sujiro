using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Sujiro.Data;
using Sujiro.Data.Common;
using System.Diagnostics;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace Test.WebAPI
{
     [Collection("Test Collection #1")]
    public class DBTest :IClassFixture<SampleClassFixture>, IDisposable
    {
        long companyID;
        long routeID;

        public static string DBdir = @"C:\Users\kamelong\Desktop\SujiroTest\";
        public DBTest()
        {
            Debug.WriteLine("UnitTest1 TestInitialize");
            if(!System.IO.Directory.Exists(DBdir))
            {
                System.IO.Directory.CreateDirectory(DBdir);
            }
            Directory.GetFiles(DBdir).ToList().ForEach(File.Delete);
            MasterData.CreateMasterData(DBdir);
        }

        public void Dispose()
        {
            SqliteConnection.ClearAllPools();
            Trace.WriteLine("UnitTest1 TestCleanup");
        }
        [Fact]
        public void RandomIsRandom()
        {
            List<long>list= new List<long>();   
            for(int i = 0; i < 100; i++)
            {
                list.Add(MyRandom.NextSafeLong());
                Debug.WriteLine(list[i]);
            }
            list.Sort();
            Assert.True(list[list.Count - 1] > 1000000000);
        }

        [Fact]
        public void CompanyCreate()
        {

            Company company = new Company();
            company.Name = "TestCompany";
            company.UserID = "TestUser";
            company.CompanyID = MyRandom.NextSafeLong();
            Company.InsertCompany(DBdir + MasterData.MASTER_DATA_FILE, company);

            CompanySqlite.CreateCompanySqlite(DBdir, company.CompanyID);
            Assert.True(File.Exists(DBdir + $"company_{company.CompanyID}.sqlite"));
            companyID=company.CompanyID;
        }

        [Fact]
        public void RouteCreate()
        {
            CompanyCreate();
            Route route = new Route();
            route.CompanyID = companyID;
            route.Name = "TestRoute";
            route.RouteID = MyRandom.NextSafeLong();
            Route.Replace(DBdir  + $"company_{companyID}.sqlite", route);
            routeID=route.RouteID;
        }

        [Fact]
        public void CreateStations()
        {
            RouteCreate();
            for(int i = 0; i < 10; i++)
            {
                Station station = new Station();
                station.Name = "Station"+i;
                station.StationID = MyRandom.NextSafeLong();
                Station.ReplaceStation(DBdir + $"company_{companyID}.sqlite", station);
            }
        }
        [Fact]
        public void CreateRouteStations()
        {
            CreateStations();
            var stations= Station.GetAllStation(DBdir + $"company_{companyID}.sqlite").ToList();
            for (int i = 0; i < 10; i++)
            {
                RouteStation station = new RouteStation();
                station.StationID = stations[i].StationID;
                station.RouteID = routeID;
                station.Seq = i;
                RouteStation.PutRouteStation(DBdir + $"company_{companyID}.sqlite", station);
            }
        }
        [Fact]
        public void CreateTrainTypes()
        {
            CreateRouteStations();
            for (int i = 0; i < 10; i++)
            {
                TrainType trainType = new TrainType();
                trainType.Name = "TrainType" + i;
                trainType.TrainTypeID = MyRandom.NextSafeLong();
                TrainType.PutTrainType(DBdir + $"company_{companyID}.sqlite", trainType);
            }
        }
        [Fact]
        public void CreateTrips()
        {
            CreateTrainTypes();
            var trainType=TrainType.GetAllTrainType(DBdir + $"company_{companyID}.sqlite").First();
            for (int i = 0; i < 10; i++)
            {
                Trip trip = new Trip();
                trip.RouteID = routeID;
                trip.TypeID = trainType.TrainTypeID;
                trip.TripID = MyRandom.NextSafeLong();
                Trip.ReplaceTrip(DBdir + $"company_{companyID}.sqlite", trip);
            }
        }
        [Fact]
        public void CreateStopTimes()
        {
            CreateTrips();
            var trips = Trip.GetAllTrip(DBdir + $"company_{companyID}.sqlite", routeID).ToList();
            var routeStations = RouteStation.GetAllRouteStations(DBdir + $"company_{companyID}.sqlite",routeID).ToList();
            foreach(var trip in trips)
            {
                foreach(var routeStation in routeStations)
                {
                    StopTime stopTime = new StopTime();
                    stopTime.ariTime = Random.Shared.Next(); ;
                    stopTime.depTime = Random.Shared.Next(); ;
                    stopTime.routeStationID = routeStation.RouteStationID;
                    stopTime.tripID = trip.TripID;
                    StopTime.PutStopTime(DBdir + $"company_{companyID}.sqlite", stopTime);
                }
            }
        }
        [Fact]
        public async void ConvertOudia()
        {
            Company company = new Company();
            company.Name = "Oudia";
            company.UserID = "TestUser";
            company.CompanyID = 1;
            Company.InsertCompany(DBdir + MasterData.MASTER_DATA_FILE, company);

            CompanySqlite.CreateCompanySqlite(DBdir, company.CompanyID);
            await OuDia.OuDia2Sujiro.OuDia2Sujiraw( @"C:\Users\kamelong\Downloads\ã‹}•ó’Ëü.oud", DBdir + $"company_1.sqlite", 1);
        }

    }
    public class SampleClassFixture : IDisposable
    {
        public SampleClassFixture()
        {
            Trace.WriteLine("ClassInitialize");
        }

        public void Dispose()
        {
            Trace.WriteLine("ClassCleanup");
        }
    }
}