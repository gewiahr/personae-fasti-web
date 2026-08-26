import { useEffect, useRef, useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { useNotifications } from '@/context/NotificationContext';
import { loadCurrentGameImageQuota, selectCurrentGameImageQuota } from '@/reducers/CurrentGameSlice';
import { selectAuthorization } from '@/reducers/PlayerSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import type { EntityImage } from '@/types/image';
import { api } from '@/utils/api';
import SubmitButton from './SubmitButton';
import StorageQuotaBar, { formatBytes } from './StorageQuotaBar';

interface ImageFileUploadProps {
  entityType: string;
  entityExt: string;
  onUploaded: () => Promise<void>;
}

const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const ImageFileUpload = ({ entityType, entityExt, onUploaded }: ImageFileUploadProps) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const quota = useAppSelector(selectCurrentGameImageQuota);
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<{ file: File; preview: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadEnabled = Boolean(quota?.uploadEnabled && quota.maxBytes > 0);
  const occupiedBytes = (quota?.usedBytes ?? 0) + (quota?.reservedBytes ?? 0);
  const availableBytes = Math.max(0, (quota?.maxBytes ?? 0) - occupiedBytes);

  useEffect(() => () => {
    if (selected) URL.revokeObjectURL(selected.preview);
  }, [selected]);

  const clearSelection = () => {
    setSelected(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectFile = (file: File) => {
    if (!uploadEnabled || !quota) return;
    if (!acceptedImageTypes.has(file.type)) {
      addNotification('Поддерживаются JPEG, PNG и WebP', 'error');
      return;
    }
    if (file.size > quota.maxFileBytes) {
      addNotification(`Файл не должен превышать ${formatBytes(quota.maxFileBytes)}`, 'error');
      return;
    }
    if (file.size > availableBytes) {
      addNotification('Для этого файла недостаточно места в хранилище игры', 'error');
      return;
    }
    setSelected({ file, preview: URL.createObjectURL(file) });
  };

  const upload = async () => {
    if (!selected || uploading) return;
    setUploading(true);
    const body = new FormData();
    body.append('file', selected.file);
    const response = await api.post<EntityImage>(
      `/entities/${entityType}/${entityExt}/images`,
      auth,
      body,
      true,
    );
    setUploading(false);

    if (response.error) {
      addNotification(response.error.data?.fields?.file ?? response.error.message, 'error');
      return;
    }

    clearSelection();
    await onUploaded();
    await dispatch(loadCurrentGameImageQuota({ auth }));
    addNotification('Изображение загружено', 'success');
  };

  return (
    <div className="space-y-3">
      <StorageQuotaBar
        usedBytes={quota?.usedBytes ?? 0}
        reservedBytes={quota?.reservedBytes ?? 0}
        maxBytes={quota?.maxBytes ?? 0}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={!uploadEnabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) selectFile(file);
        }}
      />

      <button
        type="button"
        aria-disabled={!uploadEnabled}
        tabIndex={uploadEnabled ? 0 : -1}
        className={`drag-area w-full ${dragging ? 'drag-area-active' : ''} ${uploadEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
        onClick={() => {
          if (uploadEnabled) fileInputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (uploadEnabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!uploadEnabled) return;
          const file = event.dataTransfer.files?.[0];
          if (file) selectFile(file);
        }}
      >
        {selected ? (
          <div className="flex flex-col items-center gap-2">
            <img src={selected.preview} alt="Предпросмотр загрузки" className="max-h-48 max-w-full rounded-lg object-contain" />
            <span className="max-w-full truncate text-sm">{selected.file.name}</span>
            <span className="text-xs text-(--color-gray)">{formatBytes(selected.file.size)}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm">
            <FiUpload className="size-8" />
            <span>{uploadEnabled ? 'Перетащите изображение или нажмите, чтобы выбрать' : 'Загрузка файлов недоступна'}</span>
            <span className="text-xs text-(--color-gray)">
              {uploadEnabled && quota
                ? `JPEG, PNG или WebP до ${formatBytes(quota.maxFileBytes)}`
                : quota === null ? 'Получаем квоту игры…' : 'Для игры не выделено место в хранилище'}
            </span>
          </div>
        )}
      </button>

      {selected && (
        <div className="flex gap-2">
          <SubmitButton className="flex flex-1 items-center justify-center gap-2" danger onClick={clearSelection}>
            <FiX /> Убрать
          </SubmitButton>
          <SubmitButton className="flex flex-1 items-center justify-center gap-2" disabled={uploading} onClick={upload}>
            <FiUpload /> {uploading ? 'Загружаем…' : 'Загрузить'}
          </SubmitButton>
        </div>
      )}
    </div>
  );
};
