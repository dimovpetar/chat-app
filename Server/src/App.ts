import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import mongoose = require('mongoose');


import { HomeRouter } from './routes/home';
import RegisterRouter from './routes/register';
import LoginRouter from './routes/login';
import ChatRoomRouter from './routes/chatroom';
import ProfileRouter from './routes/profile';
import FriendRequestRouter from './routes/friendRequest';

class App {
  // ref to Express instance
  public express: express.Application;

  constructor() {

    this.express = express();
    this.config();
    this.middleware();
    this.routes();
  }

  private config(): void {

    this.express.set('superSecret', 'secret');
    mongoose.connect('mongodb://localhost:27017/mean-chat-app', { useMongoClient: true, autoReconnect: true});
    mongoose.connection.on('error', error => { console.error(error); mongoose.disconnect()});
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    mongoose.connection.on('disconnected', () => console.log('Disconnected from MongoDB'));
    mongoose.Promise = global.Promise;
  }

  private middleware(): void {

    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    const corsOptions: cors.CorsOptions = {
      allowedHeaders: ["Authorization", "Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: "http://localhost:4200",
      preflightContinue: false
    };
    this.express.use(cors(corsOptions));
    // enable CORS pre-flight
    this.express.options("*", cors(corsOptions));
  }

  private routes(): void {

    this.express.use('/', HomeRouter);
    this.express.use('/register', RegisterRouter);
    this.express.use('/login', LoginRouter);
    this.express.use('/chatroom', ChatRoomRouter);
    this.express.use('/profile', ProfileRouter);
    this.express.use('/user', FriendRequestRouter)
  }

}

export default new App().express;
