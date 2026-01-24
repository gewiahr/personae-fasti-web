import { useState } from "react";
import type { GameFullInfo, GameInfo, LoginPlayerInfo, PlayerSettings } from "../types/request";
import { api } from "../utils/api";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

export const useSettings = () => {
  const { authorization } = useAuth();
  const [playerInfo, setPlayerInfo] = useLocalStorage<LoginPlayerInfo | null>('playerInfo', null);
  const [currentGame, setCurrentGame] = useLocalStorage<GameFullInfo | null>('currentGame', null);
  const [playerGames, setPlayerGames] = useState<GameInfo[]>([]);

  const setPlayer = (newPlayerInfo: LoginPlayerInfo | null) => {
    setPlayerInfo(newPlayerInfo);
  };

  const setGame = (gameInfo: GameFullInfo | null) => {
    setCurrentGame(gameInfo);
  };

  const updateSettings = async () => {
    var playerSettings = await api.get<PlayerSettings>("/player/settings", authorization);
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