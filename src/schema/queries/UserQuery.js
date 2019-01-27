import { GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { UserType, UserFilter } from '../types';
import { fromMongo } from '../../utils';
import { User, Bet } from '../../models';

function userFilter({ OR = [], usernameContains, isAdmin }) {
    const filter = (usernameContains || isAdmin) ? {} : null;
    if (usernameContains) {
        filter.username = { $regex: `.*${usernameContains}.*` };
    }
    if (isAdmin) {
        filter.isAdmin = { $regex: `.*${isAdmin}.*` };
    }

    let filters = filter ? [filter] : [];
    for (let i = 0; i < OR.length; i++) {
        filters = filters.concat(userFilter(OR[i]));
    }
    return filters;
}

export const UserQuery = {
    user: {
        type: UserType,
        description: '',
        args: {
            steamId64: {
                type: GraphQLString,
                description: ''
            }
        },
        resolve: async (root, { steamId64 }) => {
            if (steamId64) {
                const user = await User.findOne({ steamId64: steamId64 });
                if (user) {
                    const bets = await Bet.find({ userId: user._id });
                    user.bets = bets || [];
                    return fromMongo(user);
                } else {
                    return 'not found';
                }
            } else {
                throw Error('No field provided')
            }
        }
    },
    users: {
        type: new GraphQLList(UserType),
        description: '',
        args: {
            filter: {
                type: UserFilter,
                description: ''
            },
            first: {
                type: GraphQLInt,
                description: ''
            },
            skip: {
                type: GraphQLInt,
                description: ''
            }
        },
        resolve: async (root, { filter, first, skip }, { mongo: { Users } }) => {
            const query = filter ? { $or: buildFilters(filter) } : {};
            const cursor = Links.find(query)
            if (first) {
                cursor.limit(first);
            }
            if (skip) {
                cursor.skip(skip);
            }
            return cursor.toArray();
        }
    }
}