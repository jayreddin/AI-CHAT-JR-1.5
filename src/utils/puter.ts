
import { Puter } from '@/types/puter';

// This is just a helper to make TypeScript happy with the global puter object
// that is loaded by the script in index.html
declare global {
  interface Window {
    puter: Puter;
  }
}

export const initPuter = () => {
  console.log('Initializing Puter connection');
  
  // Check if puter is available
  if (window.puter) {
    console.log('Puter is available');
    return true;
  }
  
  console.log('Puter is not available');
  return false;
};
