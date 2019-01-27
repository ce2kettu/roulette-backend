let config;

const dev = {
  HOST: 'localhost',
  PORT: 3000,
  PROTOCOL: 'http',
  graphQLPath: '/graphql',
  graphiQLPath: '/graphiql',
  subscriptionsPath: '/subscriptions',
  voyagerPath: '/voyager',
  STEAM_API_KEY: '',
  DB_HOST: 'localhost',
  DB_PORT: 27017,
  DATABASE: 'betwilder',
  SESSION_SECRET: ''
}

const prod = {
  HOST: 'localhost',
  PORT: 3000,
  PROTOCOL: 'http',
  graphQLPath: '/graphql',
  graphiQLPath: '/graphiql',
  subscriptionsPath: '/subscriptions',
  voyagerPath: '/voyager',
  STEAM_API_KEY: '',
  DB_HOST: 'localhost',
  DB_PORT: 27017,
  DB_USERNAME: '',
  DB_PASSSWORD: '',
  DATABASE: 'betwilder',
  SESSION_SECRET: ''
}

if (process.env.NODE_ENV === 'dev') {
  config = dev;
} else if (process.env.NODE_ENV === 'prod') {
  config = prod;
}

export default config