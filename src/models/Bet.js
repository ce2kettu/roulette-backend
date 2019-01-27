import mongoose from 'mongoose';
import { BET_TYPES } from '../utils';

const BetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    /*     type: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        }, */
    type: {
        type: String,
        enum: Object.keys(BET_TYPES),
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    value: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                console.log(this.type, value)
                return BET_TYPES[this.type].possibleValues.indexOf(value) > -1
            },
            message: 'Invalid bet value'
        }
    },
    status: {
        type: Number,
        default: 0,
        min: 0,
        max: 2
    }
},
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
        collection: 'bets',
    });

/* BetSchema
    .pre('save', next => {
        console.log(this.type);
        return next();
    }); */

BetSchema.statics = {

}

export const Bet = mongoose.model('Bet', BetSchema);