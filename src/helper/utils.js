export function generateRoomId() {
  const idRoom = Math.random().toString(36).substring(7);
  return idRoom;
}