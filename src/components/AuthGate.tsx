import { ReactNode, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, login, attempts } = useAuth();
  const [input, setInput] = useState<string>('');
  // ++ Implement correct server error ++ //
  //const [warning, setWarning] = useState<string>();

  const loginOnClick = () => {
    if (input) {
      login(input);
      setInput("");
    }
  }

  const falseAttemptInput = () => {
    return Boolean(attempts) && !input
  }

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
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
    </div>
  );
};
