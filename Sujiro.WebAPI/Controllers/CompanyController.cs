using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OuDia;
using Sujiro.Data;
using Sujiro.WebAPI.SignalR;
using System.ComponentModel.Design;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Net.Mime.MediaTypeNames;
namespace Sujiro.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController :SujiroAPIController
    {
        public CompanyController(IHubContext<ChatHub> hubContext, IConfiguration configuration) : base(hubContext, configuration)
        {

        }
        [HttpGet("get/{companyID}")]
        public async Task<ActionResult> GetCompany(long companyID)
        {
            string dbPath = Configuration["ConnectionStrings:DBdir"] + MasterData.MASTER_DATA_FILE;

            string? userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if(userId == null)
            {
                return Unauthorized();
            }
            Company? company = Company.GetCompany(dbPath, companyID);
            if(company == null)
            {
                return NotFound();
            }
            if(company.UserID != userId)
            {
                return Forbid();
            }
            return Ok(company);
        }
        [HttpGet("getAll")]
        public async Task<ActionResult> GetAllCompany()
        {
            try
            {

            string dbPath = Configuration["ConnectionStrings:DBdir"] + MasterData.MASTER_DATA_FILE;

            string? userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            List<Company> company = Company.GetUserCompany(dbPath, userId);
            return Ok(company);
            }catch(Exception ex) {
                Debug.WriteLine(ex);
                return BadRequest(ex.Message);

            }

        }

        [HttpPut]
        public async Task<ActionResult> PutCompany(Company company)
        {
            try
            {

            string dbPath = Configuration["ConnectionStrings:DBdir"]+MasterData.MASTER_DATA_FILE;
            string? userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            Company? oldCompany = Company.GetCompany(dbPath,company.CompanyID);

            if(oldCompany == null)
            {
                //新規追加
                Company.InsertCompany(dbPath, company);
                return Created();
            }
            if(oldCompany.UserID != userId)
            {
                //すでに違う人が作成している。
                return Forbid();
            }
            //新しい情報で更新する。
            Company.UpdateCompany(dbPath, company);
            return Ok();

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return BadRequest(ex.Message);

            }



        }

    }
}
