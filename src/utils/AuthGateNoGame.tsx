import React, { useEffect, useState } from 'react'
import GameCreateEditPage from '../pages/GameCreateEditPage';
import SubmitButton from '../components/lib/SubmitButton';
import { /* useAppDispatch ,*/ useAppSelector } from '../store';
import { /* selectAuthorization ,*/ selectPlayer } from '../reducers/PlayerSlice';
import CopyText from '../components/lib/CopyText';

type AuthGateNoGameProps = {

};

const AuthGateNoGame: React.FC<AuthGateNoGameProps> = ({ }) => {
  // const dispatch = useAppDispatch();
  // const auth = useAppSelector(selectAuthorization);
  const player = useAppSelector(selectPlayer);

  const [newGameSwitch, switchNewGame] = useState<boolean>(false);

  useEffect(() => {
    //setGameInfo(playerSettingsData?.currentGame || null)
  }, []);

  return (
    // <div className="flex flex-col gap-3 items-center justify-center h-screen bg-gray-800 text-gray-100">
    //   <div className='flex flex-col gap-6 min-w-sm'>
       
    //   </div>
    // </div>

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
              <SubmitButton className='mt-3' onClick={() => switchNewGame(true)} >Создать игру</SubmitButton>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <div className={`h-px bg-gray-300 w-[40%]`} />
              <p>или</p>
              <div className={`h-px bg-gray-300 w-[40%]`} />
            </div>
            <div>
              <p className='mb-3'>Поделитесь своим ником чтобы вас могли пригласить</p>
              <CopyText text={player!.info!.username} />
            </div>
          </div>
        </div>
      }
      {/* <EntityEditPage metaData={CharMetaData} />  */}
    </> 
  )
}

export default AuthGateNoGame;
