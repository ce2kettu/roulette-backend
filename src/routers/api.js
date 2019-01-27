import { Router } from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { express as middleware } from 'graphql-voyager/middleware';
import bodyParser from 'body-parser';
import config from '../config';
import formatError from '../formatError';
import schema from '../schema';
import buildDataloaders from '../dataloaders';

let router = Router();

// Options for GraphQL resolvers
const buildOptions = async (req, res) => {
    const user = req.user._json || null;
    return {
        context: {
            /* dataloaders: buildDataloaders(mongo),
            mongo, */
            user,
        },
        formatError,
        schema,
    };
};

/**
 * POST /api/graphql
 * GraphQL endpoint
 */
router.post(config.graphQLPath, bodyParser.json(), graphqlExpress(buildOptions));

/**
 * GET /api/voyager
 * GraphQL Voyager data viewer
 */
router.get(config.voyagerPath, middleware({ endpointUrl: config.graphQLPath }));

/**
 * GET /api/graphiql
 * GraphQL IDE
 */
router.get(config.graphiQLPath, graphiqlExpress({
    endpointURL: '/api' + config.graphQLPath,
    passHeader: `'Authorization': 'bearer token-foo@bar.com'`,
    subscriptionsEndpoint: `ws://${config.HOST}:${config.PORT}${config.subscriptionsPath}`,
}));

export default router