import { GraphQLEnumType, GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLID } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { UserType, RouletteType } from './'

const ROULETTE_BET_TYPE = new GraphQLEnumType({
    name: 'ROULETTE_BET_TYPE',
    values: {
        STRAIGHT: {
            value: 0,
            description: ''
        },
        COLOR: {
            value: 1,
            description: ''
        },
        PARITY: {
            value: 2,
            description: ''
        },
        COLUMN: {
            value: 3,
            description: ''
        },
        DOZEN: {
            value: 4,
            description: ''
        },
        HALF: {
            value: 5,
            description: ''
        }
    }
});

const ROULETTE_BET_STATUS = new GraphQLEnumType({
    name: 'ROULETTE_BET_STATUS',
    values: {
        PENDING: {
            value: 0,
            description: ''
        },
        WON: {
            value: 1,
            description: ''
        },
        LOST: {
            value: 2,
            description: ''
        }
    }
});

export const BetType = new GraphQLObjectType({
    name: 'Bet',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: 'id'
        },
        user: {
            type: new GraphQLNonNull(UserType),
            description: ''
        },
        game: {
            type: new GraphQLNonNull(RouletteType),
            description: ''
        },
        type: {
            type: new GraphQLNonNull(ROULETTE_BET_TYPE),
            description: ''
        },
        amount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: ''
        },
        value: {
            type: new GraphQLNonNull(GraphQLString),
            description: ''
        },
        status: {
            type: new GraphQLNonNull(ROULETTE_BET_STATUS),
            description: ''
        },
        updatedAt: {
            type: new GraphQLNonNull(GraphQLDateTime),
            description: ''
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLDateTime),
            description: ''
        }
    })
});