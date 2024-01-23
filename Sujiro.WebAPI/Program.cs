using Sujiro.WebAPI.SignalR;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            var a = builder.Configuration.GetSection("Cors:Origins").Get<string[]>();
            policy.WithOrigins(a);
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
            policy.AllowCredentials();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();


app.MapControllers();
app.MapHub<ChatHub>("/ws/chatHub");

//https://learn.microsoft.com/en-gb/aspnet/core/tutorials/web-api-javascript?view=aspnetcore-8.0&viewFallbackFrom=aspnetcore-3.0
//react‚ðwwwroot‚Ö
app.UseDefaultFiles();
app.UseStaticFiles();
//
app.MapFallbackToFile("index.html");

app.Run();
