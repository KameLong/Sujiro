using Microsoft.Data.Sqlite;
using Sujiro.Data.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sujiro.Data
{
    public class Station
    {
        public static readonly string TABLE_NAME = "stations";

        public long StationID { get; set; }
        public string Name { get; set; } = "";
        
        public Station()
        {
            StationID = MyRandom.NextSafeLong();
        }
        public Station(SqliteDataReader reader)
        {
            StationID = (long)reader["stationID"];
            Name = (string)reader["name"];
        }

        public static string CreateTableSqlite()
        {
            return $"create table {TABLE_NAME} (stationID integer primary key not null,name text)";
        }
        public void ReplaceStation(SqliteConnection conn)
        {
            var command = conn.CreateCommand();
            command.CommandText = $@"REPLACE INTO {TABLE_NAME} (stationID,name)values(:stationID,:name)";
            command.Parameters.Add(new SqliteParameter(":stationID", StationID));
            command.Parameters.Add(new SqliteParameter(":name", Name));
            command.ExecuteNonQuery();

        }




        public static void ReplaceStation(string dbPath, Station station)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                station.ReplaceStation(conn);
                conn.Close();
            }
        }
        public static void DeleteStation(string dbPath, long stationID)
        {
            //todo : routeStationの確認
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = @$"DELETE FROM {TABLE_NAME} where stationID=:stationID";
                command.Parameters.Add(new SqliteParameter(":stationID", stationID));
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public static List<Station>GetAllStation(string dbPath)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                return GetAllStation(conn);
            }
        }
        public static List<Station> GetAllStation(SqliteConnection conn)
        {
            var command = conn.CreateCommand();
            List<Station> stations = new List<Station>();
            command.CommandText = @$"SELECT * FROM {TABLE_NAME}";
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    stations.Add(new Station(reader));
                }
            }
            return stations;
        }


        public static Station? GetStation(SqliteConnection conn, long id)
        {
               var command = conn.CreateCommand();
                command.CommandText = @$"SELECT * FROM {TABLE_NAME} where stationID=:stationID";
                command.Parameters.Add(new SqliteParameter(":stationID", id));
                using (var reader = command.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        return new Station(reader);
                    }
            }
            return null;
        }



    }
}
