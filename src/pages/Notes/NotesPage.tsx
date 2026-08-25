import { useEffect, useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { selectCurrentGameSuggestions } from "@/reducers/CurrentGameSlice";
import { selectAuthorization } from "@/reducers/PlayerSlice";
import { useAppSelector } from "@/store";
import type { PersonalNote } from "@/types/note";
import { convertSuggestionDataToRender } from "@/types/suggestion";
import { api } from "@/utils/api";
import { MarkdownInput } from "@lib/Inputs/MarkdownInput";
import LoadingLabel from "@lib/LoadingLabel";
import MarkdownText from "@lib/RichText/MarkdownText";
import SubmitButton from "@lib/SubmitButton";

const NotesPage = () => {
  const auth = useAppSelector(selectAuthorization);
  const suggestions = useAppSelector(selectCurrentGameSuggestions);
  const { addNotification } = useNotifications();

  const [note, setNote] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const loadNote = async () => {
      const { data, error } = await api.get<PersonalNote>("/notes", auth);
      if (!active) return;

      if (error) {
        setLoadFailed(true);
      } else {
        const loadedNote = data?.personalNote ?? "";
        setNote(loadedNote);
        setDraftNote(loadedNote);
      }
      setIsLoading(false);
    };

    loadNote();
    return () => { active = false; };
  }, [auth]);

  const startEditing = () => {
    setDraftNote(note);
    setIsEditing(true);
  };

  const saveNote = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const { data, error } = await api.put<PersonalNote>("/notes", auth, {
      personalNote: draftNote,
    } satisfies PersonalNote);

    if (error) {
      addNotification(`Ошибка: ${error.message}`, "error");
    } else {
      const savedNote = data?.personalNote ?? draftNote;
      setNote(savedNote);
      setDraftNote(savedNote);
      setIsEditing(false);
      addNotification("Заметки сохранены", "success");
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="layout-page"><LoadingLabel /></div>;
  }

  if (loadFailed) {
    return <div className="layout-page"><p>Заметки недоступны</p></div>;
  }

  return (
    <div className="layout-page">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4 pb-4">
          <h1 className="text-2xl font-bold">Заметки</h1>
          <div className="w-[30%] min-w-32">
            <SubmitButton
              className="flex w-full items-center justify-center"
              disabled={isSaving}
              onClick={isEditing ? saveNote : startEditing}
            >
              {isEditing ? "Сохранить" : "Редактировать"}
            </SubmitButton>
          </div>
        </div>

        {isEditing ? (
          <MarkdownInput
            value={draftNote}
            label="Текст"
            suggestionData={convertSuggestionDataToRender(suggestions)}
            entityEdit={{ handleFieldChange: setDraftNote }}
          />
        ) : (
          <MarkdownText
            text={note}
            uid="personal-notes"
            suggestions={suggestions.entities}
            fullWidth
            className="min-h-25"
          />
        )}
      </div>
    </div>
  );
};

export default NotesPage;
