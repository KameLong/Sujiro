using Microsoft.Data.Sqlite;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sujiro.Data
{
    [Table(TABLE_NAME)]
    public class OldStation
    {
        public const string TABLE_NAME = "stations"; 
        public long? StationID { get; set; } = -1;
        public string Name { get; set; } = "";
        public int Style { get; set; } = -1;

        public OldStation()
        {

        }
        public OldStation(SqliteDataReader reader)
        {
            StationID = (long)reader["stationID"];
            Name = (string)reader["name"];
            Style = (int)(long)reader["style"];
        }
    }
}
