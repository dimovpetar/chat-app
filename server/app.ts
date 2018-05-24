import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as logger from 'morgan';
import * as dotenv from 'dotenv';

import { HomeRouter } from './routes/home';
import RegisterRouter from './routes/register';
import LoginRouter from './routes/login';
import ChatRoomRouter from './routes/chatroom';
import ImageRouter from './routes/images';

class ExpressApp {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.config();
    this.routes();
  }

  private config(): void {

    dotenv.load({path: '.env'});
    this.express.use(logger('dev'));
    this.express.set('port', (process.env.PORT || 3000));
    this.express.use(express.static(path.join(__dirname, '../public')));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.set('superSecret', process.env.SECRET_TOKEN);

  }

  private routes(): void {

    this.express.use('/', HomeRouter);
    this.express.use('/api/register', RegisterRouter);
    this.express.use('/api/login', LoginRouter);
    this.express.use('/api/chatroom', ChatRoomRouter);
    this.express.use('/api/images', ImageRouter);
  }

}

export default new ExpressApp().express;
