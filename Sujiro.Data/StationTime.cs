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
        public int GetDAtime()
        {
            if (!(depTime is null) && depTime >= 0)
            {
                return depTime ?? -1;
            }
            return ariTime ?? -1;
        }
        public int GetADtime()
        {
            if (!(ariTime is null) && ariTime >= 0)
            {
                return ariTime ?? -1;
            }
            return depTime ?? -1;
        }
    }
}
