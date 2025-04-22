import { ReactNode, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, login, attempts } = useAuth();
  const [ input, setInput ] = useState('');

  const loginOnClick = () => {
    login(input);
    setInput("");
  }

  const falseAttemptInput = () => {
    return Boolean(attempts) && !input
  }

  if (isAuthenticated) return <>{children}</>;
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Введите ключ</h2>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`border p-2 rounded w-full mb-4 text-white ${falseAttemptInput() ? "placeholder-red-300 border border-red-400" : ""}`}
          maxLength={10}
          placeholder={falseAttemptInput() ? "Ключ неверен" : ""}
        />
        {/*Boolean(attempts) && !input && 
        <p className='pb-2 mb-4 w-full text-red-600'>
          Ключ неверен
        </p>
        */}
        <button
          onClick={loginOnClick}
          className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Войти
        </button>
      </div>
    </div>
  );
};