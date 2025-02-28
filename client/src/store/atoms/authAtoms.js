import { atom } from 'recoil';

// Declares an atom to manage the user's email state
export const userEmailState = atom({
  key: 'userEmailState',
  default: ''
});

// Declares an atom to manage the user's admin status
export const isAdminState = atom({
  key: 'isAdminState',
  default: false
});

// Declares an atom to manage the user's ID state
export const userIdState = atom({
  key: 'userIdState',
  default: null
});

// Declares an atom to manage the user's name state
export const userNameState = atom({
  key: 'userNameState',
  default: ''
});