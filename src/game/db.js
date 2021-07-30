const rooms = {}

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
    gameStatusGenerally: 'offline',
    diceValueTeam1: 0,
    diceValueTeam2: 0
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
        currentPosition: room.player1.currentPosition,
      },
      player2: {
        gameStatus: room.player2.gameStatus,
        playerName: room.player2.playerName,
        game: room.player2.game,
        currentPosition: room.player2.currentPosition,
      },
      player3: {
        gameStatus: room.player3.gameStatus,
        playerName: room.player3.playerName,
        game: room.player3.game,
        currentPosition: room.player3.currentPosition,
      },
      player4: {
        gameStatus: room.player4.gameStatus,
        playerName: room.player4.playerName,
        game: room.player4.game,
        currentPosition: room.player4.currentPosition,
      }
    },
    resources: room.resources,
    resourcesTeam1: room.resourcesTeam1,
    resourcesTeam2: room.resourcesTeam2,
    gameStatusGenerally: room.gameStatusGenerally,
    diceValueTeam1: room.diceValueTeam1,
    diceValueTeam2: room.diceValueTeam2,
  }
}

export function checkPlayer({ idPlayer, idRoom, game }, diceValue) {
  const room = rooms[idRoom];
  if (room[game].idPlayer === idPlayer && room[game].gameStatus === 'playing') {
    room[game].lastNumber = diceValue;
    room[game].gameStatus = 'itPlayed';
    setDiceTeam(idRoom, game, diceValue);
    checkIfPairPlayed(idRoom, game);
  } else {
    throw new Error(`Não é a vez do jogador(a):${room[game].playerName}`);
  }
}

function checkIfPairPlayed(idRoom, game) {
  const room = rooms[idRoom];
  if (game === 'player1' || game === 'player3') {
    if (room['player1'].gameStatus === 'itPlayed' && room['player3'].gameStatus === 'itPlayed') {
      if (criticalZoneCheck(idRoom, 'player1', 'player3')) {
        compareResults('player1', 'player3', idRoom)
      } else {
        tradeStatusPlayer('player1', 'player3', idRoom);
        throw new Error(`Existe um jogador na zona crítica!`);
      }
    }
  } else {
    if (room['player2'].gameStatus === 'itPlayed' && room['player4'].gameStatus === 'itPlayed') {
      if (criticalZoneCheck(idRoom, 'player2', 'player4')) {
        compareResults('player2', 'player4', idRoom)
      } else {
        tradeStatusPlayer('player2', 'player4', idRoom);
        throw new Error(`Existe um jogador na zona crítica!`);
      }
    }
  }
}

function criticalZoneCheck(idRoom, playerTeam1, playerTeam2) {
  const room = rooms[idRoom];
  let criticalZonePlayer = null;

  for (let i = 1; i <= 4; i++) {
    const playerPosition = room[`player${i}`].currentPosition
    if (playerPosition === 11 || playerPosition === 12) {
      criticalZonePlayer = room[`player${i}`];
    }
  }

  if (!criticalZonePlayer) {
    return true
  } else {
    if (criticalZonePlayer.game === playerTeam1 || criticalZonePlayer.game === playerTeam2) {
      const currentPosition = currentPositionZoneCritic(criticalZonePlayer, idRoom);
      if (currentPosition > 12) {
        return true;
      } else {
        playerGreaterThan12(idRoom, playerTeam1, playerTeam2)
        return false;
      }
    } else {
      playerGreaterThan12(idRoom, playerTeam1, playerTeam2)
      return false;
    }
  }
}

function currentPositionZoneCritic(criticalZonePlayer, idRoom) {
  const room = rooms[idRoom];
  let currentPosition = 0;
  if (criticalZonePlayer.game === 'player1' || criticalZonePlayer.game === 'player2') {
    const lastNum = criticalZonePlayer.lastNumber;
    if (room.resources[lastNum] || room.resourcesTeam1[lastNum]) {
      currentPosition = criticalZonePlayer.currentPosition + criticalZonePlayer.lastNumber;
    } else {
      currentPosition = criticalZonePlayer.currentPosition;
    }
  } else {
    const lastNum = criticalZonePlayer.lastNumber;
    if (room.resources[lastNum] || room.resourcesTeam2[lastNum]) {
      currentPosition = criticalZonePlayer.currentPosition + criticalZonePlayer.lastNumber;
    } else {
      currentPosition = criticalZonePlayer.currentPosition;
    }
  }

  return currentPosition;
}

function playerGreaterThan12(idRoom, playerTeam1, playerTeam2) {
  const room = rooms[idRoom];
  let error = false;

  if (room[playerTeam1].lastNumber === room[playerTeam2].lastNumber) {

    if (room.resources[room[playerTeam1].lastNumber]) {
      resetResources(idRoom);
      resetPosition(playerTeam1, playerTeam2, idRoom);
      error = true
    } else {

      if (room.resourcesTeam1[room[playerTeam1].lastNumber]) {
        if (room[playerTeam1].currentPosition > 12) {
          room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
        }
      }

      if (room.resourcesTeam2[room[playerTeam2].lastNumber]) {
        if (room[playerTeam2].currentPosition > 12) {
          room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
        }
      }

    }

  } else {
    if (room.resourcesTeam1[room[playerTeam2].lastNumber]
      && room.resourcesTeam2[room[playerTeam1].lastNumber]) {
      resetResources(idRoom);
      resetPosition(playerTeam1, playerTeam2, idRoom);
      error = true
    } else {
      if (room[playerTeam1].currentPosition > 12) {
        if (room.resources[room[playerTeam1].lastNumber]) {
          room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
          room.resources[room[playerTeam1].lastNumber] = false;
          room.resourcesTeam1[room[playerTeam1].lastNumber] = true;
        } else if (room.resourcesTeam1[room[playerTeam1].lastNumber]) {
          room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
        }
      }
      if (room[playerTeam2].currentPosition > 12) {
        if (room.resources[room[playerTeam2].lastNumber]) {
          room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
          room.resources[room[playerTeam2].lastNumber] = false;
          room.resourcesTeam2[room[playerTeam2].lastNumber] = true;
        } else if (room.resourcesTeam2[room[playerTeam2].lastNumber]) {
          room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
        }
      }
    }

  }
  tradeStatusPlayer(playerTeam1, playerTeam2, idRoom);
  if (error) throw new Error('Deadlock!');
}

