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
    public class AdminController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        public AdminController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }
        [HttpGet("Reset")]
        public async Task<int> Get()
        {
            Debug.WriteLine("Reset");
            await OuDia2Sujiro.Reset();
            return 0;
        }
    }
}
