import io from 'socket.io-client';
import * as types from './mutation-types';

export const initiateGame = ({ commit }) => {
  if (window.battlekardsSocket === undefined) {
    const socket = io();

    socket.on('waitingForAnotherPlayer', () => {
      console.log('waitingForAnotherPlayer');
      commit(types.SET_GAME_STATUS, 'waitingForAnotherPlayer');
    });

    socket.on('gameStarted', (response) => {
      console.log('gameStarted', response);
      commit(types.START_GAME, response);
    });

    socket.on('turnEnded', (response) => {
      console.log('turnEnded', response);
      commit(types.TURN_ENDED, response);
    });

    socket.on('opponentTurnEnded', (response) => {
      console.log('opponentTurnEnded', response);
      commit(types.OPPONENT_TURN_ENDED, response);
    });

    socket.on('summoned', (card) => {
      console.log('summoned', card);
      commit(types.SUMMONED, card);
    });

    socket.on('opponentSummoned', (response) => {
      console.log('opponentSummoned: ', response);
      commit(types.OPPONENT_SUMMONED, response);
    });

    socket.on('attacked', (attackingMonsterId, target, results) => {
      console.log('attacked', attackingMonsterId, target, results);
      commit(types.ATTACKED, { attackingMonsterId, target, results });
    });

    socket.on('opponentAttacked', (attackingMonsterId, target, results) => {
      console.log('opponentAttacked', attackingMonsterId, target, results);
      commit(types.OPPONENT_ATTACKED, { attackingMonsterId, target, results });
    });

    socket.on('win', (message) => {
      console.log('win', message);
      commit(types.SET_GAME_STATUS, 'gameOver');

      // TODO Use modal instead of alert
      alert(`You won! ${message}`); // eslint-disable-line no-alert
    });

    socket.on('lose', (message) => {
      console.log('lose', message);
      commit(types.SET_GAME_STATUS, 'gameOver');

      // TODO Use modal instead of alert
      alert(`You lost! ${message}`); // eslint-disable-line no-alert
    });

    socket.on('invalidMove', (message) => {
      console.warn('invalidMove', message);
    });

    window.battlekardsSocket = socket;
  } else {
    console.warn('Attempted to initiate a second socket');
  }
};

export const terminateGame = () => {
  if (window.battlekardsSocket !== undefined) {
    window.battlekardsSocket.disconnect();
  } else {
    console.warn('Attempted to terminate a connection that has not yet been started');
  }
};
