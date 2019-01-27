import { GraphQLEnumType, GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLID } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { BetType } from './'

const STATUS_TYPE = new GraphQLEnumType({
    name: 'STATUS_TYPE',
    values: {
        OPEN: {
            value: 0,
            description: ''
        },
        CLOSED: {
            value: 1,
            description: ''
        },
        CANCELLED: {
            value: 2,
            description: ''
        }
    }
});

export const RouletteType = new GraphQLObjectType({
    name: 'Roulette',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: 'id'
        },
        winningNumber: {
            type: GraphQLInt,
            description: ''
        },
        stake: {
            type: new GraphQLNonNull(GraphQLInt),
            description: ''
        },
        status: {
            type: new GraphQLNonNull(STATUS_TYPE),
            description: ''
        },
        bets: {
            type: new GraphQLList(BetType),
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