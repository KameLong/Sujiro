using Microsoft.Data.Sqlite;
using Sujiro.Data.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sujiro.Data
{
    [Table(TABLE_NAME)]
    public class TrainType
    {
        public const string TABLE_NAME = "train_types";
        public long TrainTypeID { get; set; }
        public string Name { get; set; } = "";
        public string ShortName { get; set; } = "";
        public string color { get; set; } = "#000000";

        public TrainType()
        {
            TrainTypeID = MyRandom.NextSafeLong();
        }
        public TrainType(SqliteDataReader reader)
        {
            TrainTypeID = (long)reader["trainTypeID"];
            Name = (string)reader["name"];
            ShortName = (string)reader["shortname"];
            color = (string)reader["color"];
        }
    }
}
