import { generateRoomId } from '../helper/utils.js';
import { addPlayer, getGameStatus, getPlayerPosition, verifyWinner, restartGame } from './db.js';
import { toPlay } from './game.js';

export default function (io) {
  io.on('connection', (socket) => {
    socket.on('enterRoom', (sent) => {
      socket.join(sent.idRoom);
      addPlayer(sent, socket.id);
      io.to(sent.idRoom).emit('enterRoomAll', getGameStatus(sent.idRoom));
      socket.emit('enterRoomPersonal', {
        playerName: sent.playerName,
        idPlayer: socket.id,
        game: getPlayerPosition(socket.id, sent.idRoom),
      });
    });

    socket.on('toPlay', (sent) => {
      const answer = toPlay(sent);
      if (answer) {
        io.to(sent.idRoom).emit('err', { ...answer, ...getGameStatus(sent.idRoom) });
      } else {
        // const winner = verifyWinner(sent.idRoom);
        // if (winner) {
        //   restartGame(sent.idRoom);
        //   io.to(sent.idRoom).emit('winner', { ...winner, ...getGameStatus(sent.idRoom) });
        // } else {
        io.to(sent.idRoom).emit('toPlay', getGameStatus(sent.idRoom));
        // }
      }
    })
  });

}