function compareResults(playerTeam1, playerTeam2, idRoom) {
  const room = rooms[idRoom];
  let error = false;
  if (room[playerTeam1].lastNumber === room[playerTeam2].lastNumber) {

    if (room.resources[room[playerTeam1].lastNumber]) {
      resetResources(idRoom);
      resetPosition(playerTeam1, playerTeam2, idRoom);
      error = true
    } else {

      if (room.resourcesTeam1[room[playerTeam1].lastNumber]) {
        room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
      }

      if (room.resourcesTeam2[room[playerTeam2].lastNumber]) {
        room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
      }

    }

  } else {
    if (room.resourcesTeam1[room[playerTeam2].lastNumber]
      && room.resourcesTeam2[room[playerTeam1].lastNumber]) {
      resetResources(idRoom);
      resetPosition(playerTeam1, playerTeam2, idRoom);
      error = true
    } else {
      if (room.resources[room[playerTeam1].lastNumber]) {
        room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
        room.resources[room[playerTeam1].lastNumber] = false;
        room.resourcesTeam1[room[playerTeam1].lastNumber] = true;
      } else if (room.resourcesTeam1[room[playerTeam1].lastNumber]) {
        room[playerTeam1].currentPosition = room[playerTeam1].currentPosition + room[playerTeam1].lastNumber;
      }

      if (room.resources[room[playerTeam2].lastNumber]) {
        room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
        room.resources[room[playerTeam2].lastNumber] = false;
        room.resourcesTeam2[room[playerTeam2].lastNumber] = true;
      } else if (room.resourcesTeam2[room[playerTeam2].lastNumber]) {
        room[playerTeam2].currentPosition = room[playerTeam2].currentPosition + room[playerTeam2].lastNumber;
      }
    }


  }
  tradeStatusPlayer(playerTeam1, playerTeam2, idRoom);
  if (error) throw new Error('Deadlock!');
}

function tradeStatusPlayer(playerTeam1, playerTeam2, idRoom) {
  const room = rooms[idRoom];
  if (playerTeam1 === 'player1' && playerTeam2 === 'player3') {
    room['player1'].gameStatus = 'wait';
    room['player2'].gameStatus = 'playing';
    room['player3'].gameStatus = 'wait';
    room['player4'].gameStatus = 'playing';
  } else {
    room['player1'].gameStatus = 'playing';
    room['player2'].gameStatus = 'wait';
    room['player3'].gameStatus = 'playing';
    room['player4'].gameStatus = 'wait';
  }
}

function resetResources(idRoom) {
  const room = rooms[idRoom];
  for (let i = 1; i <= 6; i++) {
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

function setDiceTeam(idRoom, game, diceValue) {
  if (game === 'player1' || game === 'player2') {
    rooms[idRoom].diceValueTeam1 = diceValue;
  } else {
    rooms[idRoom].diceValueTeam2 = diceValue;
  }
}

export function getPlayerPosition(idPlayer, idRoom) {
  for (let i = 1; i <= 4; i++) {
    const room = rooms[idRoom];

    if (room[`player${i}`].idPlayer === idPlayer) {
      return room[`player${i}`].game;
    }
  }
}

export function verifyWinner(idRoom) {
  const room = rooms[idRoom];
  let answer = false;

  for (let i = 1; i <= 4; i++) {
    const playerWinner = room[`player${i}`].currentPosition >= 25;
    if (playerWinner) {
      const teamWinner = room[`player${i}`].currentPosition === 'player1' ||
        room[`player${i}`].currentPosition === 'player2' ? 'equipe 1' : 'equipe 2';

      answer = {
        teamWinner,
        playerWinner: room[`player${i}`].playerName
      }
      break;
    }
  }
  return answer;
}

export function restartGame(idRoom) {
  let room = rooms[idRoom];
  const resetRoom = {
    player1: {
      gameStatus: 'playing',
      playerName: room.player1.playerName,
      idPlayer: room.player1.idPlayer,
      game: 'player1',
      lastNumber: 0,
      currentPosition: 1
    },
    player2: {
      gameStatus: 'wait',
      playerName: room.player2.playerName,
      idPlayer: room.player2.idPlayer,
      game: 'player2',
      lastNumber: 0,
      currentPosition: 1
    },
    player3: {
      gameStatus: 'playing',
      playerName: room.player3.playerName,
      idPlayer: room.player3.idPlayer,
      game: 'player3',
      lastNumber: 0,
      currentPosition: 1
    },
    player4: {
      gameStatus: 'wait',
      playerName: room.player4.playerName,
      idPlayer: room.player4.idPlayer,
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
    gameStatusGenerally: 'inGame',
    diceValueTeam1: 0,
    diceValueTeam2: 0
  }
  room = resetRoom;
}