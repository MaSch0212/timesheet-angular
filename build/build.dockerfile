FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-server
WORKDIR /src
COPY src/TimeSheet.Server .
RUN dotnet publish TimeSheet.Server.csproj -c Release -o /app/publish

FROM node:16 AS pre-build-client
WORKDIR /src
COPY src/TimeSheet.Client/package.json src/TimeSheet.Client/yarn.lock .
RUN yarn

FROM pre-build-client AS build-client
COPY src/TimeSheet.Client .
RUN yarn build-prod --output-path /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build-server /app/publish .
COPY --from=build-client /app/publish ./wwwroot/
ENV RUNSINDOCKER=true
ENTRYPOINT dotnet TimeSheet.dll