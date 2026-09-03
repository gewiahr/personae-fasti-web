import { useEffect, useState } from 'react';
import { LuRefreshCw, LuX } from 'react-icons/lu';
import { useRegisterSW } from 'virtual:pwa-register/react';

import useOnlineStatus from '@/hooks/useOnlineStatus';

const PWAStatus = () => {
  const isOnline = useOnlineStatus();
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW: (_serviceWorkerUrl, serviceWorkerRegistration) => {
      setRegistration(serviceWorkerRegistration);
    },
    onRegisterError: (error) => {
      console.error('Service worker registration failed:', error);
    },
  });

  useEffect(() => {
    if (!registration) return;

    const checkForUpdate = () => registration.update();
    window.addEventListener('focus', checkForUpdate);

    return () => window.removeEventListener('focus', checkForUpdate);
  }, [registration]);

  if (isOnline && !needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-70 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-3 rounded-lg border border-(--color-dimmed) bg-(--color-bg-secondary) p-4 shadow-xl">
      {!isOnline && (
        <p className="text-center text-sm">Нет подключения к сети</p>
      )}

      {needRefresh && (
        <div className="flex items-center gap-3">
          <p className="grow text-sm">Доступно обновление StoryShard</p>
          <button
            type="button"
            className="icon-button-accented flex items-center gap-2"
            onClick={() => updateServiceWorker(true)}
          >
            <LuRefreshCw size={18} />
            <span>Обновить</span>
          </button>
          <button
            type="button"
            className="cursor-pointer text-(--color-text-gray) hover:text-(--color-text-regular)"
            aria-label="Отложить обновление"
            onClick={() => setNeedRefresh(false)}
          >
            <LuX size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PWAStatus;
