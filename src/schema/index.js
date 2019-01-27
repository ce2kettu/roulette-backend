import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { UserQuery, RouletteQuery, BetQuery } from './queries';
import { UserMutation, RouletteMutation, BetMutation } from './mutations';

const rootQueryFields = {
    user: UserQuery.user,
    allUsers: UserQuery.users,
    rouletteGame: RouletteQuery.roulette,
    allRoulettes: RouletteQuery.roulettes,
    bet: BetQuery.bet,
    allBets: BetQuery.bets
};

const rootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: rootQueryFields,
    description: ''
});

const rootMutationFields = {
    loginUser: UserMutation.loginUser,
    createUser: UserMutation.createUser,
    createRoulette: RouletteMutation.createRoulette,
    createBet: BetMutation.createBet
};

const rootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: rootMutationFields,
    description: ''
});

const rootSubscriptionFields = {};

const rootSubscription = new GraphQLObjectType({
    name: 'Subscription',
    fields: rootSubscriptionFields,
    description: ''
});

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
    /* subscription: rootSubscription */
});

export default schema