using Microsoft.Data.Sqlite;

namespace Sujiro.Data
{
    public class Station
    {
        public long? StationID { get; set; } = -1;
        public string Name { get; set; } = "";
        public int Style { get; set; } = -1;

        public Station()
        {

        }
        public Station(SqliteDataReader reader)
        {
            StationID = (long)reader["stationID"];
            Name = (string)reader["name"];
            Style = (int)(long)reader["style"];
        }
    }
}
