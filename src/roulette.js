/* import _ from 'lodash';
import config from './config';
import io from 'socket.io';

const server = new io(server, {path: '/api/chat'}); */


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
import { client } from './utils';
import _ from 'lodash';
import { Roulette, Bet, User } from './models';
import mongoose from 'mongoose';
import database from './database';
import { logger, BET_TYPES, getHalf, getDozen, getColumn, getColor, getParity } from './utils';

mongoose.Promise = Promise;

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(PORT, function () {
    console.log('listening on *:' + PORT);
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});

function newGame() {
    logger.info('Creating a new game...');
    Roulette.create({})
        .then(game => startTimer())
        .catch(err => logger.error(err))
}

setTimeout(getCurrentGame, 1000);

function getCurrentGame() {
    Roulette.findOne({}).sort({ createdAt: -1 }).exec()
        .then(game => {
            if (game) {
                logger.info('Previous game: ' + game._id);
                if (game.status != 0) {
                    newGame();
                }
            } else {
                newGame();
            }
        })
        .catch(err => logger.error(err))
}

var timer,
    timerStatus = false,
    wheelStatus = false,
    timerTime = 30,
    wheelTime = 20;

function startTimer() {
    let time = timerTime;
    timerStatus = true;
    clearInterval(timer);
    console.log('STARTING GAME');
    Roulette.findOne().sort({ createdAt: -1 }).exec()
        .then(game => {
            Bet.create({ userId: '5999aad55f9f1a02a40115ab', gameId: game._id, type: 'COLOR', amount: 42, value: 'black' })
                .catch(err => logger.error(err))
        })
        .catch(err => logger.error(err))
    timer = setInterval(() => {
        io.emit('timer', time--);
        if (time <= 0) {
            clearInterval(timer);
            timerStatus = false;
            console.log('GAME ENDED');
            drawGame();
        }
    }, 1000);
}

function drawGame() {
    logger.info('Drawing game...');
    Roulette.findOne().sort({ createdAt: -1 }).exec()
        .then(game => {
            Bet.find({ gameId: game._id }).exec()
                .then(bets => {
                    if (bets.length > 0) {
                        const number = Math.floor(Math.random() * 36);
                        payOut(number, game._id);
                        Roulette.findOneAndUpdate({ _id: game._id }, { status: 1, winningNumber: number }, { new: true }).exec()
                            .then(game => {
                                logger.info('GAME CLOSED');
                                getCurrentGame();
                            })
                            .catch(err => logger.error(err))
                    } else {
                        Roulette.findOneAndUpdate({ _id: game._id }, { status: 2 }, { new: true }).exec()
                            .then(game => {
                                logger.info('GAME CANCELLED');
                                getCurrentGame();
                            })
                            .catch(err => logger.error(err))
                    }
                })
                .catch(err => logger.error(err))
        })
        .catch(err => logger.error(err))
}

let count = 0;

function payOut(number, gameId) {
    Bet.find({ gameId: gameId }).exec()
        .then(bets => {
            bets.forEach(bet => {
                count = 0;
                Object.keys(BET_TYPES).forEach((type, index, array) => {
                    checkBet(BET_TYPES[type], bet, number);
                    if (index === array.length - 1 && count === array.length) {
                        Bet.findOneAndUpdate({ _id: bet._id }, { status: 2 }, { new: true }).exec()
                            .catch(err => logger.error(err))
                    }
                });
            });
        })
        .catch(err => logger.error(err))
}


function checkBet(type, bet, number) {
    if (type.value == bet.type && type.validator(bet.value, number)) {
        Bet.findOneAndUpdate({ _id: bet._id }, { status: 1 }, { new: true }).exec()
            .then(bet => {
                const winAmount = bet.amount * type.multiplier;
                User.findOneAndUpdate({ _id: bet.userId }, { $inc: { balance: winAmount } }, { new: true }).exec()
                    .catch(err => logger.error(err))
            })
            .catch(err => logger.error(err))
    } else {
        count++;
    }
}
