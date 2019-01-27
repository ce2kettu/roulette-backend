import { GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { UserType } from '../types';
import { ObjectID } from 'mongodb';
import { fromMongo } from '../../utils';

export const UserMutation = {
    loginUser: {
        type: UserType,
        description: '',
        args: {
            username: {
                type: GraphQLString,
                description: ''
            }
        },
        resolve: async (root, { username }, { mongo: { Users } }) => {
            const newUser = {
                username: username
            }
            const response = await Users.insert(newUser);
            return Object.assign({ id: response.insertedIds[0] }, newUser);
        }
    },
    createUser: {
        type: UserType,
        description: '',
        args: {
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
            }
        },
        resolve: async (root, data, { mongo: { Users } }) => {
            const newUser = {
                _id: new ObjectID(),
                username: data.username,
                avatarUrl: data.username,
                steamId: data.steamId,
                steamId64: data.steamId64,
                tradeLink: null,
                balance: 0,
                isAdmin: false,
                isModerator: false,
                isDeveloper: false,
                isBanned: false,
                isBannedChat: false,
                bets: null,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
            }
            const response = await Users.insert(newUser);
            return fromMongo(newUser);
        }
    },
    updateUser: {
        type: UserType,
        description: '',
        args: {
            id: {
                type: GraphQLString,
                description: ''
            }
        },
        resolve: async (root, data, { mongo: { Users } }) => {
            const updatedUser = {
                avatarUrl: data.username,
                tradeLink: null,
                balance: 0,
                isAdmin: false,
                isModerator: false,
                isDeveloper: false,
                isBanned: false,
                isBannedChat: false,
                bets: null,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
            }
            await Users.findOneAndUpdate({ _id: data.id }, { updatedUser });
        }
    },
    deleteUser: {
        type: UserType,
        description: '',
        args: {
            id: {
                type: GraphQLString,
                description: ''
            }
        },
        resolve: async (root, data, { mongo: { Users } }) => {
            await Users.findOneAndDelete({ _id: data.id });
        }
    }
}