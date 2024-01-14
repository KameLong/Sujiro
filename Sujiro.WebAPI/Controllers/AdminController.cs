using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OuDia;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using static System.Net.Mime.MediaTypeNames;
namespace Sujiro.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController :SujiroAPIController
    {
        public AdminController(IHubContext<ChatHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }
        [HttpGet("Reset")]
        public async Task<int> Get()
        {
            Debug.WriteLine("Reset");
            await OuDia2Sujiro.Reset(Configuration["ConnectionStrings:oudPath"], Configuration["ConnectionStrings:DBpath"]);
            return 0;
        }
    }
}
