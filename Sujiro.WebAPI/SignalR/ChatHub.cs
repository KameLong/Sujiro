using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using System.Collections.Concurrent;
using System.Diagnostics;

namespace Sujiro.WebAPI.SignalR
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, bool> _connections = new ConcurrentDictionary<string, bool>();

        /**接続開始したときの処理です*/
        public override async Task OnConnectedAsync()
        {
            _connections.TryAdd(Context.ConnectionId, true);
            await base.OnConnectedAsync();
            Debug.WriteLine("接続開始" + _connections.Count);
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
