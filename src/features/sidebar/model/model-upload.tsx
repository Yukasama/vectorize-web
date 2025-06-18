'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadGithub } from '@/features/sidebar/services/modelUpload/upload-github';
import { uploadHuggingFace } from '@/features/sidebar/services/modelUpload/upload-huggingface';
import { uploadLocalFile } from '@/features/sidebar/services/modelUpload/upload-local-file';
import { messages } from '@/lib/messages';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

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
  const [huggingFaceModelId, setHuggingFaceModelId] = useState('');
  const [huggingFaceTag, setHuggingFaceTag] = useState('');

  // State
  const [githubOwner, setGithubOwner] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubRevision, setGithubRevision] = useState('');

  // Handles file drop event for local file upload.
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = [...e.dataTransfer.files];
    setSelectedFiles(files);
  };

  // Handles file input change event for local file upload.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = [...e.target.files];
      setSelectedFiles(files);
    }
  };

  // Resets all fields.
  const resetForm = () => {
    setSelectedFiles([]);
    setHuggingFaceModelId('');
    setHuggingFaceTag('');
    setGithubOwner('');
    setGithubRepo('');
    setGithubRevision('');
  };

  // Handles the upload logic for local files, GitHub, or Hugging Face.
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only one upload source can be selected at a time
    const optionsSelected = [
      selectedFiles.length > 0 ? 1 : 0,
      githubOwner && githubRepo ? 1 : 0,
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
      } else if (githubOwner && githubRepo) {
        // GitHub upload
        await uploadGithub(githubOwner, githubRepo, githubRevision);
        toast.success(
          messages.model.upload.githubSuccess(
            `${githubOwner}/${githubRepo}${
              githubRevision ? '@' + githubRevision : ''
            }`,
          ),
        );
      } else if (huggingFaceModelId) {
        // Hugging Face upload
        await uploadHuggingFace(huggingFaceModelId, huggingFaceTag);
        toast.success(
          messages.model.upload.huggingfaceSuccess(huggingFaceModelId),
        );
      }
      resetForm();
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
    <form
      className="flex max-h-[520px] min-h-[350px] flex-col overflow-y-auto"
      onSubmit={handleUpload}
    >
      {/* GitHub upload section */}
      <div className="mt-2 mb-6 flex items-center gap-x-1 gap-y-0">
        <Image
          alt="GitHub Logo"
          className="h-8 w-8"
          height={32}
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          width={32}
        />
        <Input
          className="w-27"
          onChange={(e) => setGithubOwner(e.target.value)}
          placeholder="owner"
          value={githubOwner}
        />
        <span className="text-muted-foreground">/</span>
        <Input
          className="w-27"
          onChange={(e) => setGithubRepo(e.target.value)}
          placeholder="repo"
          value={githubRepo}
        />
        <Input
          className="w-20"
          onChange={(e) => setGithubRevision(e.target.value)}
          placeholder="branch"
          value={githubRevision}
        />
      </div>

      {/* Hugging Face upload section */}
      <div className="mt-2 mb-6 flex items-center gap-x-1 gap-y-0">
        <Image
          alt="Hugging Face Logo"
          className="h-8 w-8"
          height={32}
          src="/images/huggingface_logo.svg"
          width={32}
        />
        <Input
          className="w-80 min-w-0"
          onChange={(e) => setHuggingFaceModelId(e.target.value)}
          placeholder={messages.model.upload.huggingfaceIdPlaceholder}
          value={huggingFaceModelId}
        />
        <Input
          className="w-15"
          maxLength={8}
          onChange={(e) => setHuggingFaceTag(e.target.value)}
          placeholder={messages.model.upload.huggingfaceTagPlaceholder}
          value={huggingFaceTag}
        />
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
      <div className="flex-1" />
      <Button
        className="mt-4 w-full"
        disabled={uploading}
        style={{ marginTop: 'auto' }}
        type="submit"
      >
        {uploading
          ? messages.model.upload.uploading
          : messages.model.upload.upload}
      </Button>
    </form>
  );
};
