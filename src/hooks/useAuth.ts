import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { api } from '../utils/api';
import { GameFullInfo, LoginInfo, PlayerInfo } from '../types/request';
import { AuthStorage } from '../types/utils';

export const useAuth = () => {
  const [ auth, setAuth ] = useLocalStorage<AuthStorage | null>('auth', null);
  const [_, setPlayerInfo] = useLocalStorage<PlayerInfo | null>('playerInfo', null);
  const [__, setCurrentGame] = useLocalStorage<GameFullInfo | null>('currentGame', null);

  const [ isAuthenticated, setIsAuthenticated ] = useState(!!auth?.accesskey);
  const [ attempts, setAttemptCounter ] = useState<number>(0);

  const login = async (accesskey: string) => {
    const { data, error } = await api.get<LoginInfo>(`/login/${accesskey}`, "");

    if (!error && data) {
      setAuth({ accesskey: data.accesskey });
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
    const { data, error } = await api.post<LoginInfo>(`/login/tg`, "", { loginData: initData });

    if (!error && data) {
      setAuth({ accesskey: data.accesskey });
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
            login,
            loginTG, 
            logout, 
            accessKey: auth?.accesskey || "", 
            attempts };
};