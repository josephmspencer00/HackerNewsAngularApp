const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:5338';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api/hackernews",
      "/api/hackernews/newresultsbypage",
      "/api/hackernews/search",
      "/api/hackernews/idsasync",
   ],
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
