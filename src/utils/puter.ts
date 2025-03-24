
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

export const getPuterEnvironment = (): 'app' | 'web' | 'gui' | 'unknown' => {
  if (window.puter && window.puter.env) {
    return window.puter.env as 'app' | 'web' | 'gui';
  }
  return 'unknown';
};

export const isPuterSignedIn = (): boolean => {
  if (window.puter && window.puter.auth && typeof window.puter.auth.isSignedIn === 'function') {
    return window.puter.auth.isSignedIn();
  }
  return false;
};

export const requiresLogin = (): boolean => {
  const env = getPuterEnvironment();
  // Only require login if we're in 'web' environment
  // In 'app' or 'gui' environments, user should already be authenticated
  return env === 'web' || env === 'unknown';
};
