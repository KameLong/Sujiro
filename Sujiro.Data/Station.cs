using Microsoft.Data.Sqlite;
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
        public void InsertSqlite(ref SqliteCommand command)
        {
            command.CommandText = $@"INSERT INTO {TABLE_NAME} (stationID,name)values(:stationID,:name)";
            command.Parameters.Add(new SqliteParameter(":stationID", StationID));
            command.Parameters.Add(new SqliteParameter(":name", Name));
        }
        public void UpdateSqlite(ref SqliteCommand command)
        {
            command.CommandText = $@"UPDATE {TABLE_NAME} SET name=:name WHERE stationID=:stationID";
            command.Parameters.Add(new SqliteParameter(":stationID", StationID));
            command.Parameters.Add(new SqliteParameter(":name", Name));
        }

        public static void InsertStation(string dbPath, Station station)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                station.InsertSqlite(ref command);
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public static void UpdateStation(string dbPath, Station station)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                station.UpdateSqlite(ref command);
                command.ExecuteNonQuery();
                conn.Close();
            }
        }

        public static Station? GetStation(string dbPath, long id)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
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
            }
            return null;
        }



    }
}
