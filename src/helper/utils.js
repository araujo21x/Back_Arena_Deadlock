export function generateRoomId() {
  return Math.random().toString(36).substring(7);
}

export function playDice() {
  return Math.floor(Math.random() * 6) + 1;
}