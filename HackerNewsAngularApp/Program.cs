using HackerNewsAngularApp.Interfaces;
using HackerNewsAngularApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient();

builder.Services.AddScoped<IHackerNewsService, HackerNewsService>();

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//Enable CORS
app.UseCors(c => c.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapFallbackToFile("index.html");

app.Run();