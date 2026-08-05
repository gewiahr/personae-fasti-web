import { useNotifications } from "@/context/NotificationContext";
import { selectCurrentGame, changeCurrentGame, startNewSession } from "@/reducers/CurrentGameSlice";
import { selectAuthorization, selectPlayerGames, selectPlayerInvites, loadPlayerGames, selectPlayerUsername, selectPlayerExt } from "@/reducers/PlayerSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import type { GameInvites } from "@/types/game";
import { api } from "@/utils/api";
import ConfirmButton from "@lib/ConfirmButton";
import CopyText from "@lib/CopyText";
import FoldableCategory from "@lib/FoldableCategory";
import { SelectInput } from "@lib/Inputs/SelectInput";
import SubmitButton from "@lib/SubmitButton";
import { useEffect } from "react";
import { LuCheck, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";


const SettingsPage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const playerExt = useAppSelector(selectPlayerExt);
  const playerUsername = useAppSelector(selectPlayerUsername);
  const playerGames = useAppSelector(selectPlayerGames);
  const playerInvites = useAppSelector(selectPlayerInvites);
  const { game } = useAppSelector(selectCurrentGame);

  const { addNotification } = useNotifications();

  useEffect(() => {
    dispatch(loadPlayerGames({ auth }));
  }, []);

  const handleChangeCurrentGame = (value: string) => {
    dispatch(changeCurrentGame({ auth, gameExt: value }))
      .unwrap()
      .catch((e: any) => {
        addNotification(e.message, 'error');
      });
  };

  const handleNewSession = () => {
    dispatch(startNewSession({ auth }))
      .unwrap()
      .then(() => {
        addNotification('Началась новая сессия', 'success');
      }).catch((e: any) => {
        addNotification(e.message, 'error');
      });
  };

  const handleInviteAccept = async (invite: GameInvites) => {
    const { error, status } = await api.post(`/player/invite/accept/${invite.inviteCode}`, auth, null);
    if (error) {
      addNotification(`Ошибка: ${error.message}`, 'error');
      return;
    } else if (status === 200) {
      addNotification(`Вы приняли приглашение на игру "${invite.gameTitle}"`, 'success');
      dispatch(loadPlayerGames({ auth }));
    };   
  };

  const handleInviteRefuse = async (invite: GameInvites) => {
    const { error, status } = await api.post(`/player/invite/refuse/${invite.inviteCode}`, auth, null);
    if (error) {
      addNotification(`Ошибка: ${error.message}`, 'error');
      return;
    } else if (status === 200) {
      addNotification(`Вы отклонили приглашение на игру "${invite.gameTitle}"`, 'warning');
      dispatch(loadPlayerGames({ auth }));
    };   
  };

  return (
    <div className='layout-page'>
      <div className='flex flex-col gap-y-6'>
        {/* <h2 className='text-xl'>{player?.username}</h2> */}

        <FoldableCategory key="game_invites" title={`Приглашений: ${playerInvites.length}`}>
          {playerInvites.length <= 0 ? <div className='flex flex-col gap-4 justify-center items-center text-center'>
            <p className='italic'>Вы не приглашены ни в одну игру. Поделитесь своим именем пользователя чтобы мастер игры мог вас пригласить</p>
            <CopyText text={playerUsername} />
          </div> : <div className='flex flex-col gap-6'>
            {playerInvites.map((invite) => <div className='flex flex-1 gap-6 justify-between items-center'>
              <p>{invite.gameTitle}</p>
              <div className='flex gap-6 items-center'>
                <LuCheck size={24} className='icon-button-accented' onClick={() => handleInviteAccept(invite)} />
                {/* <Icon name='submit' className='icon-button-accented' onClick={() => handleInviteAccept(invite)} /> */}
                {/* <Icon name='trash' className='icon-button-danger' onClick={() => handleInviteRefuse(invite)} /> */}
                <LuTrash2 size={20} className='icon-button-danger' onClick={() => handleInviteRefuse(invite)} />
              </div>
            </div>)}  
          </div>}
        </FoldableCategory>

        <div>
          <p className='text-sm'>Текущая игра:</p>
          <div className='flex gap-4 max-sm:flex-col justify-between items-center'>
            {game && <div className='w-full'>
              {playerGames && playerGames.length > 0 ? <SelectInput
                key={playerGames.length}
                options={playerGames?.
                  filter((pg) => pg.ext != game.ext).
                  map((pg) => { return { key: pg.ext, value: pg.title } }) || []}
                value={game.title}
                entityEdit={{ handleFieldChange: handleChangeCurrentGame }}

              /> :
              <h2 className='text-xl'>{game.title}</h2>}
            </div>}
            <div className='flex gap-2 max-xs:flex-1 xs:justify-end'>
              {game?.gmExt == playerExt && <SubmitButton key={`settingspage_submitbutton_editgame`} className='flex' onClick={() => navigate(`/games/${game ? game.ext : 0}/edit`)}>
                Редактировать
              </SubmitButton>}
              <SubmitButton key={`settingspage_submitbutton_newgame`} onClick={() => navigate("/games/new")}>
                Создать
              </SubmitButton>
            </div>
          </div>
        </div>

        {game?.gmExt == playerExt && <ConfirmButton className='w-full mt-2' children={"Начать новую сессию"} onClickConfirm={() => handleNewSession()} />}

        {/* <SelectItems
          items={[
            { key: 1, value: 'red', content: <div className="w-16 h-8 bg-red-500 border-2 border-white rounded" /> },
            { key: 2, value: 'blue', content: <div className="w-16 h-8 bg-blue-500 border-2 border-white rounded" /> },
            { key: 3, value: 'green', content: <div className="w-16 h-8 bg-green-500 border-2 border-white rounded" /> },
          ]}
          borderWidth={4}
          animationDuration={200}
        /> */}
      </div>
    </div>
  )
};

export default SettingsPage;
