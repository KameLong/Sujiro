using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Sujiro.Data
{
    public class Route
    {
        public static readonly string TABLE_NAME = "routes";

        public long RouteID { get; set; }
        public string Name { get; set; } = "";
        public long CompanyID { get; set; }
        public Route()
        {
            RouteID = MyRandom.NextSafeLong();
        }
        public Route(SqliteDataReader reader)
        {
            RouteID = (long)reader["routeID"];
            Name = (string)reader["name"];
            CompanyID = (long)reader["companyID"];
        }
        public static string CreateTableSqlite()
        {
            return $"create table {TABLE_NAME} (routeID integer primary key not null,name text,companyID integer)";
        }
        public void ReplaceSqlite(ref SqliteCommand command)
        {
            command.CommandText = $@"REPLACE INTO {TABLE_NAME} (routeID,name,companyID)values(:routeID,:name,:companyID)";
            command.Parameters.Add(new SqliteParameter(":routeID", RouteID));
            command.Parameters.Add(new SqliteParameter(":name", Name));
            command.Parameters.Add(new SqliteParameter(":companyID", CompanyID));
        }
        public static void PutRoute(string dbPath, Route route)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                route.ReplaceSqlite(ref command);
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public static void DeleteRoute(string dbPath, long routeID)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = @$"DELETE FROM {TABLE_NAME} where routeID=:routeID";
                command.Parameters.Add(new SqliteParameter(":routeID", routeID));
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public static List<Route> GetAllRoute(string dbPath)
        {
            List<Route> routes = new List<Route>();
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = @$"SELECT * FROM {TABLE_NAME}";
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        routes.Add(new Route(reader));
                    }
                }
                conn.Close();
            }
            return routes;
        }


    }
}
