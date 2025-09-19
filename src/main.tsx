import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css';
import './styles/telegram.css'
import App from './App.tsx'

import { init, miniApp, swipeBehavior, viewport } from '@telegram-apps/sdk-react';

const initializeTelegramSDK = async () => {
  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App готово');
    };
    
    if (swipeBehavior.isVerticalEnabled()) {
      swipeBehavior.mount();
      swipeBehavior.disableVertical();
    };
    
    await viewport.mount();
    if (viewport.bindCssVars.isAvailable()) {
      viewport.bindCssVars();
    };
    
  } catch (error) {
    console.error('Ошибка инициализации:', error);
  };
};

initializeTelegramSDK();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
