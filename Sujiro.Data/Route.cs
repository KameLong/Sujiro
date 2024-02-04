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
        public static string CreateTableSqlite()
        {
            return $"create table {TABLE_NAME} (routeID integer primary key not null,name text,companyID integer)";
        }

    }
}
