const rooms = {

}

export function addPlayer({ idRoom, playerName }, idPlayer) {
  if (!rooms[idRoom]) rooms[idRoom] = generateRoom();
  forwardPlayer(idRoom, playerName, idPlayer);
  bootStatus(idRoom);
}


function forwardPlayer(idRoom, playerName, idPlayer) {
  for (let i = 1; i <= 4; i++) {
    const room = rooms[idRoom];

    if (!room[`player${i}`].gameStatus) {
      room[`player${i}`].gameStatus = 'wait';
      room[`player${i}`].playerName = playerName;
      room[`player${i}`].IdPlayer = idPlayer;
      break;
    }
  }
}

function bootStatus(idRoom) {
  let onlineCount = 0;
  const room = rooms[idRoom];

  for (let i = 1; i <= 4; i++) {
    if (room[`player${i}`].gameStatus) onlineCount++;
  }

  if (onlineCount == 4) {
    room.player1.gameStatus = 'playing';
    room.player3.gameStatus = 'playing';
    room.gameStatusGenerally = 'inGame'
  }
}

function generateRoom() {

  return {
    player1: {
      gameStatus: null,
      playerName: null,
      IdPlayer: null,
      game: 'player1',
      lastNumber: 0,
      currentPosition: 1
    },
    player2: {
      gameStatus: null,
      playerName: null,
      IdPlayer: null,
      game: 'player2',
      lastNumber: 0,
      currentPosition: 1
    },
    player3: {
      gameStatus: null,
      playerName: null,
      IdPlayer: null,
      game: 'player3',
      lastNumber: 0,
      currentPosition: 1
    },
    player4: {
      gameStatus: null,
      playerName: null,
      IdPlayer: null,
      game: 'player4',
      lastNumber: 0,
      currentPosition: 1
    },
    resources: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
    },
    resourcesTeam1: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    },
    resourcesTeam2: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    },
    gameStatusGenerally: 'offline'
  }
}

export function getGameStatus(idRoom) {
  const room = rooms[idRoom];
  return {
    players: {
      player1: {
        gameStatus: room.player1.gameStatus,
        playerName: room.player1.playerName,
        game: room.player1.game,
      },
      player2: {
        gameStatus: room.player2.gameStatus,
        playerName: room.player2.playerName,
        game: room.player2.game,
      },
      player3: {
        gameStatus: room.player3.gameStatus,
        playerName: room.player3.playerName,
        game: room.player3.game,
      },
      player4: {
        gameStatus: room.player4.gameStatus,
        playerName: room.player4.playerName,
        game: room.player4.game,
      }
    },
    resources: room.resources,
    resourcesTeam1: room.resourcesTeam1,
    resourcesTeam2: room.resourcesTeam2,
    gameStatusGenerally: room.gameStatusGenerally
  }
}