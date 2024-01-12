using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using System.Diagnostics;

namespace Sujiro.WebAPI.Controllers
{



    [Route("api/[controller]")]
    [ApiController]
    public class TrainTypeController : ControllerBase
    {
        private readonly IConfiguration Configuration;
        public TrainTypeController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        [HttpGet]
        public IEnumerable<TrainType> Get()
        {


            DateTime now = DateTime.Now;
            var trainTypes = new List<TrainType>();
            using (var conn = new SqliteConnection("Data Source=" + Configuration["ConnectionStrings:DBpath"]))
            {
                conn.Open();
                var tran = conn.BeginTransaction();
                var command = conn.CreateCommand();

                command = conn.CreateCommand();
                command.CommandText = @"SELECT * FROM traintypes";

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        trainTypes.Add(new TrainType(reader));
                    }
                }
            }
            Debug.WriteLine((DateTime.Now - now).TotalMilliseconds);


            return trainTypes;
        }

    }
}
