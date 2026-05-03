import { selectCurrentGamePlayers } from "@/reducers/CurrentGameSlice";
import { selectAuthorization } from "@/reducers/PlayerSlice";
import { useAppSelector } from "@/store";
import type { ApiError } from "@/types/api";
import { CharMetaData } from "@/types/entities";
import type { CharInfo } from "@/types/request";
import { api } from "@/utils/api";
import LinkButton from "@lib/LinkButton";
import LoadingLabel from "@lib/LoadingLabel";
import { useState, useEffect } from "react";
import EntityCard from "../Entities/EntityCard";
import { ErrorPage } from "../ErrorPage";

const CharList = () => {
  const auth = useAppSelector(selectAuthorization);
  const players = useAppSelector(selectCurrentGamePlayers);

  const [chars, setChars] = useState<CharInfo[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharInfo = async () => {
      const { data } = await api.get<{ chars: CharInfo[] }>("/chars", auth);
      if (error) {
        setError(error);
      } else if (data) {
        setChars(data.chars);
      }
      setLoading(false);
    };

    fetchCharInfo();
  }, []);

  //if (loading) return <LoadingPage />

  if (error) return <ErrorPage error={error} entityMeta={CharMetaData} />

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Герои</h1>
        <LinkButton to="/chars/new">
          Добавить
        </LinkButton>
      </div>
    
      {chars.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chars.map((char) => (
          <EntityCard
            key={char.id}
            entity={char}
            metaData={CharMetaData}
            labelText={players.find((player) => (player.id === char.playerID))?.username || ""}
          />
        ))}
      </div> : 
      loading ? <LoadingLabel /> :
      <div className='mt-8 text-center text-xl italic'>
        <p>Пока что в этой кампании нет ни одного героя. Присоединяйтесь!</p>
      </div>}
    </div>
  );
};

export default CharList;