using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sujiro.Data
{
    public class CompanySqlite
    {
        public static void CreateCompanySqlite(string DBdir,long companyID)
        {
            using (var conn = new SqliteConnection("Data Source=" + DBdir+"company_"+companyID+".sqlite"))
            {
                conn.Open();
                var tran = conn.BeginTransaction();
                var command = conn.CreateCommand();
                command.CommandText =Route.CreateTableSqlite();
                command.ExecuteNonQuery();
                command=conn.CreateCommand();
                command.CommandText =Station.CreateTableSqlite();
                command.ExecuteNonQuery();
                command = conn.CreateCommand();
                command.CommandText = RouteStation.CreateTableSqlite();
                command.ExecuteNonQuery();
                tran.Commit();
            }
        }



    }
}
