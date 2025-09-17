import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { api } from '../utils/api';
import { LoginInfo } from '../types/request';

export const useAuth = () => {
  const [ loginInfo, setLoginInfo ] = useLocalStorage<LoginInfo | null>('playerInfo', null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(!!loginInfo?.accesskey);
  const [ attempts, setAttemptCounter ] = useState<number>(0);

  const login = async (accesskey: string) => {
    const { data, error } = await api.get<LoginInfo>(`/login/${accesskey}`, "");

    if (!error && data) {
      setLoginInfo(data);
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
      setLoginInfo(data);
      setIsAuthenticated(true);
      setAttemptCounter(0);
      return true;
    };
  };

  const logout = () => {
    setLoginInfo(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return {  isAuthenticated, 
            login,
            loginTG, 
            logout, 
            accessKey: 
            loginInfo?.accesskey || "", 
            player: loginInfo?.player || { id: 0, username: "" }, 
            game: loginInfo?.currentGame || { id: 0, title: "", gmID: 0 }, 
            attempts };
};