import BigNumber from 'bignumber.js';
import { GraphQLClient, request } from 'graphql-request';
import config from '../config';
import winston from 'winston';

let roulette = {};

roulette.numbers = {
    red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
    black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
};

export const BET_TYPES = {
    STRAIGHT: {
        value: 0,
        possibleValues: roulette.numbers.red.concat(roulette.numbers.black).concat([0]).map(item => item.toString()),
        multiplier: 36,
        validator: (guess, number) => { return guess == number }
    },
    COLOR: {
        value: 1,
        possibleValues: ['red', 'black'],
        multiplier: 2,
        validator: (guess, number) => { return guess == getColor(number) }
    },
    PARITY: {
        value: 2,
        possibleValues: ['even', 'odd'],
        multiplier: 2,
        validator: (guess, number) => { return guess == getParity(number) }
    },
    COLUMN: {
        value: 3,
        possibleValues: ['first', 'second', 'third'],
        multiplier: 3,
        validator: (guess, number) => { return guess == getColumn(number) }
    },
    DOZEN: {
        value: 4,
        possibleValues: ['first', 'second', 'third'],
        multiplier: 3,
        validator: (guess, number) => { return guess == getDozen(number) }
    },
    HALF: {
        value: 5,
        possibleValues: ['low', 'high'],
        multiplier: 2,
        validator: (guess, number) => { return guess == getHalf(number) }
    }
}

export function getHalf(number) {
    if (number === 0) return null;

    return BET_TYPES.HALF.values[_.inRange(number, 1, 18 + 1) ? 0 : _.inRange(number, 19, 36 + 1) ? 1 : null];
}

export function getDozen(number) {
    if (number === 0) return null;

    return BET_TYPES.DOZEN.values[_.inRange(number, 1, 12 + 1) ? 0 : _.inRange(number, 13, 24 + 1) ? 1 : _.inRange(number, 25, 36 + 1) ? 2 : null];
}

export function getColumn(number) {
    if (number === 0) return null;

    return BET_TYPES.COLUMN.values[(number - 1) % 3];
}

export function getColor(number) {
    if (number === 0) return null;

    return roulette.numbers.red.includes(number) ? 'red' : 'black';
}

export function getParity(number) {
    if (number === 0) return null;

    return BET_TYPES.PARITY.values[number % 2];
}

const colors = {
    silly: 'pink',
    debug: 'white',
    verbose: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red'
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
}

winston.addColors(colors);

export const logger = winston;

export function fromMongo(item) {
    return {
        ...item,
        id: item._id.toString(),
    };
}

export function toMongo(item) {
    return {
        ...item,
        _id: ObjectID(item.id),
    };
}

export const client = new GraphQLClient(`http://${config.HOST}:${config.PORT}/${config.graphqlPath}`, {
    credentials: 'include',
    mode: 'cors',
    headers: {
        Authorization: 'Bearer my-jwt-token',
    },
})

export function convertToSteamId(steamid64) {
    var w
        , v = new BigNumber('76561197960265728')
        , y = 0
        , sid
        , out = ['STEAM_0']
        , err = null

    try {
        if (!steamid64) {
            throw new ReferenceError('SteamID64 argument required')
        }
        else if (typeof steamid64 !== 'string') {
            throw new TypeError('SteamID must be a string')
        }

        w = new BigNumber(steamid64)
        if (w.mod(2).toPrecision(1) === '1') {
            y = 1
        }
        out.push(y)
        sid = w.minus(y).minus(v).div(2).toPrecision(17)
        sid = parseInt(sid, 10)

        if (sid < 0 || !sid) {
            throw new Error('Invalid SteamID64')
        }
        else {
            out.push(sid)
        }
    }

    catch (e) {
        err = e.message
    }

    finally {
        if (err) {
            throw err
        }
        else {
            return out.join(':')
        }
    }
}