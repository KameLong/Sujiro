using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;





namespace Sujiro.WebAPI.Controllers
{
    public class SujiroAPIController:ControllerBase
    {
            protected readonly IConfiguration Configuration;
            protected readonly IHubContext<ChatHub> _hubContext;
            public SujiroAPIController(IHubContext<ChatHub> hubContext, IConfiguration configuration)
            {
                _hubContext = hubContext;
                Configuration = configuration;
            }

        }
    }
