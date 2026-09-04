import useOnlineStatus from '@/hooks/useOnlineStatus';

const PWAStatus = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-70 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-3 rounded-lg border border-(--color-dimmed) bg-(--color-bg-secondary) text-white p-4 shadow-xl">
      <p className="text-center text-sm">Нет подключения к сети</p>
    </div>
  );
};

export default PWAStatus;
