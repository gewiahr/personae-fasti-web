import { RecordFeed } from "@/pages/Records/RecordFeed";
import { useApi } from "@/hooks/useApi";
import useImage from "@/hooks/useImage";
import { selectAuthorization } from "@/reducers/PlayerSlice";
import { useAppSelector } from "@/store";
import Hyperlink from "@lib/RichText/Hyperlink";
import RichText from "@lib/RichText/RichText";
import SubmitButton from "@lib/SubmitButton";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorPage } from "../ErrorPage";
import { LoadingPage } from "../LoadingPage";
import { useEntityContext } from "./EntityLayout";
import type { EntityType, EntityBrief, EntityMetaDataTypeMap, Location, LocationBrief } from "@/types/entities";

export const EntityPage = () => {
  const { ext } = useParams();
  const navigate = useNavigate();
  const { entityType, metaData } = useEntityContext();
  const newEntity = ext ? false : true;

  type EntityModel = EntityMetaDataTypeMap[typeof entityType]['page'];

  const { image, ratio } = useImage({ entityType: metaData.EntityType, entityExt: ext || "" });

  const [entity, setEntity] = useState<EntityModel>({} as EntityModel);
  const isLocation = (e: EntityModel): e is Location => 'parentExt' in e;

  const auth = useAppSelector(selectAuthorization);
  const { data, loading, error } = useApi.get<Record<string, any>>(`/${metaData.EntityType}/${ext}`, auth, [], newEntity);

  useEffect(() => {
    if (data) {
      setEntity(data[metaData.EntityType]);
    };
  }, [data]);

  const openEditing = () => {
    navigate(`/${metaData.EntityTypePl}/${ext}/edit`);
  };

  const formIncludesLocation = (includes: LocationBrief[]) => {
    return <>
      <p>
        В <span className="font-bold italic">{entity.name}</span> наход{includes.length > 1 ? "ятся" : "ится"}: 
        {includes.map((el: EntityBrief, i: number) => (<>
          {i !== 0 ? `, ` : ` `}
          <Hyperlink key={metaData.EntityType + el.ext} ext={el.ext} type={metaData.EntityType as EntityType} mentionText={`${el.name}`} />
        </>
        ))}.
      </p>
    </>
  }

  return (
    <div className="layout-page">
      {loading ? (
        <LoadingPage />
      ) : error || !entity || !data ? (
        <ErrorPage error={error || null} entityMeta={metaData} />
      ) : (<>
        {image && <div className='relative pb-4 rounded-lg'>
          <img className='w-full rounded-lg border border-gray-700 bg-gray-800 object-cover' src={image.url} alt={entity.name}></img>
          {image && ratio <= 1 && <div className="absolute bottom-2 left-0 right-0 bg-slate-900/60 px-4 py-2 pb-4">
            <h1 className="text-xl font-bold">{entity.name}</h1>
            <h3 className="text-sm text-gray-400 italic">{entity?.title}</h3>
          </div>}
        </div>}
        <div className='flex justify-between pb-4'>
          {(image && ratio > 1 || !image) &&
            <div>
              <h1 className="text-2xl font-bold">{entity.name}</h1>
              <h3 className="text-m text-gray-400 mb-4 italic">{entity?.title}</h3>
            </div>}
          <div className={`mb-6 ${(image && ratio > 1 || !image) ? "w-[30%]" : "w-full"}`}>
            <SubmitButton
              onClick={openEditing}
              className={`flex justify-center items-center ${(image && ratio > 1 || !image) ? "w-full" : ""}`}
            >
              {"Изменить"}
            </SubmitButton>
          </div>
        </div>
        <RichText key={`${metaData.EntityType}page_richtext-${ext ?? "newentity"}`} text={entity.description || ""} uid={`${metaData.EntityType}page-${ext ?? "newentity"}`} fullWidth={true} />

        {/* Entity specific fields */}
        {metaData.EntityType == "location" && isLocation(entity) && (entity.parentExt || data.includes.length > 0) && <>
          <div className='mt-6'>
            {data.parent != null && <>
              <p>
                Находится в <Hyperlink key={metaData.EntityType + data.parent.ext} ext={data.parent.ext} type={metaData.EntityType as EntityType} mentionText={data.parent.name} />.
              </p>
            </>}
            {data.includes.length > 0 && formIncludesLocation(data.includes)}
          </div>
        </>}

        {/* ++ Change to universal feed ++ */}
        {data.records && data.records.length > 0 && <div className=''>
          <h2 className='text-right text-xl text-bold pt-8 pb-2'>Упоминания</h2>
          <RecordFeed key={`enitypage_recordfeed`} records={data.records} />
        </div>}
      </>)}
    </div>
  );
};

export default EntityPage;
