import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { selectAuthorization, selectPlayerUsername } from '@/reducers/PlayerSlice';
import { useAppSelector } from '@/store';
import type { PlayerFull } from '@/types/player';
import { InputField } from '@lib/Inputs/InputField';

type AuthGateRegUsernameInputState = 'check' | 'accept' | 'loading';
type AuthGateRegUsernameInputCheck = 'none' | 'valid' | 'invalid';

const AuthGateReg: React.FC = () => {
  const auth = useAppSelector(selectAuthorization);
  const playerUsername = useAppSelector(selectPlayerUsername);

  const initInputTip = 'Выберите имя пользователя, (пока что) его нельзя будет сменить';
  const [inputState, setInputState] = useState<AuthGateRegUsernameInputState>('check');
  const [inputTip, setInputTip] = useState<string>(initInputTip);
  const [inputCheck, setInputCheck] = useState<AuthGateRegUsernameInputCheck>('none');
  const [_, setPlayerInfoLS] = useLocalStorage<PlayerFull | null>('playerInfo', null);
  const [newUsername, setNewUsername] = useState<string>(playerUsername || "");
  const navigate = useNavigate();
  //const { addNotification } = useNotifications();

  const checkUsername = async () => {
    setInputState('loading');
    var { data, error } = await api.get(`/player/username/checkAvailability/${newUsername}`, auth);
    if (error) {
      //addNotification(error.message, 'error');
      setInputState('check');
    } else if (data) {
      if (data.available) {
        //addNotification("Username available", 'success');
        setInputState('accept');
        setInputTip('Имя свободно. Вы можете его выбрать.');
        setInputCheck('valid');
      } else {
        //addNotification("Username unavailable", 'warning');
        setInputState('check');
        setInputTip('Имя недоступно! Попробуйте другое!');
        setInputCheck('invalid');
      }
    } else {
      //addNotification("Unexpected error", 'error');
      setInputState('check');
    }
  };

  const acceptUsername = async () => {
    setInputState('loading');
    var { data, error } = await api.patch<PlayerFull>(`/player/username`, auth, { "newUsername": newUsername }); 
    if (error) {
      setInputTip('Имя недоступно! Попробуйте другое!');
      setInputState('check');
      setInputCheck('invalid');
    } else if (data) {
      setPlayerInfoLS(data);
      setInputState('loading');
      navigate(0);
    }
  };

  const handleInputChange = (value: string) => {
    setNewUsername(value);
    setInputState('check');
    setInputTip(initInputTip);
    setInputCheck('none');
  };

  return (
    <div className="auth-gate-page">
      <div className='flex flex-col gap-6 min-w-sm max-w-sm'>
        {/* <p className=''>{`Выберите имя пользователя, (пока что) его нельзя будет сменить`}</p> */}
        <InputField label='Имя пользователя' value={newUsername} entityEdit={{ handleFieldChange: handleInputChange }} />
        <p className={`italic ${inputCheck === 'valid' ? 'text-green-500' : inputCheck === 'invalid' ? 'text-(--color-text-danger)' : 'text-(--color-text-regular)'}`}>{inputTip}</p>
        {inputState === 'check' ? <button className='w-full submit-button-container submit-button-container-regular' onClick={checkUsername}>Проверить</button> :
        inputState === 'accept' ? <button className='w-full submit-button-container submit-button-container-regular' onClick={acceptUsername}>Применить</button> :
        inputState === 'loading' ? <button className='w-full submit-button-container submit-button-container-disabled'>Загрузка...</button> :
        <></>}
      </div>
    </div>
  );
};

export default AuthGateReg;