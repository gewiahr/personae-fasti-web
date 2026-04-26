import { useState } from 'react'
import { LuClipboardPen, LuFileUser } from 'react-icons/lu';
import { Modal } from '../components/lib/Modal';
import AttributionsContent from '../pages/AttributionsContent';
//import UpdatesContent from '../pages/UpdatesContent';
import FeedbackContent from '../pages/FeedbackContent';

const Footer = () => {
  //const [updatesModal, setUpdatesModal] = useState<boolean>(false);
  const [feedbackModal, setFeedbackModal] = useState<boolean>(false);
  const [attributionsModal, setAttributionsModal] = useState<boolean>(false);

  // ** Update Modals to be self-sufficient on close logics, refactor the component */
  return (
    <footer className="layout-footer">
      <a href='https://github.com/gewiahr'>{`© ${new Date().getFullYear()} gewiahr (Tomasz Mozhny)`}</a>
      <div className='flex gap-4'>
        {/* <LuListTree title="Обновления" className='cursor-pointer hover:text-(--color-text-accent)' size={24} onClick={() => setUpdatesModal(true)} /> */}
        <LuClipboardPen title="Обратная связь" className='cursor-pointer hover:text-(--color-text-accent)' size={24} onClick={() => setFeedbackModal(true)} />
        <LuFileUser title="Источники" className='cursor-pointer hover:text-(--color-text-accent)' size={24} onClick={() => setAttributionsModal(true)} />
      </div>

      {/* {updatesModal && <Modal title='Обновления' onClose={() => setUpdatesModal(false)} >
        <UpdatesContent />
      </Modal>}  */}

      {feedbackModal && <Modal title='Обратная связь' onClose={() => setFeedbackModal(false)} >
        <FeedbackContent closeContent={() => setFeedbackModal(false)}/>
      </Modal>}

      {attributionsModal && <Modal title='Источники' onClose={() => setAttributionsModal(false)} >
        <AttributionsContent />
      </Modal>}     
    </footer>
  );
}

export default Footer;
