import { randomUUID } from 'crypto';

export const generateUUID = () => {
  return randomUUID();
};

export const generateTableCode = (): string => {
  const tableCode = Math.floor(Math.random() * 900000) + 100000; 
  return tableCode.toString();
}

export const ERROR = {
  INVALID_VALUE: 'Out of range value',

  UNDEFINED_CARD: 'Undefined card',

  INVALID_TABLE: 'Table is not found',
  TABLE_FULL: 'Table is full',

  NOT_READY: 'Players are not ready',
  INVALID_PLAYER: 'Player is not found',
}