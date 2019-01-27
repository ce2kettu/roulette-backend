import { GraphQLObjectType, GraphQLInputObjectType, GraphQLBoolean, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLID } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { BetType } from './'

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: 'id'
        },
        username: {
            type: new GraphQLNonNull(GraphQLString),
            description: ''
        },
        avatarUrl: {
            type: new GraphQLNonNull(GraphQLString),
            description: ''
        },
        steamId: {
            type: new GraphQLNonNull(GraphQLString),
            description: ''
        },
        steamId64: {
            type: new GraphQLNonNull(GraphQLString),
            description: ''
        },
        tradeLink: {
            type: GraphQLString,
            description: ''
        },
        balance: {
            type: new GraphQLNonNull(GraphQLInt),
            description: ''
        },
        isAdmin: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: ''
        },
        isModerator: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: ''
        },
        isDeveloper: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: ''
        },
        isBanned: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: ''
        },
        isBannedChat: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: ''
        },
        bets: {
            type: new GraphQLNonNull(new GraphQLList(BetType)),
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


export const UserFilter = new GraphQLInputObjectType({
    name: 'UserFilter',
    description: '',
    fields: () => ({
        OR: {
            type: UserFilter,
            description: ''
        },
        usernameContains: {
            type: GraphQLString,
            description: ''
        },
        isAdmin: {
            type: GraphQLBoolean,
            description: ''
        }
    })
});