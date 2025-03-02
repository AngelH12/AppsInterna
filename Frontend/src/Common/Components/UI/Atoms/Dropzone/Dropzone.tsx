import React, { useState } from 'react';
import { NotificationType, showNotifications } from "helpers/toas_notification";
import { t } from 'i18next';

interface DropzoneProps {
  onUpload?: (file: File) => void;
  maxFileSize?: number; // en bytes
  acceptedFormats?: string[];
  placeholderText?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onUpload,
  maxFileSize = 2 * 1024 * 1024, 
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
  placeholderText = 'Sube una imagen',
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!acceptedFormats.includes(file.type)) {
      showNotifications(
        NotificationType.ERROR,
        t("notificationsMessages.error") 
      );
      return;
    }

    if (file.size > maxFileSize) {
      showNotifications(
        NotificationType.ERROR,
        t("notificationsMessages.error")
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setFileName(file.name);
      onUpload?.(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFileName(null);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{placeholderText}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG o JPG 
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {preview && (
        <div className="mt-4 flex flex-col items-center">
          <div className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">{fileName}</p>
        </div>
      )}
    </div>
  );
};
