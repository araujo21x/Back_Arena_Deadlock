import { generateRoomId } from '../helper/utils.js';
import { addPlayer, getGameStatus, getPlayerPosition } from './db.js';
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
      toPlay(sent);
      io.to(sent.idRoom).emit('toPlay', getGameStatus(sent.idRoom));
    })
  });

}