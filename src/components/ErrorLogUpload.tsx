'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface ErrorLogUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  uploadError?: string;
}

export default function ErrorLogUpload({ onUpload, isUploading = false, uploadError }: ErrorLogUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setSelectedFile(file);
        onUpload(file);
      }
    }
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onUpload(file);
    }
  }, [onUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-[#6d5cff] bg-[#6d5cff]/5'
            : 'border-gray-600 hover:border-[#6d5cff]/50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d5cff]"></div>
          ) : selectedFile ? (
            <CheckCircle className="h-12 w-12 text-[#34d399]" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}

          <div>
            <h3 className="text-lg font-medium text-[#fafafa] mb-2">
              {isUploading
                ? 'Uploading error log...'
                : selectedFile
                ? 'File uploaded successfully'
                : 'Upload Integration Error Log'}
            </h3>
            <p className="text-gray-400 text-sm">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : 'Drag and drop your JSON error log file here, or click to browse'}
            </p>
          </div>

          {!selectedFile && !isUploading && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <FileText className="h-4 w-4" />
              <span>Supports JSON files only</span>
            </div>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{uploadError}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <h4 className="text-sm font-medium text-[#fafafa] mb-2">What happens next?</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-[#6d5cff]/20 rounded-full flex items-center justify-center">
              <span className="text-[#6d5cff] font-medium">1</span>
            </div>
            <span>AI analyzes your error log</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-[#a78bfa]/20 rounded-full flex items-center justify-center">
              <span className="text-[#a78bfa] font-medium">2</span>
            </div>
            <span>Identifies root causes</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-[#34d399]/20 rounded-full flex items-center justify-center">
              <span className="text-[#34d399] font-medium">3</span>
            </div>
            <span>Provides actionable fixes</span>
          </div>
        </div>
      </div>
    </div>
  );
}