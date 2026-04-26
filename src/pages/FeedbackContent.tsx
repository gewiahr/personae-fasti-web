import { useState } from "react";
import { RichInput } from "../components/lib/Inputs/RichInput";
import SubmitButton from "../components/lib/SubmitButton";
import { api } from "../utils/api";
import { selectAuthorization } from "../reducers/PlayerSlice";
import { useAppSelector } from "../store";
import { useNotifications } from "../context/NotificationContext";

type FeedbackContent = {
  closeContent: () => void;
};

const FeedbackContent: React.FC<FeedbackContent> = ({ closeContent }) => {
  const auth = useAppSelector(selectAuthorization);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const { addNotification } = useNotifications();

  const sendFeedback = async () => {
    const {error} = await api.post('/feedback', auth, { feedbackText });
    if (error) { 
      addNotification(error.message, 'error');
      return
    }

    addNotification('Спасибо за обратную связь', 'success');
    setFeedbackText('');
    closeContent()
  };

  return (
    <div className="flex flex-col gap-2">
      <p>Введите пожелания и/или предложения по улучшению сервиса:</p>
      <RichInput
        suggestionData={[]}
        value={feedbackText}
        entityEdit={{ handleFieldChange: setFeedbackText }}
      />
      <SubmitButton onClick={sendFeedback} disabled={!feedbackText}>
        Отправить
      </SubmitButton>
      <p className="mt-4">
        {`Также можете связаться со мной по почте `}
        <a className='ref-text' href="mailto:gewiahr@gmail.com">gewiahr@gmail.com</a>
        {` или в телеграме `}
        <a className='ref-text' href="https://t.me/gewiahr">@gewiahr</a>
      </p>
    </div>
  )
}

export default FeedbackContent
