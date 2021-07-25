import { playDice } from '../helper/utils.js';
import { checkPlayer } from './db.js';

export function toPlay(sent) {
  const diceValue = playDice();
  try{
    checkPlayer(sent, diceValue);
    return false;
  }catch(err){
    return {err:true, msg:err.message};
  }
}