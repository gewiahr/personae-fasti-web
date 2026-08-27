import React, { useState } from 'react'
import { useAppSelector } from '../store';
import { selectPlayerUsername } from '../reducers/PlayerSlice';
import GameCreateEditPage from '@/pages/Games/GameCreateEditPage';
import CopyText from '@lib/CopyText';
import SubmitButton from '@lib/SubmitButton';

const AuthGateNoGame: React.FC = () => {
  const playerUsername = useAppSelector(selectPlayerUsername);

  const [newGameSwitch, switchNewGame] = useState<boolean>(false);

  return (
    <>
      {newGameSwitch ?
        <div className='layout-main w-full'>
          <GameCreateEditPage />
        </div> : 
        // === Disclaimer === //
        <div className='auth-gate-page'>
          <div className='flex flex-col gap-6 p-4 text-center italic'>
            <p className='text-2xl not-italic'>Вы ещё не участвуете ни в одной игре</p>
            <div>
              <p>Создайте игру и пригласите друзей</p>
              <SubmitButton className='mt-3' onClick={() => switchNewGame(true)}>Создать игру</SubmitButton>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <div className={`h-px bg-gray-300 w-[40%]`} />
              <p>или</p>
              <div className={`h-px bg-gray-300 w-[40%]`} />
            </div>
            <div>
              <p className='mb-3'>Поделитесь своим ником чтобы вас могли пригласить</p>
              <CopyText text={playerUsername} />
            </div>
          </div>
        </div>
      }
    </> 
  )
}

export default AuthGateNoGame;
