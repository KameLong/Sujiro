using Microsoft.Data.Sqlite;
using Sujiro.Data.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sujiro.Data
{

    [Table(TABLE_NAME)]
    public class Trip 
    {
        public const string TABLE_NAME = "trips";

        public long TripID { get; set; }
        public long TrainID { get; set; }
        public long RouteID { get; set; } = 0;
        public long TypeID { get; set; } = 0;

        public long direct { get; set; } = 0;
        public string Name { get; set; } = "";
        public string Number { get; set; } = "";

        public int Seq { get; set; } = -1;
        public Trip()
        {
            TripID = MyRandom.NextSafeLong();
            TrainID=MyRandom.NextSafeLong();

        }
        public static string CreateTableSqlite()
        {
            return $@"create table {TABLE_NAME} (
                tripID integer primary key not null,
                trainID integer not null,
                routeID integer not null default 0,
                direct integer not null default 0,
                name text not null default '',
                number text not null default '',
                typeID integer not null default 0,
                seq integer not null default -1
                )";
        }

        public static IEnumerable<Trip> GetAllTrip(string dbPath,long  routeID)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = $"select * from {TABLE_NAME} where routeID=:routeID";
                command.Parameters.Add(new SqliteParameter(":routeID", routeID));
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    yield return new Trip(reader);
                }
                conn.Close();
            }
        }
        
        public void Replace(ref SqliteCommand command)
        {
            command.CommandText = $@"REPLACE INTO {TABLE_NAME} (tripID,trainID,routeID,direct,name,number,typeID,seq)values(:tripID,:trainID,:routeID,:direct,:name,:number,:typeID,:seq)";
            command.Parameters.Add(new SqliteParameter(":tripID", TripID));
            command.Parameters.Add(new SqliteParameter(":trainID", TrainID));
            command.Parameters.Add(new SqliteParameter(":routeID", RouteID));
            command.Parameters.Add(new SqliteParameter(":direct", direct));
            command.Parameters.Add(new SqliteParameter(":name", Name));
            command.Parameters.Add(new SqliteParameter(":number", Number));
            command.Parameters.Add(new SqliteParameter(":typeID", TypeID));
            command.Parameters.Add(new SqliteParameter(":seq", Seq));
        }
        public static void ReplaceTrip(string dbPath,Trip trip)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                trip.Replace(ref command);
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public Trip(SqliteDataReader reader)
        {
            TripID = (long)reader["tripID"];
            Number = (string)(reader["number"]);
            Name = (string)(reader["name"]);
            direct = (int)(long)reader["direct"];
            TypeID = (int)(long)reader["typeID"];
            Seq = (int)(long)reader["seq"];

        }

    }

}
