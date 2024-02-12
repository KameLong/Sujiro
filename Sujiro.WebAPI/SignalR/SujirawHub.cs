using Microsoft.AspNetCore.SignalR;
using Sujiro.Data.Common;
using Sujiro.WebAPI.Service.AuthService;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Threading.Tasks;

namespace Sujiro.WebAPI.SignalR
{
    public class SujirawHub : Hub
    {
        private readonly IConfiguration Configuration;
        public SujirawHub(IConfiguration configuration) { 
            Configuration = configuration;
        }
        private static readonly ConcurrentDictionary<string, bool> _connections = new ConcurrentDictionary<string, bool>();
        public long CompanyID { get; set; }
        /**接続開始したときの処理です*/
        public override async Task OnConnectedAsync()
        {
            var User= Context.User;
            _connections.TryAdd(Context.ConnectionId, true);
            await base.OnConnectedAsync();
            Debug.WriteLine("接続開始" + _connections.Count);
        }
        public async Task Init(string companyID)
        {
            string dbDir = Configuration["ConnectionStrings:DBdir"] ;

            bool auth=AuthService.HasAccessPrivileges(dbDir, Context.User, long.Parse(companyID));
            if (!auth)
            {
                return;
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, companyID.ToString()) ;
            Debug.WriteLine("JOIN" + companyID);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            bool value;
            _connections.TryRemove(Context.ConnectionId, out value);
            Debug.WriteLine("接続終了"+_connections.Count);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        public async Task DeleteTrip(long tripID)
        {
            await Clients.All.SendAsync("DeleteTrip", tripID);
        }
    }
}
