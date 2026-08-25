import { type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import Icon from '@/components/icons/Icon';
import { type Record } from '@/types/record'
import type { QuestBrief } from '@/types/quest';
import type { SuggestionEntity } from '@/types/suggestion';
import MarkdownText from '@lib/RichText/MarkdownText';

interface RecordCardProps {
  record: Record;
  label?: string;
  accented?: boolean;
  editable?: boolean;
  quest?: QuestBrief;
  suggestions: SuggestionEntity[];
  onEdit?: (record : Record) => void;
  editContent?: ReactNode;
};

const RecordCard = ({ record, label="", accented=false, editable=false, quest, suggestions, onEdit, editContent } : RecordCardProps) => {
  const reduceMotion = useReducedMotion();
  const isEditing = Boolean(editContent);
  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 38 };
  const contentEnterTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.14, delay: 0.18, ease: 'easeOut' as const };
  const contentExitTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.1, ease: 'easeIn' as const };
  const colorTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: 'easeInOut' as const };

  return (
    <motion.div
      layout="position"
      className="relative"
      transition={{ layout: layoutTransition }}
    >
      <motion.div
        layout
        style={{ borderRadius: 8 }}
        animate={{
          backgroundColor: isEditing ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)',
          borderColor: isEditing || accented ? 'var(--color-accent)' : 'var(--color-dimmed)',
        }}
        transition={{
          layout: layoutTransition,
          backgroundColor: colorTransition,
          borderColor: colorTransition,
        }}
        key={record.id}
        className={`record-card-container ${isEditing ? 'record-card-container-edit' : accented ? 'record-card-container-accented' : 'record-card-container-dimmed'}`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            layout="position"
            key={isEditing ? 'edit' : 'view'}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: contentEnterTransition }}
            exit={{
              opacity: reduceMotion ? 1 : 0,
              transition: contentExitTransition,
            }}
          >
            {editContent ?? <>
              <div className="flex justify-between items-start">
                <div>
                  <MarkdownText key={`recordcard_richtext-${record.id}`} text={record.text} uid={`recordcard-${record.id}`} suggestions={suggestions} />
                </div>
              </div>
              <div className="flex justify-between items-end pt-2">
                {/* <span className='datestamp-label'>Обновлено: {new Date(record.updated).toLocaleDateString()}</span> */}
                <span className='datestamp-label'>{new Date(record.created).toLocaleDateString()}</span>

                <div className="flex items-center">
                  {record.hidden && <div className='pr-4'>
                    <Icon
                      key={`icon_hidden_${record.id}`}
                      name='hidden'
                      className='icon-status'
                    />
                  </div>}
                  {editable && onEdit && <button className='pr-4' onClick={() => onEdit(record)}>
                    <Icon
                      key={`icon_edit_${record.id}`}
                      name='edit'
                      className='icon-button-accented'/>
                  </button>}
                  {label !== "" && <span
                    className={`card-label-container ${accented ? 'card-label-container-accented' : 'card-label-container-dimmed'}`}
                  >
                    {label}
                  </span>}
                </div>
              </div>
            </>}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {quest && !isEditing &&
        <Link to={`/quests/${record.questExt}`} >
          <div className={`record-card-quest-container ${accented ? 'record-card-quest-container-accented' : 'record-card-quest-container-dimmed'}`} >
            Квест: {quest.name}
          </div>
        </Link>
      }
    </motion.div>
  );
}

export default RecordCard;
