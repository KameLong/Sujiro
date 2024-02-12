using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.Data.Common;
using Sujiro.WebAPI.Service.AuthService;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;

namespace Sujiro.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : SujiroAPIController
    {
        public UserController(IHubContext<SujirawHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpGet("registered")]
        public async Task<ActionResult>  Get()
        {
            try
            {
                if (AuthService.GetUserID(User) == "")
                {
                    return Unauthorized();
                }
                string dbPath = Configuration["ConnectionStrings:DBdir"] + MasterData.MASTER_DATA_FILE;

                using (var conn = new SqliteConnection("Data Source=" + dbPath))
                {
                    conn.Open();

                    var command = conn.CreateCommand();
                    command.CommandText = $"SELECT count(*) FROM {Sujiro.Data.User.TABLE_NAME} where userID=:userID";
                    command.Parameters.Add(new SqliteParameter(":userID", AuthService.GetUserID(User)));
                    if ((long)command.ExecuteScalar() >0)
                    {
                        return Ok();
                    }
                    command = conn.CreateCommand();
                    command.CommandText=$"SELECT count(*) FROM {Sujiro.Data.User.TABLE_NAME}";
                    if((long)command.ExecuteScalar()<10)
                    {
                        Sujiro.Data.User user = new Sujiro.Data.User();
                        user.UserID = AuthService.GetUserID(User);
                        user.UserType = "beta";
                        user.Replace(conn);
                        return Ok();
                    }
                    return NoContent();
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
                throw e;
            }
        }
    }
}
