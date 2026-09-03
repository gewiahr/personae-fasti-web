import { useNotifications } from "@/context/NotificationContext";
import { selectCurrentGame, changeCurrentGame, startNewSession } from "@/reducers/CurrentGameSlice";
import { selectAuthorization, selectPlayerGames, selectPlayerExt } from "@/reducers/PlayerSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import GameInvitesBlock from "@/components/GameInvitesBlock";
import ConfirmButton from "@lib/ConfirmButton";
import { SelectInput } from "@lib/Inputs/SelectInput";
import SubmitButton from "@lib/SubmitButton";
import { useNavigate } from "react-router-dom";


const SettingsPage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const playerExt = useAppSelector(selectPlayerExt);
  const playerGames = useAppSelector(selectPlayerGames);
  const { game } = useAppSelector(selectCurrentGame);

  const { addNotification } = useNotifications();

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

  return (
    <div className='layout-page'>
      <div className='flex flex-col gap-y-6'>
        <GameInvitesBlock />

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
      </div>
    </div>
  )
};

export default SettingsPage;
