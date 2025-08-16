import React, { useCallback, useState } from 'react';
import { Upload, X, File, Image, AlertCircle } from 'lucide-react';
import Button from './Button';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesChange: (files: UploadedFile[]) => void;
  className?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  multiple = false,
  maxSize = 5,
  maxFiles = 5,
  onFilesChange,
  className = '',
  disabled = false
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `Le fichier est trop volumineux (max ${maxSize}MB)`;
    }
    return null;
  };

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);
      const id = Math.random().toString(36).substr(2, 9);
      
      const uploadedFile: UploadedFile = {
        id,
        file,
        error
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
          setFiles(prev => prev.map(f => f.id === id ? uploadedFile : f));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    });

    const updatedFiles = multiple 
      ? [...files, ...newFiles].slice(0, maxFiles)
      : newFiles.slice(0, 1);
    
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, multiple, maxFiles, maxSize, onFilesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  }, [disabled, processFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {dragActive ? 'Déposez vos fichiers ici' : 'Glissez vos fichiers ici'}
          </p>
          <p className="text-sm text-gray-500">
            ou <span className="text-blue-600 font-medium">parcourez</span> vos fichiers
          </p>
          <p className="text-xs text-gray-400">
            {accept} • Max {maxSize}MB {multiple && `• ${maxFiles} fichiers max`}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className={`
                flex items-center p-3 bg-gray-50 rounded-lg border
                ${uploadedFile.error ? 'border-red-200 bg-red-50' : 'border-gray-200'}
              `}
            >
              {/* File Preview/Icon */}
              <div className="flex-shrink-0 mr-3">
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    {getFileIcon(uploadedFile.file)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {uploadedFile.error && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                    <p className="text-xs text-red-600">{uploadedFile.error}</p>
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(uploadedFile.id)}
                icon={<X className="w-4 h-4" />}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;