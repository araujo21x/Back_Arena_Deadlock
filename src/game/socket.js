import { generateRoomId } from '../helper/utils.js';
import { addPlayer , getGameStatus} from './db.js';

export default function (io) {
  io.on('connection', (socket) => {
    socket.on('enterRoom', (sent) => {
      socket.join(sent.idRoom);
      addPlayer(sent, socket.id);
      io.to(sent.idRoom).emit('enterRoom', getGameStatus(sent.idRoom)); 
      socket.emit('enterRoom', {
        playerName: sent.playerName,
        IdPlayer: socket.id
      });     
    });
  });

}