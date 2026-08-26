import { useEffect, useState } from 'react';
import { FiLink } from 'react-icons/fi';
import { useNotifications } from '@/context/NotificationContext';
import { selectAuthorization } from '@/reducers/PlayerSlice';
import { useAppSelector } from '@/store';
import type { EntityImage, EntityImageList } from '@/types/image';
import { api } from '@/utils/api';
import { InputField } from './Inputs/InputField';
import SubmitButton from './SubmitButton';
import { DesktopEntityImageItem, MobileEntityImageItem } from './EntityImageItem';
import { ImageFileUpload } from './ImageFileUpload';

interface ImageUploadProps {
  entityType: string;
  entityExt: string;
}

const validateImageURL = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Введите ссылку на изображение';
  if ([...trimmed].length > 2048) return 'Ссылка не может быть длиннее 2048 символов';

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.username || parsed.password) {
      return 'Введите абсолютную HTTPS-ссылку';
    }
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '');
    if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
      return 'Локальные адреса недоступны';
    }
    const ipv4 = hostname.split('.').map(Number);
    const isPrivateIPv4 = ipv4.length === 4 && ipv4.every((part) => Number.isInteger(part) && part >= 0 && part <= 255) && (
      ipv4[0] === 10 ||
      ipv4[0] === 127 ||
      (ipv4[0] === 169 && ipv4[1] === 254) ||
      (ipv4[0] === 172 && ipv4[1] >= 16 && ipv4[1] <= 31) ||
      (ipv4[0] === 192 && ipv4[1] === 168) ||
      ipv4[0] === 0
    );
    const isPrivateIPv6 = hostname === '::1' || hostname === '::' || /^fe[89ab][0-9a-f]?:/i.test(hostname) || /^f[cd][0-9a-f]{0,2}:/i.test(hostname);
    if (isPrivateIPv4 || isPrivateIPv6) return 'Локальные адреса недоступны';
  } catch {
    return 'Введите абсолютную HTTPS-ссылку';
  }

  return undefined;
};

export const ImageUpload = ({ entityType, entityExt }: ImageUploadProps) => {
  const auth = useAppSelector(selectAuthorization);
  const { addNotification } = useNotifications();
  const [images, setImages] = useState<EntityImage[]>([]);
  const [url, setURL] = useState('');
  const [error, setError] = useState<string>();
  const [previewReady, setPreviewReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const endpoint = `/entities/${entityType}/${entityExt}/images`;

  const loadImages = async () => {
    setLoading(true);
    const response = await api.get<EntityImageList>(endpoint, auth);
    if (response.error) {
      addNotification(response.error.message, 'error');
    } else {
      setImages(response.data?.images ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadImages();
  }, [entityType, entityExt, auth]);

  const handleURLChange = (value: string) => {
    setURL(value);
    setPreviewReady(false);
    if (error) setError(validateImageURL(value));
  };

  const addExternalImage = async () => {
    const validationError = validateImageURL(url);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!previewReady) {
      setError('Не удалось загрузить изображение по этой ссылке');
      return;
    }

    setSaving(true);
    const response = await api.post<EntityImage>(`${endpoint}/external`, auth, { url: url.trim() });
    setSaving(false);
    if (response.error) {
      setError(response.error.data?.fields?.url ?? response.error.message);
      return;
    }

    setURL('');
    setError(undefined);
    setPreviewReady(false);
    await loadImages();
    addNotification('Изображение добавлено', 'success');
  };

  const setMain = async (imageExt: string) => {
    const response = await api.patch<EntityImage>(`/images/${imageExt}/main`, auth, {});
    if (response.error) {
      addNotification(response.error.message, 'error');
      return;
    }
    setImages((current) => current.map((image) => ({ ...image, isMain: image.ext === imageExt })));
  };

  const deleteImage = async (imageExt: string) => {
    const response = await api.delete(`/images/${imageExt}`, auth);
    if (response.error) {
      addNotification(response.error.message, 'error');
      return;
    }
    await loadImages();
    addNotification('Изображение удалено', 'success');
  };

  const normalizedURL = url.trim();
  const canPreview = !validateImageURL(normalizedURL);

  return (
    <div className="space-y-4">
      <ImageFileUpload entityType={entityType} entityExt={entityExt} onUploaded={loadImages} />

      <div className="flex items-center gap-3 py-1 text-sm text-(--color-gray)">
        <span className="h-px flex-1 bg-(--color-gray) opacity-40" />
        <span>или добавьте по ссылке</span>
        <span className="h-px flex-1 bg-(--color-gray) opacity-40" />
      </div>

      <InputField
        label="Ссылка на изображение"
        htmlType="url"
        value={url}
        maxLength={2048}
        error={error}
        entityEdit={{ handleFieldChange: handleURLChange }}
      />

      {canPreview && normalizedURL && (
        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
          <img
            key={normalizedURL}
            src={normalizedURL}
            alt="Предпросмотр изображения"
            className="max-h-64 w-full object-contain"
            onLoad={() => {
              setPreviewReady(true);
              setError(undefined);
            }}
            onError={() => {
              setPreviewReady(false);
              setError('Не удалось загрузить изображение по этой ссылке');
            }}
          />
        </div>
      )}

      <SubmitButton
        className="flex w-full items-center justify-center gap-2"
        onClick={addExternalImage}
        disabled={saving || !previewReady}
      >
        <FiLink />
        {saving ? 'Добавляем…' : 'Добавить по ссылке'}
      </SubmitButton>

      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((image) => (
            <div key={image.ext}>
              <DesktopEntityImageItem image={image} onSetMain={setMain} onDelete={deleteImage} />
              <MobileEntityImageItem image={image} onSetMain={setMain} onDelete={deleteImage} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
