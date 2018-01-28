import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as logger from 'morgan';
import * as dotenv from 'dotenv';
import mongoose = require('mongoose');


import { HomeRouter } from './routes/home';
import RegisterRouter from './routes/register';
import LoginRouter from './routes/login';
import ChatRoomRouter from './routes/chatroom';
import ProfileRouter from './routes/profile';


class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.config();
    this.routes();
  }

  private config(): void {

    dotenv.load({path: '.env'});
    this.express.set('port', (process.env.PORT || 3000));
    this.express.use('/', express.static(path.join(__dirname, '../public')));
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.set('superSecret', 'secret');


    mongoose.connect(process.env.MONGODB_TEST_URI, {
      autoReconnect: true
    });
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', error => { console.error(error); mongoose.disconnect(); });
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    mongoose.connection.on('disconnected', () => console.log('Disconnected from MongoDB'));
  }

  private routes(): void {

    this.express.use('/', HomeRouter);
    this.express.use('/api/register', RegisterRouter);
    this.express.use('/api/login', LoginRouter);
    this.express.use('/api/chatroom', ChatRoomRouter);
    /*this.express.use('/profile', ProfileRouter);*/
    /*this.express.use('/user', FriendRequestRouter)*/
  }

}

export default new App().express;
