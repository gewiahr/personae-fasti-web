import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css';
import './styles/telegram.css'
import App from './App.tsx'
import { init, miniApp, swipeBehavior, viewport } from '@tma.js/sdk-react';
import { Provider } from 'react-redux';
import store from './store.ts';

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
    <Provider store={store}>
      <App />
    </Provider> 
  </StrictMode>,
)
