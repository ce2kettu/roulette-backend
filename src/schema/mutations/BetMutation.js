import { GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { BetType } from '../types';

export const BetMutation = {
    createBet: {
        type: BetType,
        description: '',
        args: {

        },
        resolve: async (root, { args }, { mongo: { Users } }) => {

        }
    }
}