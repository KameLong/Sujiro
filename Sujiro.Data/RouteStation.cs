using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
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
            Seq = (int)reader["seq"];
        }
        public static string CreateTableSqlite()
        {
            return $"create table {TABLE_NAME} (routestationID integer not null,routeID integer not null,stationID integer not null,seq integer default 0)";
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
                command.CommandText = $"DELETE FROM {TABLE_NAME} WHERE routeStationID = {routeStationID}";
                command.Parameters.Add(new SqliteParameter(":routeStationID", routeStationID));
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
    }
}
