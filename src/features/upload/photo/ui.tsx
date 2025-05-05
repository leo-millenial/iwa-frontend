import { cn } from "@/lib/utils.ts";
import { invoke } from "@withease/factories";
import { useUnit } from "effector-react";
import { UploadCloud, X } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/shared/ui/button";

import { UploadPhotoProps, uploadPhotoFactory } from "./model";

type UploadPhotoComponentProps = UploadPhotoProps & {
  className?: string;
  buttonText?: string;
  disabled?: boolean;
};

export const UploadPhoto = (props: UploadPhotoComponentProps) => {
  // Извлекаем только те пропсы, которые нужны для фабрики

  const factoryProps: UploadPhotoProps = {
    entityId: props.entityId,
    entityType: props.entityType,
    fileType: props.fileType,
    onSuccess: props.onSuccess,
  };

  // Используем invoke для создания экземпляра фабрики с нужными параметрами
  const scope = invoke(uploadPhotoFactory, factoryProps);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Используем useUnit для получения состояний и событий из фабрики
  const {
    $isUploading: isUploading,
    $uploadError: uploadError,
    $previewUrl: previewUrl,
    $uploadResult: uploadResult,
    photoSelected: handlePhotoSelect,
    uploadReset: handleReset,
  } = useUnit(scope);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handlePhotoSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearClick = () => {
    handleReset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center", props.className)}>
      <input
        disabled={props.disabled}
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {previewUrl && !uploadResult && (
        <div className="relative mb-4 w-full">
          <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-md" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleClearClick}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploadResult && (
        <div className="relative mb-4 w-full">
          <img
            src={uploadResult.url}
            alt="Uploaded"
            className="w-full h-40 object-cover rounded-md"
          />
          <Button
            disabled={props.disabled}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleClearClick}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploadError && <div className="text-sm text-red-500 mb-2 w-full">{uploadError}</div>}

      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={isUploading || props.disabled}
        className="w-full"
      >
        {isUploading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Загрузка...
          </span>
        ) : uploadResult ? (
          <span className="flex items-center">
            <svg
              className="mr-2 h-4 w-4 text-green-500"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Загружено
          </span>
        ) : (
          <span className="flex items-center">
            <UploadCloud className="mr-2 h-4 w-4" />
            {props.buttonText || "Загрузить фото"}
          </span>
        )}
      </Button>
    </div>
  );
};
