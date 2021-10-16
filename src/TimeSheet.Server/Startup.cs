using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.SpaServices.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using TimeSheet.Common;
using TimeSheet.Repositories;
using TimeSheet.Services;

namespace TimeSheet
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                var serverSecret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:key"]));
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = serverSecret,
                    ValidIssuer = Configuration["JWT:Issuer"],
                    ValidAudience = Configuration["JWT:Audience"]
                };
            });

            services.AddControllers();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot";
            });

            services.AddSingleton<IDatabaseService, DatabaseService>();

            services.AddSingleton<ITimeSheetRepository, TimeSheetRepository>();
            services.AddSingleton<IUserRepository, UserRepository>();
            services.AddSingleton<ISettingsRepository, SettingsRepository>();

            services.AddSingleton<ISessionService, SessionService>();
            services.AddSingleton<IHashingService, HashingService>();
            services.AddSingleton<ISettingsService, SettingsService>();
            services.AddSingleton<ITimeSheetService, TimeSheetService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            app.Use(async (context, next) => await ApiKeyMiddleware.Invoke(context, next));

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            if ((Configuration["path-base"] ?? Configuration["PathBase"]) is string pathBase)
                app.UsePathBase(pathBase);

            app.Use(async (context, next) =>
            {
                bool isMatch = false;
                var originalPath = context.Request.Path;
                var originalPathBase = context.Request.PathBase;

                if (context.Request.Headers.TryGetValue("X-Forwarded-Path", out StringValues values) && values.Count > 0)
                {
                    foreach (var path in values)
                    {
                        if (context.Request.Path.StartsWithSegments("/" + path.Trim('/'), out var matched, out var remaining))
                        {
                            isMatch = true;
                            context.Request.Path = remaining;
                            context.Request.PathBase = context.Request.PathBase.Add(matched);
                            break;
                        }
                    }
                }

                try
                {
                    await next();
                }
                finally
                {
                    if (isMatch)
                    {
                        context.Request.Path = originalPath;
                        context.Request.PathBase = originalPathBase;
                    }
                }
            });
            app.UseForwardedHeaders();

            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.Use(async (context, next) =>
                {
                    var body = context.Response.Body;
                    using var newBody = new MemoryStream();
                    context.Response.Body = newBody;

                    await next();

                    context.Response.Body = body;
                    newBody.Seek(0, SeekOrigin.Begin);
                    if (context.Response.ContentType == "text/html")
                    {
                        using var streamReader = new StreamReader(newBody);
                        var html = await streamReader.ReadToEndAsync();
                        var baseTagMatch = Regex.Match(html, @"<base href=""(?<PathBase>[^""]+)""\s*\/?>");
                        if (baseTagMatch.Success)
                        {
                            var pathBaseGroup = baseTagMatch.Groups["PathBase"];
                            html = string.Concat(html[..pathBaseGroup.Index], context.Request.PathBase.Value.TrimEnd('/') + "/", html[(pathBaseGroup.Index + pathBaseGroup.Value.Length)..]);
                        }

                        context.Response.ContentLength = null;
                        await using (var sw = new StreamWriter(context.Response.Body))
                        {
                            await sw.WriteAsync(html);
                        }
                    }
                    else
                    {
                        await newBody.CopyToAsync(context.Response.Body);
                    }
                });
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "../TimeSheet.Client";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
