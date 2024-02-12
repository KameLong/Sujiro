using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using Sujiro.Data;
using Sujiro.WebAPI.Service.AuthService;
using Sujiro.WebAPI.SignalR;
using System.Diagnostics;

namespace Sujiro.WebAPI.Controllers.SujirawData
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly IConfiguration Configuration;
        private readonly IHubContext<SujirawHub> _hubContext;
        public TripController(IHubContext<SujirawHub> hubContext, IConfiguration configuration)
        {
            _hubContext = hubContext;
            Configuration = configuration;

        }

        [HttpGet]
        public IEnumerable<Trip> Get(int direct)
        {
            throw new Exception("Not implemented");
        }
        [HttpDelete("{companyID}/{tripID}")]
        public async Task<ActionResult> DeleteTrip(long companyID, long tripID)
        {
            if (!AuthService.HasAccessPrivileges(Configuration["ConnectionStrings:DBdir"], User, companyID))
            {
                return Forbid();
            }
            var dbpath = Configuration["ConnectionStrings:DBdir"] + "company_" + companyID + ".sqlite";
            using (var conn = new SqliteConnection("Data Source=" + dbpath))
            {
                conn.Open();
                var tran = conn.BeginTransaction();
                Trip? trip = Trip.GetTrip(conn, tripID);
                if (trip == null)
                {
                    return NotFound();
                }

                var command = conn.CreateCommand();
                command.CommandText = $"DELETE from {Trip.TABLE_NAME} where {nameof(Trip.TripID)}=:tripID";
                command.Parameters.Add(new SqliteParameter(":tripID", trip.TripID));
                command.ExecuteNonQuery();

                command = conn.CreateCommand();
                command.CommandText = $"UPDATE {Trip.TABLE_NAME} set {nameof(Trip.TripSeq)}={nameof(Trip.TripSeq)}-1 where {nameof(Trip.TripSeq)}>{trip.TripSeq}";
                command.ExecuteNonQuery();

                command = conn.CreateCommand();
                command.CommandText = $"DELETE from {StopTime.TABLE_NAME} where {nameof(StopTime.tripID)}=:tripID";
                command.Parameters.Add(new SqliteParameter(":tripID", trip.TripID));
                command.ExecuteNonQuery();
                tran.Commit();
                await _hubContext.Clients.Groups(companyID.ToString()).SendAsync("DeleteTrips", new List<Trip> { trip });
            }
            return NoContent();

        }
    }
}
