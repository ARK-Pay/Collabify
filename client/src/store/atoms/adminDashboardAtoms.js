import { atom } from 'recoil';

// Method declaration for creating a Recoil atom to manage sidebar selection state
export const sidebarSelection = atom({
  key: 'sidebarSelection',
  default: ''
});