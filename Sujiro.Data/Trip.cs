using Microsoft.Data.Sqlite;

namespace Sujiro.Data
{
    public class Trip 
    {
        public long? TripID { get; set; } = -1;
        public long direct { get; set; } = -1;
        public string? Name { get; set; } = "";
        public string? Number { get; set; } = "";
        public int Type { get; set; } = -1;
        public Trip()
        {

        }
        public Trip(SqliteDataReader reader)
        {
            TripID = (int)(long)reader["tripID"];
            if (reader["number"] != DBNull.Value)
            {
                Number = (string)(reader["number"] ?? "");
            }
            if (reader["name"] != DBNull.Value)
            {
                Name = (string)(reader["name"] ?? "");
            }
            direct = (int)(long)reader["direct"];
            Type = (int)(long)reader["type"];

        }

    }

}
