import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { useAuth } from './useAuth';
import { ApiError } from '../types/api';

interface Image {
  url: string;
  altText?: string;
  // Add other image properties you need
}

interface UseImageProps {
  entityType: string;
  entityID: string;
}

const useImage = ({ entityType, entityID }: UseImageProps) => {
  const { accessKey } = useAuth();

  const [image, setImage] = useState<Image | null>(null);
  const [ratio, setRatio] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const { data, error: apiError } = useApi.get(`/image/${entityType}/${entityID}`, accessKey);

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



// import { useState, useCallback, useEffect } from 'react';
// import { useApi } from './useApi';
// import { useAuth } from './useAuth';
// import { ApiError } from '../types/api';

// interface Image {
//   id?: string;
//   url: string;
//   altText?: string;
//   width?: number;
//   height?: number;
// }

// interface UseImageProps {
//   entityType: string;
//   entityID: string;
// }

// const useImage = ({ entityType, entityID }: UseImageProps) => {
//   const { accessKey } = useAuth();

//   const [image, setImage] = useState<Image | null>(null);
//   const [ratio, setRatio] = useState<number>(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<ApiError | null>(null); 

//   // Fetch image
//   const fetchImage = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data, error: apiError } = useApi.get(`/image/${entityType}/${entityID}`, accessKey);
      
//       if (apiError === null && data !== "") {
//         const img = new Image();
//         img.src = data;

//         await new Promise((resolve, reject) => {
//           img.onload = () => {
//             setImage({
//               id: `${entityType}_${entityID}`,
//               url: data,
//               altText: `${entityType} image`,
//               width: img.naturalWidth,
//               height: img.naturalHeight
//             });
//             setRatio(img.naturalWidth / img.naturalHeight);
//             resolve(true);
//           };
//           img.onerror = reject;
//         });
//       } else {
//         setImage(null);
//         setRatio(0);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error('Image fetch failed'));
//     } finally {
//       setLoading(false);
//     }
//   }, [entityType, entityID]);

//   // Upload image
//   const uploadImage = useCallback(async (file: File, altText?: string) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', file);
//       if (altText) formData.append('altText', altText);

//       // const response = await api.post(
//       //   `/${entityType}/${entityId}/image`,
//       //   formData,
//       //   {
//       //     headers: {
//       //       'Content-Type': 'multipart/form-data',
//       //     },
//       //   }
//       // );

//       const { data, status, error: apiError } = useApi.post(`/image/${entityType}/${entityID}`, accessKey); 

//       if (status === 201) {
//         await fetchImage(); // Refresh the image data
//         return data; // Return the full image object
//       }
//       throw new Error(apiError?.message || 'Upload failed');
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error('Image upload failed'));
//       throw err; // Re-throw for component-level handling
//     } finally {
//       setLoading(false);
//     }
//   }, [entityType, entityID, fetchImage]);

//   // // Delete image
//   // const deleteImage = useCallback(async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await api.delete(`/${entityType}/${entityId}/image`);
//   //     if (response.status === 204) {
//   //       setImage(null);
//   //       setRatio(0);
//   //     }
//   //   } catch (err) {
//   //     setError(err instanceof Error ? err : new Error('Image deletion failed'));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, [entityType, entityId, api]);

//   useEffect(() => {
//     fetchImage();
//   }, []); 

//   return {
//     // State
//     image,
//     ratio,
//     loading,
//     error,
    
//     // Actions
//     fetchImage,
//     uploadImage,
//     //deleteImage,
    
//     // Helpers
//     hasImage: !!image,
//     isPortrait: ratio ? ratio < 1 : false,
//     isLandscape: ratio ? ratio > 1 : false,
//   };
// };

// export default useImage;