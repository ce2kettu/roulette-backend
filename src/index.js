import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { convertToSteamId } from './utils';
import { createServer } from 'http';
import { User, Roulette } from './models';
import { logger } from './utils';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import SteamStrategy from 'passport-steam';
import session from 'express-session';
import config from './config';
import database from './database';
import connect from 'connect-mongo';
import authRouter from './routers/auth';
import apiRouter from './routers/api';
import expressPrintRoutes from 'express-print-routes';
import path from 'path';
import schema from './schema';
//import roulette from './roulette';

const relative = (_path) => path.relative(__dirname, _path);

// Hotfix to hide depcrecation warning
//mongoose.Promise = Promise;

// Log node environment 
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);

// Listen to database events
database.once('open', () => {
  logger.info('MongoDB event open');
  logger.debug('MongoDB connected [%s]', `mongodb://${process.env.NODE_ENV === 'prod' ? `${config.DB_USERNAME}:${config.DB_PASSWORD}@` : ''}${config.DB_HOST}:${config.DB_PORT}/${config.DATABASE}`);

  database.on('connected', () => {
    logger.info('MongoDB event connected');
  });

  database.on('disconnected', () => {
    logger.warn('MongoDB event disconnected');
  });

  database.on('reconnected', () => {
    logger.info('MongoDB event reconnected');
  });

  database.on('error', err => {
    logger.error('MongoDB event error: ' + err);
  });

  // After the connection to the database is initialised, we are ready to start the server
  return start();
})


/**
 * Starts the server
 */
const start = async () => {
  let app = express();

  // CORS for cross origin
  app.use(cors())

  // Print Express app routes
  if (process.env.NODE_ENV === 'dev') {
    const filepath = path.join(__dirname, '../docs/routes.txt');
    expressPrintRoutes(app, filepath);
  }

  // Session store for logins etc.
  const MongoStore = connect(session);

  app.use(session({
    secret: config.SESSION_SECRET,
    name: 'betwilder',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: database }),
    // 30 days
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
  }));

  // Initialize Passport!  Also use passport.session() middleware, to support persistent login sessions (recommended)
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * Passport session setup
   * 
   * To support persistent login sessions, Passport needs to be able to
   * serialize users into and deserialize users out of the session.  Typically,
   * this will be as simple as storing the user ID when serializing, and finding
   * the user by ID when deserializing.
   */
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  // Handle steam login
  passport.use(new SteamStrategy({
    returnURL: `http://${config.HOST}:${config.PORT}/auth/steam/callback`,
    realm: `http://${config.HOST}:${config.PORT}/`,
    apiKey: config.STEAM_API_KEY
  },
    (identifier, profile, done) => {
      // Asynchronous verification
      process.nextTick(() => {

        profile.identifier = identifier;

        const userData = profile._json;

        // Steam profile data to insert/update to a user
        const user = {
          username: userData.personaname,
          steamId: convertToSteamId(userData.steamid),
          steamId64: userData.steamid,
          avatarUrl: userData.avatarmedium
        }

        // Associate Steam account with a user record in the database
        User.loginUser({ steamId64: user.steamId64 }, user);

        return done(null, profile);
      });
    }
  ));

  // Express app routes
  app.use('/auth', authRouter);
  app.use('/api', apiRouter);

  const server = createServer(app);

  // Tell the server to listen for activity on the port specified
  server.listen(config.PORT, () => {
    // Create server for GraphQL subscriptions
    SubscriptionServer.create(
      { execute, subscribe, schema },
      { server, path: config.subscriptionsPath },
    );

    console.log(
      `\n🚀 GraphQL server: http://${config.HOST}:${config.PORT}${config.graphQLPath}\n` +
      `\n🌎 GraphiQL IDE: http://${config.HOST}:${config.PORT}${config.graphiQLPath}\n` +
      `\n🌎 GraphQL schema: http://${config.HOST}:${config.PORT}${config.voyagerPath}\n`
    );
  });
};