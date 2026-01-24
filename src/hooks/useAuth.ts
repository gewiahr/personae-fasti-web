import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { api } from '../utils/api';
import type { GameFullInfo, LoginInfo, LoginPlayerInfo } from '../types/request';
import type { AuthStorage } from '../types/utils';

export const useAuth = () => {
  const [ auth, setAuth ] = useLocalStorage<AuthStorage | null>('auth', null);
  const [playerInfo, setPlayerInfo] = useLocalStorage<LoginPlayerInfo | null>('playerInfo', null);
  const [currentGame, setCurrentGame] = useLocalStorage<GameFullInfo | null>('currentGame', null);

  const [ isAuthenticated, setIsAuthenticated ] = useState(!!auth?.authorization);
  const [ attempts, setAttemptCounter ] = useState<number>(0);

  const login = async (authorization: string) => {
    const { data, error } = await api.get<LoginInfo>(`/login/${authorization}`, "");

    if (!error && data) {
      setAuth({ authorization: data.authorization });
      setPlayerInfo(data.player);
      setCurrentGame(data.currentGame);
      setIsAuthenticated(true);
      setAttemptCounter(0);
      return true;
    };

    setAttemptCounter(attempts + 1);
    return false;
  };

  const loginTG = async (initData: string) => {
    const { data, error } = await api.post<LoginInfo>(`/login/tg`, "", { initDataRaw: initData });


    if (!error && data) {
      setAuth({ authorization: data.authorization });
      setPlayerInfo(data.player);
      setCurrentGame(data.currentGame);
      setIsAuthenticated(true);
      setAttemptCounter(0);
      return true;
    };
  };

  const logout = () => {
    setAuth(null);
    setPlayerInfo(null);
    setCurrentGame(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return {  isAuthenticated, 
            currentGame,
            playerInfo,
            login,
            loginTG, 
            logout, 
            authorization: auth?.authorization || "", 
            attempts };
};