import { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';

interface ImageUploadProps {
  entityType: string;
  entityID: string;
};

export const ImageUpload = ({ entityType, entityID } : ImageUploadProps) => {
  const fileMaxSize = 4 * 1024 * 1024

  const [file, setFile] = useState<{ file: File; preview: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addNotification } = useNotifications();
  const { accessKey } = useAuth();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Process selected file
  const processFile = (newFile: File) => {
    if (!newFile.type.startsWith('image/')) {
      addNotification('Загружаемый файл не является изображением', 'error');
      return;
    }

    if (newFile.size > fileMaxSize) { 
      addNotification('Размер файла должен быть не больше 4MB', 'error');
      return;
    }

    // Clear previous file if exists
    if (file) {
      URL.revokeObjectURL(file.preview);
    }

    setFile({
      file: newFile,
      preview: URL.createObjectURL(newFile)
    });
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Remove file
  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
      setFile(null);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async () => {
    if (file === null) return
    const formData = new FormData();
    formData.append('file', file.file);
    const response = await api.post(`/image/${entityType}/${entityID}`, accessKey, formData, true);
    if (response.error) {
      addNotification(`Ошибка загрузки изображения: ${response.error.message}`, "error");
    } else if (response.status === 201) {
      addNotification(`Изображение загружено`, "success");
    } else {
      addNotification(`Что-то пошло не так`, "warning");
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <img
              src={file.preview}
              alt="Preview"
              className="max-h-40 max-w-full object-contain rounded-lg"
            />
            <p className="text-sm text-gray-600 truncate max-w-full">
              {file.file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <FiUpload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragging ? 'Переместите изображение сюда' : 'Перетяните или нажмите чтобы выбрать изображение'}
            </p>
            <p className="text-xs text-gray-500">Допустимы форматы JPG, PNG до 5MB</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        {file && (
          <button
            type="button"
            onClick={removeFile}
            className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <FiX className="w-4 h-4" />
            <span>Удалить</span>
          </button>
        )}
        {file && (
          <button
            type="button"
            onClick={triggerFileInput}
            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <FiUpload className="w-4 h-4" />
            <span>Заменить</span>
          </button>
        )}
      </div>

      {/* Upload button (example) */}
      {file && (
        <button
          type="button"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          onClick={uploadImage}
        >
          Загрузить
        </button>
      )}
    </div>
  );
}

export default ImageUpload