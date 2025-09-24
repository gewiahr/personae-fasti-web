import { GameFullInfo, PlayerInfo, PlayerSettings } from "../types/request";
import { api } from "../utils/api";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

export const useSettings = () => {
  const { accessKey } = useAuth();
  const [playerInfo, setPlayerInfo] = useLocalStorage<PlayerInfo | null>('playerInfo', null);
  const [currentGame, setCurrentGame] = useLocalStorage<GameFullInfo | null>('currentGame', null);

  const setPlayer = (newPlayerInfo: PlayerInfo | null) => {
    setPlayerInfo(newPlayerInfo);
  };

  const setGame = (gameInfo: GameFullInfo | null) => {
    setCurrentGame(gameInfo);
  };

  const updateGame = async () => {
    var playerSettings = await api.get<PlayerSettings>("/player/settings", accessKey);
    if (playerSettings.data) {
      setCurrentGame(playerSettings.data.currentGame);
    }
  };

  return {
    player: playerInfo || null,
    setPlayer,
    game: currentGame || null,
    setGame,
    updateGame,
  };
}