using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;

namespace Sujiro.WebAPI.Controllers
{



    [Route("api/[controller]")]
    [ApiController]
    public class StationController : SujiroAPIController
    {
        public StationController(IHubContext<ChatHub> hubContext, IConfiguration configuration):base(hubContext, configuration)
        {
        }

        [HttpGet]
        public IEnumerable<Station> Get()
        {
            try
            {
                DateTime now = DateTime.Now;
                var stations =new List<Station>();
                using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
                {
                    conn.Open();
                    var tran = conn.BeginTransaction();
                    var command = conn.CreateCommand();

                    command = conn.CreateCommand();
                    command.CommandText = @"SELECT * FROM stations";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Station station = new Station(reader);
                            stations.Add(station);
                        }
                    }
                }
                Debug.WriteLine((DateTime.Now - now).TotalMilliseconds);


                return stations;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
                throw e;
            }
        }

    }
}
