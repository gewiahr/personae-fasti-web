import { useEffect } from "react";
import { RecordFeed } from "./RecordFeed";
import { RecordInput } from "./RecordInput";
import { selectCurrentGame, loadCurrentGameRecords, loadCurrentGameQuests, loadCurrentGameSuggestions } from "@/reducers/CurrentGameSlice";
import { selectAuthorization } from "@/reducers/PlayerSlice";
import { useAppDispatch, useAppSelector } from "@/store";


export const RecordPage = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const { game, records } = useAppSelector(selectCurrentGame);

  useEffect(() => {
    dispatch(loadCurrentGameRecords({ auth }));
    dispatch(loadCurrentGameQuests({ auth }));
    dispatch(loadCurrentGameSuggestions({ auth }));
  }, []);

  return (
    <div className="layout-page">
      {game && <>
        <RecordInput />
        <RecordFeed 
          records={records} 
          editable
          showQuests
          showSessions 
        />
      </>}
    </div>
  );
};
