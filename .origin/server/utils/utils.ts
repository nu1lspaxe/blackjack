import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => {
  return uuidv4();
};

export const generateTableCode = (): string => {
  const tableCode = Math.floor(Math.random() * 900000) + 100000; 
  return tableCode.toString();
}

export const ERROR = {
  INVALID_VALUE: 'Invalid value',
  UNDEFINED_CARD: 'Undefined card',
  INVALID_ROOM: 'Room not found',
  ROOM_FULL: 'Room is full',
}