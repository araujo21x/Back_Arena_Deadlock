import { playDice } from '../helper/utils.js';
import { checkPlayer } from './db.js';

export function toPlay(sent) {
  const diceValue = playDice();
  checkPlayer(sent, diceValue);

}