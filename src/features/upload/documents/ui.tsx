import { cn } from "@/lib/utils.ts";
import { invoke } from "@withease/factories";
import { useUnit } from "effector-react";
import { File as FileIcon, FileUp, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import { DocumentFile, UploadDocumentsProps, uploadDocumentsFactory } from "./model";

export interface UploadDocumentsComponentProps extends UploadDocumentsProps {
  className?: string;
  title?: string;
  disabled?: boolean;
}

export const UploadDocuments = (props: UploadDocumentsComponentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Создаем экземпляр фабрики через invoke
  const scope = invoke(uploadDocumentsFactory, props);

  // Получаем события и сторы из фабрики
  const [
    fileSelected,
    deleteFile,
    setEntityParams,
    filesInitialized,
    files,
    isUploading,
    uploadError,
  ] = useUnit([
    scope.fileSelected,
    scope.deleteFile,
    scope.setEntityParams,
    scope.filesInitialized,
    scope.$files,
    scope.$isUploading,
    scope.$uploadError,
  ]);

  useEffect(() => {
    setEntityParams({
      entityId: props.entityId,
      entityType: props.entityType,
      fileType: props.fileType,
    });

    if (props.initialFiles) {
      filesInitialized(props.initialFiles);
    }
  }, [props.entityId, props.entityType, props.fileType, props.initialFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      fileSelected(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFile(fileId);
  };

  const getFileIcon = (file: DocumentFile) => {
    if (file.type.startsWith("image/")) {
      return <img src={file.url} alt={file.name} className="w-10 h-10 object-cover rounded" />;
    }
    return <FileIcon className="w-10 h-10 text-primary" />;
  };

  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>
          {props.title || (props.fileType === "certificate" ? "Сертификаты" : "Документы")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadError && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {uploadError}
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-md bg-background"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={props.disabled}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
            isUploading || props.disabled
              ? "opacity-50 pointer-events-none"
              : "hover:border-primary/50 hover:bg-muted/50",
          )}
          onClick={props.disabled ? undefined : handleUploadClick}
        >
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
          ) : (
            <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
          )}
          <span className="text-sm text-muted-foreground">
            {isUploading ? "Загрузка..." : "Нажмите для загрузки файла"}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            PDF, DOC, DOCX, JPG, PNG до 10MB
          </span>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            disabled={isUploading || props.disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};
