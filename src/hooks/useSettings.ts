import { useState } from "react";
import { GameFullInfo, GameInfo, PlayerInfo, PlayerSettings } from "../types/request";
import { api } from "../utils/api";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

export const useSettings = () => {
  const { accessKey } = useAuth();
  const [playerInfo, setPlayerInfo] = useLocalStorage<PlayerInfo | null>('playerInfo', null);
  const [currentGame, setCurrentGame] = useLocalStorage<GameFullInfo | null>('currentGame', null);
  const [playerGames, setPlayerGames] = useState<GameInfo[]>([]);

  const setPlayer = (newPlayerInfo: PlayerInfo | null) => {
    setPlayerInfo(newPlayerInfo);
  };

  const setGame = (gameInfo: GameFullInfo | null) => {
    setCurrentGame(gameInfo);
  };

  const updateSettings = async () => {
    var playerSettings = await api.get<PlayerSettings>("/player/settings", accessKey);
    if (playerSettings.data) {
      setCurrentGame(playerSettings.data.currentGame);
      setPlayerGames(playerSettings.data.playerGames);
    };
  };

  return {
    player: playerInfo || null,
    setPlayer,
    game: currentGame || null,
    setGame,
    playerGames,
    updateSettings,
  };
}