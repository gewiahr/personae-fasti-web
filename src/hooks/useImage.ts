import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import type { ApiError } from '../types/api';
import { useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import type { EntityImageList } from '@/types/image';

interface Image {
  url: string;
  altText?: string;
};

interface UseImageProps {
  entityType: string;
  entityExt: string;
};

const useImage = ({ entityType, entityExt }: UseImageProps) => {
  const [image, setImage] = useState<Image | null>(null);
  const [ratio, setRatio] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const auth = useAppSelector(selectAuthorization);

  const { data, error: apiError } = useApi.get<EntityImageList>(
    `/entities/${entityType}/${entityExt}/images`,
    auth,
    [entityType, entityExt],
    !entityExt,
  );

  useEffect(() => {
    if (!data) return;

    const fetchImageDetails = async () => {
      try {
        const mainImage = data.images.find((candidate) => candidate.isMain) ?? data.images[0];
        if (!apiError && mainImage?.url) {
          const img = new Image();
          img.src = mainImage.url;
          
          img.onload = () => {
            setImage({
              url: mainImage.url,
              altText: `${entityType} image`
            });
            setRatio(img.naturalWidth / img.naturalHeight);
            setDimensions({
              width: img.naturalWidth,
              height: img.naturalHeight
            });
            setLoading(false);
          };

          img.onerror = () => {
            setImage(null);
            setRatio(0);
            setDimensions(null);
            setLoading(false);
          };
        } else {
          setImage(null);
          setRatio(0);
          setDimensions(null);
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load image'));
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [data, apiError, entityType]);

  useEffect(() => {
    if (apiError) {
      setError(apiError);
      setLoading(false);
    }
  }, [apiError]);

  return {
    image,
    ratio,
    dimensions,
    loading,
    error,
    status: null
  };
};

export default useImage;
