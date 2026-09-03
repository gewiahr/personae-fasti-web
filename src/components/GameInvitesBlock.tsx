import { useEffect } from 'react';
import { LuCheck, LuTrash2 } from 'react-icons/lu';

import { useNotifications } from '@/context/NotificationContext';
import { loadCurrentGame, selectCurrentGameInfo } from '@/reducers/CurrentGameSlice';
import {
  loadPlayerGames,
  selectAuthorization,
  selectPlayerInvites,
  selectPlayerUsername,
} from '@/reducers/PlayerSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import type { GameInvites } from '@/types/game';
import { api } from '@/utils/api';
import CopyText from '@lib/CopyText';
import FoldableCategory from '@lib/FoldableCategory';

const GameInvitesBlock = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const currentGame = useAppSelector(selectCurrentGameInfo);
  const playerInvites = useAppSelector(selectPlayerInvites);
  const playerUsername = useAppSelector(selectPlayerUsername);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (auth) dispatch(loadPlayerGames({ auth }));
  }, [auth, dispatch]);

  const handleInviteAccept = async (invite: GameInvites) => {
    const { error, status } = await api.post(`/player/invite/accept/${invite.inviteCode}`, auth, null);
    if (error) {
      addNotification(`Ошибка: ${error.message}`, 'error');
      return;
    }
    if (status !== 200) return;

    addNotification(`Вы приняли приглашение на игру "${invite.gameTitle}"`, 'success');
    try {
      if (!currentGame) await dispatch(loadCurrentGame({ auth })).unwrap();
      await dispatch(loadPlayerGames({ auth })).unwrap();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось обновить данные игрока';
      addNotification(`Ошибка: ${message}`, 'error');
    }
  };

  const handleInviteRefuse = async (invite: GameInvites) => {
    const { error, status } = await api.post(`/player/invite/refuse/${invite.inviteCode}`, auth, null);
    if (error) {
      addNotification(`Ошибка: ${error.message}`, 'error');
      return;
    }
    if (status === 200) {
      addNotification(`Вы отклонили приглашение на игру "${invite.gameTitle}"`, 'warning');
      dispatch(loadPlayerGames({ auth }));
    }
  };

  return (
    <div className='not-italic'>
      <FoldableCategory title={`Приглашений: ${playerInvites.length}`}>
        {playerInvites.length <= 0 ? (
          <div className='flex flex-col gap-4 justify-center items-center text-center'>
            <p className='italic'>
              Поделитесь своим именем пользователя чтобы мастер игры мог вас пригласить
            </p>
            <CopyText text={playerUsername} />
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {playerInvites.map((invite) => (
              <div key={invite.inviteCode} className='flex flex-1 gap-6 justify-between items-center'>
                <div className='flex flex-col text-start'>
                  <p>{invite.gameTitle}</p>
                  <p className='text-sm text-gray-500 italic'>{invite.invitedBy.username}</p>
                </div>
                <div className='flex gap-6 items-center'>
                  <LuCheck
                    size={24}
                    className='icon-button-accented'
                    onClick={() => handleInviteAccept(invite)}
                  />
                  <LuTrash2
                    size={20}
                    className='icon-button-danger'
                    onClick={() => handleInviteRefuse(invite)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </FoldableCategory>
    </div>
  );
};

export default GameInvitesBlock;
