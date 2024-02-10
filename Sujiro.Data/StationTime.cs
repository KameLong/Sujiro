using Microsoft.Data.Sqlite;
using Sujiro.Data.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sujiro.Data
{
    [Table(TABLE_NAME)]

    public class StopTime
    {
        public const string TABLE_NAME = "stop_times";
        public long StopTimeID { get; set; }
        public long tripID { get; set; } = 0;
        public long routeStationID { get; set; } = 0;
        public long stopID { get; set; } = -1;
        public int ariTime { get; set; } = -1;
        public int depTime { get; set; } = -1;
        public int stopType { get; set; } = -1;

        public StopTime()
        {
            StopTimeID = MyRandom.NextSafeLong();

        }
        public StopTime(SqliteDataReader reader)
        {
            StopTimeID = (long)reader["stopTimeID"];
            tripID = (long)reader["tripID"];
            routeStationID = (long)reader["routeStationID"];
            stopID = (long)reader["stopID"];

            ariTime = (int)(long)reader["ariTime"];
            depTime = (int)(long)reader["depTime"];
            stopType = (int)(long)reader["stopType"];
        }
        public static string CreateTableSqlite()
        {
            return $@"create table {TABLE_NAME} (
                stopTimeID integer primary key not null,
                tripID integer not null default 0,
                routeStationID integer not null default 0,
                stopID integer not null default -1, 
                ariTime integer not null default -1,
                depTime integer not null default -1,
                stopType integer not null default -1

                )";
        }

        public void Replace(ref SqliteCommand command)
        {
            command.CommandText = $@"REPLACE INTO {TABLE_NAME} (stopTimeID,tripID,routeStationID,ariTime,depTime,stopType,stopID)values(:stopTimeID,:tripID,:routeStationID,:ariTime,:depTime,:stopType,:stopID)";
            command.Parameters.Add(new SqliteParameter(":stopTimeID", StopTimeID));
            command.Parameters.Add(new SqliteParameter(":tripID", tripID));
            command.Parameters.Add(new SqliteParameter(":routeStationID", routeStationID));
            command.Parameters.Add(new SqliteParameter(":ariTime", ariTime));
            command.Parameters.Add(new SqliteParameter(":depTime", depTime));
            command.Parameters.Add(new SqliteParameter(":stopType", stopType));
            command.Parameters.Add(new SqliteParameter(":stopID", stopID));
        }
       public static void PutStopTime(string dbPath, StopTime stopTime)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                stopTime.Replace(ref command);
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public int GetDAtime()
        {
            if (depTime >= 0)
            {
                return depTime;
            }
            return ariTime;
        }
        public int GetADtime()
        {
            if (ariTime >= 0)
            {
                return ariTime;
            }
            return depTime;
        }
    }
}
