
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-white border-t p-2 text-center text-xs text-gray-500">
      <p>
        Created by <a href="https://jayreddin.github.io/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Jamie Reddin</a> | Powered by <a href="https://puter.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Puter.com</a>
      </p>
    </footer>
  );
};

export default Footer;
