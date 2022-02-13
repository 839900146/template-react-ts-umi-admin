import server from '../server';
const ProxyServer = server.proxyServer;

export default [
  {
    prefix: '/api/v1',
    target: ProxyServer.server1,
  },
  {
    prefix: '/api/v2',
    target: ProxyServer.server2,
    pathRewrite: { '^': '' },
  },
];
