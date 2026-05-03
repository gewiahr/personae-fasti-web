import { selectAuthorization } from "@/reducers/PlayerSlice";
import { useAppSelector } from "@/store";
import type { ApiError } from "@/types/api";
import type { EntityInfo } from "@/types/request";
import { api } from "@/utils/api";
import LinkButton from "@lib/LinkButton";
import LoadingLabel from "@lib/LoadingLabel";
import { useState, useEffect } from "react";
import { ErrorPage } from "../ErrorPage";
import EntityCard from "./EntityCard";
import { useEntityContext } from "./EntityLayout";
import CharList from "../Chars/CharList";

const EntityList = () => {
  const { entityType, metaData } = useEntityContext();
  
  const [entities, setEntities] = useState<EntityInfo[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const auth = useAppSelector(selectAuthorization);

  useEffect(() => {
    const fetchEntitiesInfo = async () => {
      const { data, error } = await api.get<{ [metaData.EntityTypePl]: EntityInfo[] }>(`/${metaData.EntityTypePl}`, auth);
      if (error) {
        setError(error);
      } else if (data) {
        setEntities(data[metaData.EntityTypePl]);
      }
      setLoading(false);
    };

    fetchEntitiesInfo();
  }, []);

  //if (loading) return <LoadingPage />

  if (error) return <ErrorPage error={error} entityMeta={metaData} />

  /// ## Adapt Char list page to entities list ## ///
  if (entityType === 'chars') return <CharList />

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{metaData.EntityNamePl}</h1>
        <LinkButton to={`/${metaData.EntityTypePl}/new`} >
          Добавить
        </LinkButton>
      </div>

      {entities && entities.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            metaData={metaData}
          // Player Labels
          // playerName={data?.players.find((player) => (player.id === char.playerID))?.username || ""}
          //labelText={players.find((player) => (player.id === entity.playerID))?.username || ""}
          />
        ))}
      </div> :
      loading ? <LoadingLabel /> :
      <div className='mt-8 text-center text-xl italic'>
        <p>{`Пока что в этой кампании нет ни одного ${metaData.EntityNameAcc.toLowerCase()}. Пора создать парочку!`}</p>
      </div>}
    </div>
  );
};

export default EntityList;