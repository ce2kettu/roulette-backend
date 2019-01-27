import { GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { BetType } from '../types';

export const BetQuery = {
    bet: {
        type: BetType,
        description: '',
        args: {
            id: {
                type: GraphQLID,
                description: ''
            },
            username: {
                type: GraphQLString,
                description: ''
            },
            steamId: {
                type: GraphQLString,
                description: ''
            },
            steamId64: {
                type: GraphQLString,
                description: ''
            }
        },
        resolve: async (root, { args }, { mongo: { Users } }) => {
            console.log(args);
            if (args.id || args.username || args.steamId || args.steamId64) {
                return await Users.find({ _id: args.id });
            } else if (!root.user) {
                throw Error('')
            }
        }
    },
    bets: {
        type: new GraphQLList(BetType),
        description: '',
        args: {
/*             filter: {
                type: UserSort,
                description: ''
            }, */
            skip: {
                type: GraphQLInt,
                description: ''
            },
            first: {
                type: GraphQLInt,
                description: ''
            },
            limit: {
                type: GraphQLInt,
                description: ''
            }
        }
    }
}