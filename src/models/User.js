import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    },
    steamId: {
        type: String,
        required: true,
        unique: true,
        default: null
    },
    steamId64: {
        type: String,
        required: true,
        unique: true,
        default: null
    },
    tradeLink: {
        type: String,
        default: null
    },
    balance: {
        type: Number,
        default: 0,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isModerator: {
        type: Boolean,
        default: false
    },
    isDeveloper: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isBannedChat: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
        collection: 'users',
    });

/**
 * Statics
 */
UserSchema.statics = {
    /**
     * loginUser
     * 
     * @param {Object} query - Query used to find existing user.
     * @param {Object} user - Contains user information.
     * @returns {Promise<User, APIError>}
     */
    loginUser(args, user) {
        return this.findOneAndUpdate(args, user, { new: true })
            .then(userFound => {
                return userFound ? userFound : this.create(user)
            })
            .catch(err => err)
    },
    /**
     * findUser
     * 
     * @param {Object} query - Query used to find existing user.
     * @returns {Promise<User, APIError>}
     */
    findUser(args) {
        return this.findOne(args)
            .then(user => { return user })
            .catch(err => err)
    },
    newGame(game) {
        return this.create(game);
    }
}

export const User = mongoose.model('User', UserSchema);