import { useEffect, useState, type ReactNode } from 'react';
import useTelegram from '../hooks/useTelegram';
import AuthGateReg from './AuthGateReg';
import AuthGateNoGame from './AuthGateNoGame';
import { useAppDispatch, useAppSelector } from '../store';
import { loginTG as playerLoginTG, selectPlayerInfo, selectPlayerInfoLoading, setPlayerLoading } from '../reducers/PlayerSlice';
import { selectCurrentGameInfo } from '../reducers/CurrentGameSlice';
import { InputField } from '../components/lib/Inputs/InputField';
import LoadingLabel from '../components/lib/LoadingLabel';
import SubmitButton from '../components/lib/SubmitButton';
//import { api } from './api';
//import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { TMA, initDataRaw } = useTelegram();

  const dispatch = useAppDispatch();

  const playerInfo = useAppSelector(selectPlayerInfo);
  //const auth = useAppSelector(selectAuthorization);
  const currentGame = useAppSelector(selectCurrentGameInfo);
  const isAuthenticated = !!playerInfo;

  //const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoading = useAppSelector(selectPlayerInfoLoading);

  // const [localAuth, setLocalAuth] = useLocalStorage('auth', '');
  // const localAuth = window.localStorage.getItem('auth');
  // const noToken = localAuth == null || localAuth == '';

  const [login, setLogin] = useState<string>('');
  //const [error, setError] = useState<string>('');

  const handleLoginInput = (value: string) => {
    setLogin(value.trim().replace(" ", ""));
  };

  useEffect(() => {
    // if (!isAuthenticated) {
    //   if (noToken) {
    //     if (!TMA) {
    //       try {
    //         dispatch(playerLoginTG({ rawData: initDataRaw })).unwrap();
    //       }
    //       catch (e) {
    //         console.log(e);
    //       }
    //     }
    //   } else {
    //     try {
    //       dispatch(playerLogin({ token: localAuth })).unwrap();
    //     }
    //     catch (e) {
    //       console.log(e);
    //     }
    //   }
    // }

    if (!TMA && !isAuthenticated) {
      dispatch(playerLoginTG({ rawData: initDataRaw })).unwrap();
    } else {
      dispatch(setPlayerLoading(false));
    }

    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        buttonLoginTG();
      }
    };

    window.addEventListener('keydown', handleEnterPress);
    return () => window.removeEventListener('keydown', handleEnterPress);
  }, []);

  const buttonLoginTG = async () => {
    try {
      //await dispatch(playerLoginTG({ rawData: initDataRaw })).unwrap();
      //const response = await api.get(`/login/${login}`, auth);
    } catch (e) {
      console.log(e);
    }
  }

  // const falseAttemptInput = () => {
  //   return Boolean(attempts) && !input;
  // };

  // Web-version is in development
  // if (TMA) return (
  //   <div className="flex flex-col gap-4 p-6 text-center items-center justify-center h-screen bg-gray-800 text-gray-100">
  //     <p>Веб-версия появится совсем скоро!</p>
  //     <p>А пока вы можете воспользоваться версией Telegram Mini App перейдя в бот</p>
  //     <a className='text-blue-500 cursor-pointer' href='https://t.me/personaerpgbot'>@PersonaeRPGbot</a>
  //   </div>
  // );

  if (isLoading) return (
    <div className="auth-gate-page">
      <LoadingLabel />
    </div>
  );

  // AuthGate 
  if (!isAuthenticated) return (
    <>
      <div className="auth-gate-page">
        <h2 className="text-xl font-bold">Приветствую в Personae App!</h2>
        <p className="italic pb-4">
          Это приложение для ведения летописи твоей настольной ролевой игры.
          Оно ещё только тестируется, но ты уже можешь его опробовать.
        </p>
        {/* Всё что нужно это подписаться на мой канал.
          </p>
          <a href='https://t.me/dierolled' className='italic text-center text-blue-300'>Ссылка на мой канал</a>
          <p className="italic">
            На канале я рассказываю о геймдизайне и о других своих интересных проектах.
            А после подписки ты сможешь войти и зарегистрироваться одной кнопкой внизу.
          </p> */}
        <InputField label='Имя пользователя' value={login} entityEdit={{ handleFieldChange: handleLoginInput }} />
        <SubmitButton onClick={buttonLoginTG}>
          Войти  
        </SubmitButton>
      </div>
    </>
  );

  if (playerInfo?.settings == null) return (
    <AuthGateReg />
  );

  if (currentGame == null) return (
    <AuthGateNoGame player={playerInfo} />
  );

  // Everything is OK, show page
  if (isAuthenticated) return <>{children}</>;

  return (<>
    {/* Alpha Auth */}
    {/* <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-white">Введите ключ</h2>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`border p-2 rounded w-full mb-4 text-white ${falseAttemptInput() ? "placeholder-red-300 border border-red-400" : ""}`}
          maxLength={10}
          placeholder={falseAttemptInput() ? "Ключ неверен" : ""}
        />
        <button
          onClick={loginOnClick}
          className="w-full px-4 py-2 text-white bg-blue-800 rounded hover:bg-blue-700"
        >
          Войти
        </button>
      </div>
    </div> */}

    {/* Telegram Mini App */}
    { }
  </>
  );
};
