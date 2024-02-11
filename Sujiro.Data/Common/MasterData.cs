using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sujiro.Data.Common
{
    static public class MasterData
    {
        public static readonly string MASTER_DATA_FILE = "MASTER_DATA.sqlite";
        public static void CreateMasterData(string DBdir)
        {
            using (var conn = new SqliteConnection("Data Source=" + DBdir + MASTER_DATA_FILE))
            {
                conn.Open();
                var tran = conn.BeginTransaction();
                var command = conn.CreateCommand();
                command.CommandText = Company.CreateTableSqlite();
                command.ExecuteNonQuery();
                command.CommandText=User.CreateTableSqlite();
                command.ExecuteNonQuery();
                tran.Commit();
            }
        }
    }
}
