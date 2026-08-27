import { useEffect, type ReactNode } from 'react';
import useTelegram from '../hooks/useTelegram';
import AuthGateNoGame from './AuthGateNoGame';
import { useAppDispatch, useAppSelector } from '../store';
import { loginTG, loginToken, selectAuthorization, selectPlayerExt, selectPlayerLoading, setPlayerLoading } from '../reducers/PlayerSlice';
import { selectCurrentGameInfo, selectCurrentGameLoading } from '../reducers/CurrentGameSlice';
import LoadingLabel from '../components/lib/LoadingLabel';
import LoginComponent from './LoginComponent';

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { TMA, initDataRaw } = useTelegram();

  const dispatch = useAppDispatch();

  const playerExt = useAppSelector(selectPlayerExt);
  const auth = useAppSelector(selectAuthorization);
  const currentGame = useAppSelector(selectCurrentGameInfo);
  const isAuthenticated = !!playerExt;
  const playerIsLoading = useAppSelector(selectPlayerLoading);
  const gameIsLoading = useAppSelector(selectCurrentGameLoading);

  useEffect(() => {
    if (!isAuthenticated) {
      if (TMA) {
        dispatch(loginTG({ rawData: initDataRaw })).unwrap();
      } else if (auth) { 
        dispatch(loginToken({ token: auth }));
      } else { 
        dispatch(setPlayerLoading(false));
      }
    }
  }, []);

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

