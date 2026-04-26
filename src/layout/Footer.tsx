import { useState } from 'react'
import { LuClipboardPen, LuListTree } from 'react-icons/lu';
import { Modal } from '../components/lib/Modal';

const Footer = () => {
  const [updatesModal, setUpdatesModal] = useState<boolean>(false);
  const [feedbackModal, setFeedbackModal] = useState<boolean>(false);

  return (
    <footer className="layout-footer">
      <a href='https://github.com/gewiahr'>{`© ${new Date().getFullYear()} gewiahr (Tomasz Mozhny)`}</a>
      <div className='flex gap-4'>
        <LuListTree className='cursor-pointer hover:text-(--color-text-accent)' size={24} onClick={() => setUpdatesModal(true)} />
        <LuClipboardPen className='cursor-pointer hover:text-(--color-text-accent)' size={24} onClick={() => setFeedbackModal(true)} />
      </div>

      {updatesModal && <Modal title='Обновления' onClose={() => setUpdatesModal(false)} >
        <p>Актуальная информация о обновлениях и исправлениях</p>
      </Modal>} 

      {feedbackModal && <Modal title='Обратная связь' onClose={() => setFeedbackModal(false)} >
        <p>Введите пожелания и/или предложения по улучшению сервиса</p>
      </Modal>}    
    </footer>
  );
}

export default Footer;
