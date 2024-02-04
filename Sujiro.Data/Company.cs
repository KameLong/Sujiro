using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sujiro.Data
{
    [Table(TABLE_NAME)]
    public class Company
    {
        public const string TABLE_NAME = "companys";

        public long CompanyID { get; set; }
        public string Name { get; set; } = "";

        public string UserID { get; set; }

        public Company()
        {
            CompanyID = MyRandom.NextSafeLong();
        }
        public Company(SqliteDataReader reader)
        {
            CompanyID = (long)reader["companyID"];
            Name = (string)reader["name"];
            UserID = (string)reader["userID"];
        }
        public static string CreateTableSqlite()
        {
            return $"create table {TABLE_NAME} (companyID integer primary key not null,name text,UserID text)";
        }
        public void InsertSqlite(ref SqliteCommand command)
        {
            command.CommandText = $@"INSERT INTO {TABLE_NAME} (companyID,name,UserID)values(:companyID,:name,:userID)";
            command.Parameters.Add(new SqliteParameter(":companyID", CompanyID));
            command.Parameters.Add(new SqliteParameter(":name", Name));
            command.Parameters.Add(new SqliteParameter(":userID", UserID));

        }
        public void UpdateSqlite(ref SqliteCommand command)
        {
            command.CommandText = $@"UPDATE {TABLE_NAME} SET name=:name,userID=:userID WHERE companyID=:companyID";
            command.Parameters.Add(new SqliteParameter(":companyID", CompanyID));
            command.Parameters.Add(new SqliteParameter(":name", Name));
            command.Parameters.Add(new SqliteParameter(":userID", UserID));
        }

        public static void InsertCompany(string dbPath, Company company)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                company.InsertSqlite(ref command);
                command.ExecuteNonQuery();
                conn.Close();
            }
        }
        public static void UpdateCompany(string dbPath, Company company)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                company.UpdateSqlite(ref command);
                command.ExecuteNonQuery();
                conn.Close();
            }
        }

        public static Company? GetCompany(string dbPath,long id)
        {
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {
                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = @$"SELECT * FROM {TABLE_NAME} where companyID=:companyID";
                command.Parameters.Add(new SqliteParameter(":companyID", id));
                using (var reader = command.ExecuteReader())
                {

                    while (reader.Read())
                    {
                       return new Company(reader);
                    }
                }
            }
            return null;
        }
        public static List<Company> GetUserCompany(string dbPath, string userID)
        {
            List<Company> result = new List<Company>();
            using (var conn = new SqliteConnection("Data Source=" + dbPath))
            {

                conn.Open();
                var command = conn.CreateCommand();
                command.CommandText = @$"SELECT * FROM {TABLE_NAME} where userID=:userID";
                command.Parameters.Add(new SqliteParameter(":userID", userID));
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new Company(reader));
                    }
                }
            }
            return result;
        }

    }
}
