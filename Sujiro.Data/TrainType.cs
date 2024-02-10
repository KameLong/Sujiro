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
        public static string CreateTableSqlite()
        {
            return $"""
                create table {TABLE_NAME} (
                trainTypeID integer primary key not null,
                name text not null default '',
                shortname text not null default '',
                color text not null default '#000000')
                """;
        }
        public void ReplaceSqlite(ref SqliteCommand command)
        {
            command.CommandText = $@"REPLACE INTO {TABLE_NAME} (trainTypeID,name,shortname,color)values(:trainTypeID,:name,:shortname,:color)";
            command.Parameters.Add(new SqliteParameter(":trainTypeID", TrainTypeID));
            command.Parameters.Add(new SqliteParameter(":name", Name));
            command.Parameters.Add(new SqliteParameter(":shortname", ShortName));
            command.Parameters.Add(new SqliteParameter(":color", color));
            command.ExecuteNonQuery();
        }
        public static void PutTrainType(string dbPath, TrainType trainType)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                trainType.ReplaceSqlite(ref command);
            }
        }
        public static void DeleteTrainType(string dbPath, long trainTypeID)
        {
            //todo　使用中チェック
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = $@"DELETE FROM {TABLE_NAME} WHERE trainTypeID=:trainTypeID";
                command.Parameters.Add(new SqliteParameter(":trainTypeID", trainTypeID));
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public static List<TrainType>GetAllTrainType(string dbPath)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                return GetAllTrainType(command);
            }
        }
        public static List<TrainType> GetAllTrainType(SqliteCommand command)
        {
            List<TrainType> trainTypes = new List<TrainType>();
            command.CommandText = $@"SELECT * FROM {TABLE_NAME}";
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    trainTypes.Add(new TrainType(reader));
                }
            }
            return trainTypes;
        }

    }
}
