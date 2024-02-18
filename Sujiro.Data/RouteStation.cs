using Microsoft.Data.Sqlite;
using Sujiro.Data.Common;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Sujiro.Data
{
    public class RouteStation
    {
        public static readonly string TABLE_NAME = "routeStations";

        public long RouteStationID { get; set; }

        public long RouteID { get; set; } = 0;
        public long StationID { get; set; } = 0;
        public int Seq { get; set; } = 0;
        /*
         *bit　単位で役割を切り替えます。
         *0:下り発時刻
         *1:下り発着番線
         *2:下り着時刻
         *3-7 下り時刻表予備
         *8:上り発時刻
         *9:上り発着番線
         *10:上り着時刻
         *11-15:上り時刻表予備
         *16-23:ダイヤグラム予備
         *24:主要駅
         *
         */
        public int Style { get; set; } = 0;
        public RouteStation()
        {
            RouteStationID = MyRandom.NextSafeLong();
        }
        public void LoadFromSqlite(SqliteDataReader reader)
        {
            RouteStationID = (long)reader["routeStationID"];
            RouteID = (long)reader["routeID"];
            StationID = (long)reader["stationID"];
            Seq = (int)(long)reader["seq"];
            Style = (int)(long)reader["style"];
        }

        public RouteStation(SqliteDataReader reader)
        {
            LoadFromSqlite(reader);
        }
        public static string CreateTableSqlite()
        {
            return $"create table {TABLE_NAME} (routestationID integer PRIMARY KEY,routeID integer not null,stationID integer not null,seq integer default 0,style interger not null default 0)";
        }
        public void Replace(SqliteConnection conn)
        {
            var command = conn.CreateCommand();

            command.CommandText = @$"REPLACE INTO {TABLE_NAME} (routeStationID,routeID,stationID,seq,style) VALUES (:routeStationID,:routeID,:stationID,:seq,:style)";
            command.Parameters.Add(new SqliteParameter(":routeStationID", RouteStationID));
            command.Parameters.Add(new SqliteParameter(":routeID", RouteID));
            command.Parameters.Add(new SqliteParameter(":stationID", StationID));
            command.Parameters.Add(new SqliteParameter(":seq", Seq));
            command.Parameters.Add(new SqliteParameter(":style", Style));
            command.ExecuteNonQuery();

        }
        public static void PutRouteStation(string dbPath, RouteStation routeStation)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                routeStation.Replace(conn);
                conn.Close();
            }
        }
        public static void DeleteRouteStation(SqliteConnection conn , long routeStationID)
        {
            var command = conn.CreateCommand();
            command.CommandText = $"Select seq from {TABLE_NAME} where routeStationID= {routeStationID}";
            int seq = Convert.ToInt32(command.ExecuteScalar());
            command = conn.CreateCommand();
            command.CommandText = $"Update {TABLE_NAME} set seq=seq-1 where routeID=(select routeID from {TABLE_NAME} where routeStationID={routeStationID}) and seq>{seq}";
            command.ExecuteNonQuery();
            command = conn.CreateCommand();
            command.CommandText = $"DELETE FROM {TABLE_NAME} WHERE routeStationID = {routeStationID}";
            command.ExecuteNonQuery();

            command = conn.CreateCommand();
            command.CommandText=$@"SELECT * FROM {StopTime.TABLE_NAME} WHERE routeStationID=:routeStationID";
            command.Parameters.Add(new SqliteParameter(":routeStationID", routeStationID));
            var reader = command.ExecuteReader();

            var deleteStopTimes = new List<StopTime>();
            while (reader.Read())
            {
                deleteStopTimes.Add(new StopTime(reader));
            }

            command = conn.CreateCommand();
            command.CommandText=$@"DELETE FROM {StopTime.TABLE_NAME} WHERE routeStationID=:routeStationID";
            command.Parameters.Add(new SqliteParameter(":routeStationID", routeStationID));
            command.ExecuteNonQuery();




        }
        public static List<T> GetAllRouteStations<T>(string dbPath, long routeID) where T : RouteStation, new()
        {
            List<RouteStation> routeStations = new List<RouteStation>();
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                return GetAllRouteStations<T>(conn, routeID).ToList();
            }
        }


        public static IEnumerable<T> GetAllRouteStations<T>(SqliteConnection conn, long routeID) where T : RouteStation, new()
        {
            var command = conn.CreateCommand();
            command.CommandText = $"SELECT * FROM {TABLE_NAME} WHERE routeID = {routeID} order by seq";
            var reader = command.ExecuteReader();
            while (reader.Read())
            {
                T res = new T();
                res.LoadFromSqlite(reader);
                yield return res;
            }
        }


        public static void InsertRouteStation(SqliteConnection conn, long routeID, long stationID, long? insertRouteStationID)
        {
            try
            {
                var command = conn.CreateCommand();
                RouteStation routeStation = new RouteStation();
                routeStation.RouteID = routeID;
                routeStation.StationID = stationID;
                routeStation.Style = 0x00000101;
                if (insertRouteStationID == null)
                {
                    command.CommandText = $"Select count(*) from {TABLE_NAME} where routeID=:routeID";
                    command.Parameters.Add(new SqliteParameter(":routeID", routeID));
                    routeStation.Seq = Convert.ToInt32(command.ExecuteScalar());
                }
                else
                {
                    command.CommandText = $"Select seq from {TABLE_NAME} where routeStationID=:routeStationID";
                    command.Parameters.Add(new SqliteParameter(":routeStationID", insertRouteStationID));
                    routeStation.Seq = Convert.ToInt32(command.ExecuteScalar());
                    command.CommandText = $"update {TABLE_NAME} set seq=seq+1 where routeID=:routeID and seq>=:seq";
                    command.Parameters.Add(new SqliteParameter(":routeID", routeID));
                    command.Parameters.Add(new SqliteParameter(":seq", routeStation.Seq));
                    command.ExecuteNonQuery();

                    //stationTimeの追加

                }
                routeStation.Replace(conn);
                Trip.GetAllTrip(conn, routeID).ToList().ForEach(x =>
                {
                    StopTime stopTime = new StopTime();
                    stopTime.tripID = x.TripID;
                    stopTime.routeStationID = routeStation.RouteStationID;
                    stopTime.Replace(conn);
                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }


        }
    }
}
