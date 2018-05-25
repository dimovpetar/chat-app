import * as http from 'http';
import * as dotenv from 'dotenv';

(function () {
  dotenv.load({path: '.env'});
  console.log('Loading .env variables');
})();

import expressApp from './app';
import ChatSocket from './socket';
import db from './db';



const server = http.createServer(expressApp);
ChatSocket.setServer(server);

server.listen(expressApp.get('port'));
server.on('error', onError);
server.on('listening', onListening);

/*function normalizePort(val: number|string): number|string|boolean {
  const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}*/

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = (typeof expressApp.get('port') === 'string') ?
                    'Pipe ' + expressApp.get('port') : 'Port ' + expressApp.get('port');
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Server listening on ${ bind }`);
}

