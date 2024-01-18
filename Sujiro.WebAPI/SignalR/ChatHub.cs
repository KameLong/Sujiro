using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using System.Diagnostics;

namespace Sujiro.WebAPI.SignalR
{
    public class ChatHub : Hub
    {
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
