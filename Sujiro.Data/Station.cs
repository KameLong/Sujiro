using Microsoft.Data.Sqlite;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sujiro.Data
{
    [Table(TABLE_NAME)]
    public class Station
    {
        public const string TABLE_NAME = "stations"; 
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
