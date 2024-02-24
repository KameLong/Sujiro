using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using OuDia;
using Sujiro.Data;
using Sujiro.Data.Common;
using Sujiro.WebAPI.Service.AuthService;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text;
using static System.Formats.Asn1.AsnWriter;
using Route = Sujiro.Data.Route;

namespace Sujiro.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ImportController : SujiroAPIController
    {
        public class UploadFile
        {
            [DataMember(Name = "file")]
            public IFormFile File { get; set; }
        }


        public ImportController(IHubContext<SujirawHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {
        }

        [HttpPost("oudia/{companyID}")]
        public async Task<ActionResult> ImportOuDiaFile(long companyID, [FromForm] UploadFile uploadFile)
        {
            try
            {
                if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
                {
                    return Forbid();
                }
                string filePath = Configuration["ConnectionStrings:DBdir"] + $"company_{companyID}.sqlite";
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                var stream=uploadFile.File.OpenReadStream() ;
                using (var conn = new SqliteConnection("Data Source=" + filePath))
                {
                    conn.Open();
                    var tran = conn.BeginTransaction();
                    await OuDia2Sujiro.OuDia2Sujiraw(stream, conn,companyID);
                    tran.Commit();
                }

                

                return Ok();

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return StatusCode(500);
            }
        }
    }
}

