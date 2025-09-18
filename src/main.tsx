import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css';
import App from './App.tsx'

import { init, miniApp } from '@telegram-apps/sdk-react';

const initializeTelegramSDK = async () => {
  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App готово');
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
