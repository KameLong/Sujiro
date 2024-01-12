using Microsoft.Data.Sqlite;

namespace Sujiro.Data
{
    public class StopTime
    {
        public long? StopTimeID { get; set; }
        public long? tripID { get; set; } = -1;
        public long? stationID { get; set; } = -1;
        public int? ariTime { get; set; } = -1;
        public int? depTime { get; set; } = -1;
        public int? stopType { get; set; } = -1;

        public StopTime()
        {

        }
        public StopTime(SqliteDataReader reader)
        {
            StopTimeID = (long)reader["stopTimeID"];
            tripID= (long)reader["tripID"];
            stationID = (long)reader["stationID"];
            ariTime = (int)(long)reader["ariTime"];
            depTime = (int)(long)reader["depTime"];
            stopType = (int)(long)reader["stopType"];

        }
    }
}
