export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
  },
  SERVICES: {
    LIST: '/services',
    CREATE: '/services',
    UPDATE: '/services',
    DELETE: '/services',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
  },
  MESSAGES: {
    LIST: '/messages',
    SEND: '/messages',
    CONVERSATIONS: '/messages/conversations',
  },
};

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
} as const;

export const SERVICE_TYPES = {
  OFFER: 'offer',
  REQUEST: 'request',
} as const;