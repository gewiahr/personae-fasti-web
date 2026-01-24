import { type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import useTelegram from '../hooks/useTelegram';
import AuthGateReg from './AuthGateReg';
import AuthGateNoGame from './AuthGateNoGame';

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, playerInfo, currentGame, loginTG } = useAuth();
  //const [input, setInput] = useState<string>('');

  const { TMA, initDataRaw } = useTelegram();

  // ++ Implement correct server error ++ //
  //const [warning, setWarning] = useState<string>();

  // const loginOnClick = () => {
  //   if (input) {
  //     login(input);
  //     setInput("");
  //   };
  // };

  // const falseAttemptInput = () => {
  //   return Boolean(attempts) && !input;
  // };

  // Web-version is in development
  if (TMA) return (
    <div className="flex flex-col gap-4 p-6 text-center items-center justify-center h-screen bg-gray-800 text-gray-100">
      <p>Веб-версия появится совсем скоро!</p>
      <p>А пока вы можете воспользоваться версией Telegram Mini App перейдя в бот</p>
      <a className='text-blue-500 cursor-pointer' href='https://t.me/personaerpgbot'>@PersonaeRPGbot</a>
    </div>
  );

  // AuthGate 
  if (!isAuthenticated) return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="flex flex-col gap-4 p-6 bg-gray-900 rounded-lg shadow-lg max-w-sm text-white">
          <h2 className="text-xl font-bold ">Приветствую в Personae App!</h2>
          <p className="italic">
            Это приложение для ведения летописи твоей настольной ролевой игры.
            Оно ещё только тестируется, но ты уже можешь его опробовать.
            Всё что нужно это подписаться на мой канал.
          </p>
          <a href='https://t.me/dierolled' className='italic text-center text-blue-300'>Ссылка на мой канал</a>
          <p className="italic">
            На канале я рассказываю о геймдизайне и о других своих интересных проектах.
            А после подписки ты сможешь войти и зарегистрироваться одной кнопкой внизу.
          </p>
          <button className='btn' onClick={() => loginTG(initDataRaw || "")}>
            Войти
          </button>
        </div>
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
