import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import type { ApiError } from '../types/api';
import { useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';

interface Image {
  url: string;
  altText?: string;
};

interface UseImageProps {
  entityType: string;
  entityID: string;
};

const useImage = ({ entityType, entityID }: UseImageProps) => {
  const [image, setImage] = useState<Image | null>(null);
  const [ratio, setRatio] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const auth = useAppSelector(selectAuthorization);

  const { data, error: apiError } = useApi.get(`/image/${entityType}/${entityID}`, auth);

  useEffect(() => {
    if (!data) return;

    const fetchImageDetails = async () => {
      try {
        if (apiError === null && data !== "") {
          const img = new Image();
          img.src = data;
          
          img.onload = () => {
            setImage({
              url: data,
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
  }, [data, entityType]);

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
    status: data?.status || null
  };
};

export default useImage;