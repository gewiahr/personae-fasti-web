import { useEffect, type ReactNode } from 'react';
import useTelegram from '../hooks/useTelegram';
import AuthGateNoGame from './AuthGateNoGame';
import { useAppDispatch, useAppSelector } from '../store';
import { loginTG, loginToken, selectAuthorization, selectPlayerExt, selectPlayerLoading, setPlayerLoading } from '../reducers/PlayerSlice';
import { selectCurrentGameInfo, selectCurrentGameLoading } from '../reducers/CurrentGameSlice';
import LoadingLabel from '../components/lib/LoadingLabel';
import LoginComponent from './LoginComponent';
import useOnlineStatus from '../hooks/useOnlineStatus';

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { TMA, initDataRaw } = useTelegram();

  const dispatch = useAppDispatch();

  const playerExt = useAppSelector(selectPlayerExt);
  const auth = useAppSelector(selectAuthorization);
  const currentGame = useAppSelector(selectCurrentGameInfo);
  const isAuthenticated = !!playerExt;
  const playerIsLoading = useAppSelector(selectPlayerLoading);
  const gameIsLoading = useAppSelector(selectCurrentGameLoading);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline || isAuthenticated) return;

    if (TMA) {
      dispatch(loginTG({ rawData: initDataRaw })).unwrap().catch(() => undefined);
    } else if (auth) {
      dispatch(loginToken({ token: auth })).unwrap().catch(() => undefined);
    } else {
      dispatch(setPlayerLoading(false));
    }
  }, [auth, dispatch, initDataRaw, isAuthenticated, isOnline, TMA]);

  if (!isOnline && !isAuthenticated) return (
    <div className="auth-gate-page gap-4 text-center">
      <img className="size-24" src="/icons/pwa-192.png" alt="StoryShard" />
      <p className="text-2xl">Нет подключения</p>
      <p className="text-(--color-text-gray)">Для загрузки игровых данных требуется интернет</p>
    </div>
  );

  if (playerIsLoading) return (  
    <div className="auth-gate-page">
      <LoadingLabel />
    </div>
  );

  if (!isAuthenticated) return (
    <LoginComponent />
  );

  if (gameIsLoading) return (
    <div className="auth-gate-page">
      <LoadingLabel />
    </div>
  );

  if (currentGame == null) return (
    <AuthGateNoGame />
  );

  return <>{children}</>;
};

