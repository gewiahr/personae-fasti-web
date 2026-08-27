import { useCallback, useEffect, useRef, useState } from "react";
import { InputField } from "../components/lib/Inputs/InputField";
import SubmitButton from "../components/lib/SubmitButton";
import { useAppDispatch, useAppSelector } from "../store";
import { loginWeb, selectAuthorization, signup } from "../reducers/PlayerSlice";
import { api } from "./api";

const LoginComponent = () => {
  const [login, setLogin] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [mayRegister, setRegisterStatus] = useState<boolean>(false);
  const [mayLogin, setLoginStatus] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);

  const loginRef = useRef<HTMLInputElement>(null);
  const signupRef = useRef<HTMLInputElement>(null); 

  const handleLoginInput = (value: string) => {
    setLogin(value.trim().replace(" ", ""));
    setError("");
    setRegisterStatus(false);
    setLoginStatus(false);
    setPassword("");
    setEmail("");
    setPasswordError("");
  };

  const handlePasswordInput = (value: string) => {
    setPassword(value.trim().replace(" ", ""));
    setPasswordError("");
  };

  const handleSignUpButton = useCallback(() => {
    dispatch(signup({ username: login, password, email }))
      .unwrap()
      .catch((e: any) => {
        setPasswordError(e.message);
      });
  }, [login, password, email]);

  const handleLoginButton = useCallback(() => {
    dispatch(loginWeb({ username: login, password }))
      .unwrap()
      .catch((e: any) => {
        setPasswordError(e.message);
      });
  }, [login, password]);

  const handleContinueButton = useCallback(async () => {
    setError("");
    const { data, error } = await api.get<{ available: boolean, checkUsername: string }>(`/login/${login}`, auth);
    if (error) setError(error.message);
    else if (data) {
      if (!data.available) setLoginStatus(true); //setError("Имя недоступно");
      else setRegisterStatus(true);
    };
  }, [login]);

  useEffect(() => {
    if (mayRegister) signupRef.current?.focus();
  }, [mayRegister]);

  useEffect(() => {
    if (mayLogin) loginRef.current?.focus();
  }, [mayLogin]);

  useEffect(() => {
    const handleGlobalEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (mayRegister) {
          handleSignUpButton();
        } else if (mayLogin) {
          handleLoginButton();
        } else {
          handleContinueButton();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalEnter);
    return () => window.removeEventListener('keydown', handleGlobalEnter);
  }, [mayRegister, mayLogin, handleSignUpButton, handleLoginButton, handleContinueButton]);

  return (
    <div className="auth-gate-page">
      <h2 className="text-xl font-bold">Приветствую в Personae App!</h2>
      <div>
        <p className="italic">
          Это приложение для ведения летописи твоей настольной ролевой игры.
        </p>
        <p className="italic">
          Оно ещё только тестируется, но ты уже можешь его опробовать.
        </p>
      </div>

      <p className="italic pb-4">
        Введи логин чтобы войти или зарегистрироваться
      </p>

      <div className='flex flex-col gap-4 min-w-85 w-[25%]'>

        <div className="flex flex-1 gap-2 w-full">
          <InputField label='Имя пользователя' value={login} className="flex-1" entityEdit={{ handleFieldChange: handleLoginInput }} error={error} />
          {mayRegister && <SubmitButton onClick={() => { setLogin(""); setRegisterStatus(false); }}>
            {`<-`}
          </SubmitButton>}
        </div>

        {mayRegister && <>
          <InputField inputRef={signupRef} label='Почта' value={email} entityEdit={{ handleFieldChange: (value) => setEmail(value.trim().replace(" ", "")) }} />
          <InputField label='Пароль' htmlType="password" value={password} entityEdit={{ handleFieldChange: handlePasswordInput }} error={passwordError} />
        </>}
        {mayLogin && <InputField inputRef={loginRef} label='Пароль' htmlType="password" value={password} entityEdit={{ handleFieldChange: handlePasswordInput }} error={passwordError} />}

        {mayRegister ? <SubmitButton className='w-full' onClick={handleSignUpButton}>
          Зарегистрироваться
        </SubmitButton> :
          mayLogin ? <SubmitButton className='w-full' onClick={handleLoginButton}>
            Войти
          </SubmitButton> :
            <SubmitButton className='w-full' onClick={handleContinueButton}>
              Продолжить
            </SubmitButton>}

      </div>
    </div>
  );
}

export default LoginComponent;
