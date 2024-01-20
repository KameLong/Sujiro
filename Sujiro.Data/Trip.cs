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

        public int Seq { get; set; } = -1;
        public Trip()
        {

        }
        public void Update(ref SqliteCommand command)
        {
            command.CommandText = @"UPDATE trips SET direct=$direct,name=$name,number=$number,type=$type WHERE tripID=$tripID seq=$seq";
            command.Parameters.AddWithValue("$tripID", TripID);
            command.Parameters.AddWithValue("$direct", direct);
            command.Parameters.AddWithValue("$name", Name);
            command.Parameters.AddWithValue("$number", Number);
            command.Parameters.AddWithValue("$type", Type);
            command.Parameters.AddWithValue("$seq", Seq);
        }
        public Trip(SqliteDataReader reader)
        {
            TripID = (long)reader["tripID"];
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
            Seq = (int)(long)reader["seq"];

        }

    }

}
