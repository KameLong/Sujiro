using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Route = Sujiro.Data.Route;

namespace Sujiro.WebAPI.Controllers.FE
{

    public class  EditRoute :Route
    {
        public List<RouteStation> RouteStations { get; set; } = new List<RouteStation>();
        public EditRoute():base()
        {
        }
        public EditRoute(SqliteDataReader reader):base(reader)
        {
        }
        
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RouteEditPageController : ControllerBase
    {
        
        
    }
}
