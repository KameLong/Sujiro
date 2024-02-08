using Microsoft.Data.Sqlite;
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
        public RouteStation()
        {
            RouteStationID = MyRandom.NextSafeLong();
        }
        public RouteStation(SqliteDataReader reader)
        {
            RouteStationID = (long)reader["routeStationID"];
            RouteID = (long)reader["routeID"];
            StationID = (long)reader["stationID"];
            Seq = (int)(long)reader["seq"];
        }
        public static string CreateTableSqlite()
        {
            return $"create table {TABLE_NAME} (routestationID integer PRIMARY KEY,routeID integer not null,stationID integer not null,seq integer default 0)";
        }
        public void ReplaceSqlite(ref SqliteCommand command)
        {
            command.CommandText = @$"REPLACE INTO {TABLE_NAME} (routeStationID,routeID,stationID,seq) VALUES (:routeStationID,:routeID,:stationID,:seq)";
            command.Parameters.Add(new SqliteParameter(":routeStationID", RouteStationID));
            command.Parameters.Add(new SqliteParameter(":routeID", RouteID));
            command.Parameters.Add(new SqliteParameter(":stationID", StationID));
            command.Parameters.Add(new SqliteParameter(":seq", Seq));
        }
        public static void PutRouteStation(string dbPath, RouteStation routeStation)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                routeStation.ReplaceSqlite(ref command);
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public static void DeleteRouteStation(string dbPath, long routeStationID)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = $"Select seq from {TABLE_NAME} where routeStationID= {routeStationID}";
                int seq = Convert.ToInt32(command.ExecuteScalar());
                command =conn.CreateCommand();
                command.CommandText =$"Update {TABLE_NAME} set seq=seq-1 where routeID=(select routeID from {TABLE_NAME} where routeStationID={routeStationID}) and seq>{seq}";
                command.ExecuteNonQuery();
                command = conn.CreateCommand();
                command.CommandText = $"DELETE FROM {TABLE_NAME} WHERE routeStationID = {routeStationID}";
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public static List<RouteStation> GetAllRouteStations(string dbPath,long routeID)
        {
            List<RouteStation> routeStations = new List<RouteStation>();
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = $"SELECT * FROM {TABLE_NAME} WHERE routeID = {routeID} order by seq";
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    routeStations.Add(new RouteStation(reader));
                }
                conn.Close();
            }
            return routeStations;

        }


        public static void InsertRouteStation(string dbPath,long routeID,long stationID,long?insertRouteStationID)
        {
            //todo StationTimeの扱い
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var tran = conn.BeginTransaction();
                try
                {

                var command = conn.CreateCommand();
                RouteStation routeStation = new RouteStation();
                routeStation.RouteID = routeID;
                routeStation.StationID = stationID;
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
                }
                command = conn.CreateCommand();
                routeStation.ReplaceSqlite(ref command);
                command.ExecuteNonQuery();
                tran.Commit();
                }
                catch(Exception ex)
                {
                    Debug.WriteLine(ex.Message);
                    tran.Rollback();
                }

                conn.Close();
            }

        }
    }
}
