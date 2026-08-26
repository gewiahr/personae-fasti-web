import { useState } from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { EntityImage } from '@/types/image';
import SubmitButton from './SubmitButton';

interface EntityImageItemProps {
  image: EntityImage;
  onSetMain: (imageExt: string) => void;
  onDelete: (imageExt: string) => void;
}

const imageClassName = 'aspect-square w-full select-none bg-gray-800 object-cover';

export const DesktopEntityImageItem = ({ image, onSetMain, onDelete }: EntityImageItemProps) => (
  <div
    className={`group relative hidden overflow-hidden rounded-lg border sm:block ${image.isMain ? 'border-(--color-accent)' : 'border-gray-700'}`}
  >
    <img
      src={image.thumbnailUrl || image.url}
      alt="Изображение сущности"
      className={imageClassName}
    />

    {image.isMain ? (
      <span className="absolute left-2 top-2 flex h-8 select-none items-center gap-1.5 rounded-md border border-gray-500 bg-black/70 px-2 text-sm">
        <FiCheck className="size-4" />
        Основное
      </span>
    ) : (
      <button
        type="button"
        aria-label="Сделать изображение основным"
        onClick={() => onSetMain(image.ext)}
        className="group/button absolute left-2 top-2 flex h-8 max-w-8 cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-md border border-gray-500 bg-black/70 px-[7px] text-sm transition-all duration-200 hover:max-w-48 hover:gap-1.5 hover:border-(--color-accent) hover:bg-(--color-accent) focus-visible:max-w-48 focus-visible:gap-1.5 focus-visible:border-(--color-accent) focus-visible:bg-(--color-accent)"
      >
        <FiCheck className="size-4 shrink-0" />
        <span className="opacity-0 transition-opacity duration-200 group-hover/button:opacity-100 group-focus-visible/button:opacity-100">
          Сделать основным
        </span>
      </button>
    )}

    <button
      type="button"
      aria-label="Удалить изображение"
      onClick={() => onDelete(image.ext)}
      className="pointer-events-none absolute bottom-2 right-2 flex cursor-pointer items-center gap-1.5 rounded-md bg-black/75 px-3 py-2 text-sm text-(--color-text-danger) opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-(--color-button-danger) hover:text-white focus-visible:pointer-events-auto focus-visible:opacity-100"
    >
      <FiTrash2 />
      Удалить
    </button>
  </div>
);

export const MobileEntityImageItem = ({ image, onSetMain, onDelete }: EntityImageItemProps) => {
  const [actionsVisible, setActionsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className={`relative overflow-hidden rounded-lg border sm:hidden ${image.isMain ? 'border-(--color-accent)' : 'border-gray-700'}`}>
      <button
        type="button"
        className="relative block w-full"
        aria-expanded={actionsVisible}
        aria-label={actionsVisible ? 'Скрыть действия с изображением' : 'Показать действия с изображением'}
        onClick={() => setActionsVisible((visible) => !visible)}
      >
        <img
          src={image.thumbnailUrl || image.url}
          alt="Изображение сущности"
          className={imageClassName}
        />
        {image.isMain && (
          <span className="absolute left-2 top-2 flex select-none items-center gap-1 rounded-md border border-gray-500 bg-black/70 px-2 py-1 text-xs">
            <FiCheck /> Основное
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {actionsVisible && (
        <motion.div
          key="mobile-image-actions"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 bg-black/65 p-3"
        >
          <SubmitButton
            className="flex w-full items-center justify-center gap-2"
            disabled={image.isMain}
            onClick={() => onSetMain(image.ext)}
          >
            <FiCheck />
            {image.isMain ? 'Основное' : 'Сделать основным'}
          </SubmitButton>
          <SubmitButton
            className="flex w-full items-center justify-center gap-2"
            danger
            onClick={() => onDelete(image.ext)}
          >
            <FiTrash2 />
            Удалить
          </SubmitButton>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
