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
      room[`player${i}`].idPlayer = idPlayer;
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
      idPlayer: null,
      game: 'player1',
      lastNumber: 0,
      currentPosition: 1
    },
    player2: {
      gameStatus: null,
      playerName: null,
      idPlayer: null,
      game: 'player2',
      lastNumber: 0,
      currentPosition: 1
    },
    player3: {
      gameStatus: null,
      playerName: null,
      idPlayer: null,
      game: 'player3',
      lastNumber: 0,
      currentPosition: 1
    },
    player4: {
      gameStatus: null,
      playerName: null,
      idPlayer: null,
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

export function checkPlayer({ idPlayer, idRoom, game }, diceValue) {
  const room = rooms[idRoom];
  if (room[game].idPlayer === idPlayer && room[game].gameStatus === 'playing') {
    room[game].lastNumber = diceValue;
    room[game].gameStatus = 'itPlayed';
    checkIfPairPlayed(idRoom, game);
  }

}

function checkIfPairPlayed(idRoom, game) {
  if (game === 'player1' || game === 'player3') {
    const room = rooms[idRoom];
    if (room[player1].gameStatus === 'itPlayed' && room[player3].gameStatus === 'itPlayed') {
      compareResults('player1', 'player3', idRoom)
    }
  } else {
    if (room[player2].gameStatus === 'itPlayed' && room[player4].gameStatus === 'itPlayed') {
      compareResults('player2', 'player4', idRoom)
    }
  }

}

function compareResults(playerTeam1, playerTeam2, idRoom) {
  const room = rooms[idRoom];

  if (room[playerTeam1].lastNumber === room[playerTeam2].lastNumber) {

    if (room.resources[room[playerTeam1].lastNumber]) {
      resetResources(idRoom);
      resetPosition(playerTeam1, playerTeam2, idRoom);
    } else {

      if (room.resourcesTeam1[room[playerTeam1].lastNumber]) {
        room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
      }

      if(room.resourcesTeam2[room[playerTeam2].lastNumber]) {
        room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
      }

    }

  } else {

    if(room.resources[room[playerTeam1].lastNumber]){
      room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
      room.resources[room[playerTeam1].lastNumber] = false;
      room.resourcesTeam1[room[playerTeam1].lastNumber] = true;
    }else if(room.resourcesTeam1[room[playerTeam1].lastNumber]){
      room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
    }

    if(room.resources[room[playerTeam2].lastNumber]){
      room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
      room.resources[room[playerTeam2].lastNumber] = false;
      room.resourcesTeam2[room[playerTeam2].lastNumber] = true;
    }else if(room.resourcesTeam2[room[playerTeam2].lastNumber]){
      room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
    }

  }
  tradeStatusPlayer(playerTeam1, playerTeam2, idRoom);

}

function tradeStatusPlayer(playerTeam1, playerTeam2, idRoom){
  const room = rooms[idRoom];
  if(playerTeam1 === 'player1' && playerTeam2 === 'player3'){
    room['player1'].gameStatus = 'wait';
    room['player2'].gameStatus = 'playing';
    room['player3'].gameStatus = 'wait';
    room['player4'].gameStatus = 'playing';
  }else{
    room['player1'].gameStatus = 'playing';
    room['player2'].gameStatus = 'wait';
    room['player3'].gameStatus = 'playing';
    room['player4'].gameStatus = 'wait';
  }
}

function resetResources(idRoom) {
  const room = rooms[idRoom];
  for (i = 1; i <= 6; i++) {
    room.resources[i] = true;
    room.resourcesTeam1[i] = false;
    room.resourcesTeam2[i] = false;
  }
}

function resetPosition(playerTeam1, playerTeam2, idRoom) {
  const room = rooms[idRoom];
  room[playerTeam1].currentPosition = 1;
  room[playerTeam2].currentPosition = 1;
}

export function getPlayerPosition(idPlayer, idRoom) {
  for (let i = 1; i <= 4; i++) {
    const room = rooms[idRoom];

    if (room[`player${i}`].idPlayer === idPlayer) {
      return room[`player${i}`].game;
    }
  }
}