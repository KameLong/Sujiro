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
        public void Update(ref SqliteCommand command)
        {
            command.CommandText = @"UPDATE stop_time SET tripID=$tripID,stationID=$stationID,ariTime=$ariTime,depTime=$depTime,stopType=$stopType WHERE stopTimeID=$stopTimeID";
            command.Parameters.AddWithValue("$stopTimeID", StopTimeID);
            command.Parameters.AddWithValue("$tripID", tripID);
            command.Parameters.AddWithValue("$stationID", stationID);
            command.Parameters.AddWithValue("$ariTime", ariTime);
            command.Parameters.AddWithValue("$depTime", depTime);
            command.Parameters.AddWithValue("$stopType", stopType);
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
