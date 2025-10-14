import { useEffect } from 'react';

const JivoChat = () => {
  useEffect(() => {
    const jivoId = import.meta.env.VITE_JIVO_WIDGET_ID;
    
    if (!jivoId) {
      console.warn('JivoSite widget ID not configured');
      return;
    }

    const script = document.createElement('script');
    script.src = `//code.jivo.ru/widget/${jivoId}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="code.jivo.ru"]`);
      if (existingScript) {
        existingScript.remove();
      }
      
      const jivoContainer = document.querySelector('jdiv');
      if (jivoContainer) {
        jivoContainer.remove();
      }
    };
  }, []);

  return null;
};

export default JivoChat;
