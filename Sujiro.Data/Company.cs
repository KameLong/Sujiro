using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sujiro.Data
{
    [Table(TABLE_NAME)]
    public class Company
    {
        public const string TABLE_NAME = "companys";

        public long Id { get; set; }
        public string Name { get; set; } = "";

        public string UserID { get; set; }

        public Company()
        {
            Id=

        }
        public Company(SqliteDataReader reader)
        {
            Name = (string)reader["name"];
            UserID = (string)reader["userID"];
        }
    }
}
