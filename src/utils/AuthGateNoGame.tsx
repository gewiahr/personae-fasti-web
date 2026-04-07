import React, { useEffect, useState } from 'react'
import GameCreateEditPage from '../pages/GameCreateEditPage';
import SubmitButton from '../components/lib/SubmitButton';
import { /* useAppDispatch ,*/ useAppSelector } from '../store';
import { /* selectAuthorization ,*/ selectPlayer } from '../reducers/PlayerSlice';

type AuthGateNoGameProps = {

};

const AuthGateNoGame: React.FC<AuthGateNoGameProps> = ({ }) => {
  // const dispatch = useAppDispatch();
  // const auth = useAppSelector(selectAuthorization);
  const player = useAppSelector(selectPlayer);

  const [newGameSwitch, switchNewGame] = useState<boolean>(false);
  const [usernameCopied, setUsernameCopied] = useState<boolean>(false);

  const copyUsername = () => {
    navigator.clipboard.writeText(player!.info!.username);
    setUsernameCopied(true);
    setTimeout(() => setUsernameCopied(false), 1500);
  };

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
              <p className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-md transition-colors select-none cursor-pointer ${
                  usernameCopied 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 not-italic'
                }`} 
                onClick={copyUsername}>{usernameCopied ? `Скопировано` : player!.info!.username}</p>
            </div>
          </div>
        </div>
      }
      {/* <EntityEditPage metaData={CharMetaData} />  */}
    </> 
  )
}

export default AuthGateNoGame;
