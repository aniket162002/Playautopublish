import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, CheckCircle } from 'lucide-react';

interface UploadZoneProps {
  accept: { [key: string]: string[] };
  multiple?: boolean;
  onDrop: (files: File[]) => void;
  title: string;
  description: string;
  files: File[];
}

const UploadZone: React.FC<UploadZoneProps> = ({
  accept,
  multiple = false,
  onDrop,
  title,
  description,
  files
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    return FileText;
  };

  return (
    <div className="space-y-4">
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/50'
        }`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center"
        >
          <Upload className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-sm text-gray-500">
          <span className="font-medium text-indigo-600">Click to browse</span> or drag and drop
        </div>
      </motion.div>

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file);
            return (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl border border-white/30"
              >
                <FileIcon className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default UploadZone;