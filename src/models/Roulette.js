import mongoose from 'mongoose';

const RouletteSchema = new mongoose.Schema({
    winningNumber: {
        type: Number,
        default: null,
        min: 0,
        max: 36
    },
    stake: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
        collection: 'roulettes',
    });

RouletteSchema.statics = {
    newGame(game) {
        return this.create(game);
    }
}

export const Roulette = mongoose.model('Roulette', RouletteSchema);