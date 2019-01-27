import { GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { RouletteType } from '../types';

export const RouletteMutation = {
    createRoulette: {
        type: RouletteType,
        description: '',
        args: {

        },
        resolve: async (root, { args }, { mongo: { Users } }) => {

        }
    }
}