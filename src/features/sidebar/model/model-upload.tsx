'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadGithub } from '@/features/sidebar/services/modelUpload/upload-github';
import { uploadHuggingFace } from '@/features/sidebar/services/modelUpload/upload-huggingface';
import { uploadLocalFile } from '@/features/sidebar/services/modelUpload/upload-local-file';
import { messages } from '@/lib/messages';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';

/**
 * Component for uploading models from local files, GitHub, or Hugging Face.
 */
export const ModelUpload = () => {
  // Reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for drag-and-drop, selected files, and upload form fields
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [huggingFaceModelId, setHuggingFaceModelId] = useState('');
  const [huggingFaceTag, setHuggingFaceTag] = useState('');

  /**
   * Handles file drop event for local file upload.
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = [...e.dataTransfer.files];
    setSelectedFiles(files);
  };

  /**
   * Handles file input change event for local file upload.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = [...e.target.files];
      setSelectedFiles(files);
    }
  };

  /**
   * Resets all fields.
   */
  const handleReset = () => {
    setSelectedFiles([]);
    setGithubUrl('');
    setHuggingFaceModelId('');
    setHuggingFaceTag('');
  };

  /**
   * Handles the upload logic for local files, GitHub, or Hugging Face.
   * Shows appropriate toast messages for success or error.
   */
  const handleUpload = async () => {
    // Only one upload source can be selected at a time
    const optionsSelected = [
      selectedFiles.length > 0 ? 1 : 0,
      githubUrl ? 1 : 0,
      huggingFaceModelId ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    if (optionsSelected !== 1) {
      toast.error(messages.model.upload.selectOne);
      return;
    }

    setUploading(true);

    try {
      if (selectedFiles.length > 0) {
        // Local file upload
        const toastId = toast(messages.model.upload.started, {
          duration: Infinity,
        });
        await uploadLocalFile(selectedFiles[0]);
        toast.success(messages.model.upload.success(selectedFiles[0].name), {
          duration: 4000,
          id: toastId,
        });
      } else if (githubUrl) {
        // GitHub upload
        await uploadGithub(githubUrl);
        toast.success(messages.model.upload.githubSuccess(githubUrl));
      } else if (huggingFaceModelId) {
        // Hugging Face upload
        await uploadHuggingFace(huggingFaceModelId, huggingFaceTag);
        toast.success(
          messages.model.upload.huggingfaceSuccess(huggingFaceModelId),
        );
      }
      handleReset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(messages.model.upload.error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Toast notifications for upload status */}
      <Toaster position="bottom-right" />

      {/* GitHub upload section */}
      <div className="mb-4 flex items-center space-x-4">
        <Image
          alt="GitHub Logo"
          className="h-8 w-8"
          height={32}
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          width={32}
        />
        <Input
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder={messages.model.upload.githubPlaceholder}
          value={githubUrl}
        />
      </div>

      {/* Hugging Face upload section */}
      <div className="mb-4 flex items-center space-x-4">
        <Image
          alt="Hugging Face Logo"
          className="h-8 w-8"
          height={32}
          src="/images/huggingface_logo.svg"
          width={32}
        />
        <div className="flex-1">
          <Input
            onChange={(e) => setHuggingFaceModelId(e.target.value)}
            placeholder={messages.model.upload.huggingfaceIdPlaceholder}
            value={huggingFaceModelId}
          />
          <Input
            className="mt-2"
            onChange={(e) => setHuggingFaceTag(e.target.value)}
            placeholder={messages.model.upload.huggingfaceTagPlaceholder}
            value={huggingFaceTag}
          />
        </div>
      </div>

      {/* Local file upload section with drag-and-drop */}
      <div
        className={`flex h-32 cursor-pointer items-center justify-center rounded border-2 border-dashed transition ${
          dragActive ? 'border-primary bg-muted' : 'border-muted'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDrop={handleDrop}
      >
        {selectedFiles.length > 0 ? (
          <ul className="text-sm">
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            {messages.model.upload.localDropText}
          </p>
        )}
        <Input
          className="hidden"
          multiple
          onChange={handleChange}
          ref={fileInputRef}
          type="file"
        />
      </div>

      {/* Upload button */}
      <Button
        className="mt-4 w-full"
        disabled={uploading}
        onClick={handleUpload}
      >
        {uploading
          ? messages.model.upload.uploading
          : messages.model.upload.upload}
      </Button>
    </div>
  );
};
