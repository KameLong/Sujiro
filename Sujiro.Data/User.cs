using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Sujiro.Data
{
    public class User
    {
        public static readonly string TABLE_NAME = "users";
        public string UserID { get; set; }
        public string UserType { get; set; }

        public static string CreateTableSqlite()
        {
            return $"create table {TABLE_NAME} (userID text primary key not null,userType text not null)";
        }
        public void Replace(SqliteConnection conn)
        {
            var command = conn.CreateCommand();
            command.CommandText = $@"REPLACE INTO {TABLE_NAME} (userID,userType)values(:userID,:userType)";
            command.Parameters.Add(new SqliteParameter(":userID", UserID));
            command.Parameters.Add(new SqliteParameter(":userType", UserType));
            command.ExecuteNonQuery();
        }


    }
}
