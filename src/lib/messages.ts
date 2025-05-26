export const messages = {
  dataset: {
    delete: {
      cancel: 'Cancel',
      confirm: 'Delete',
      dialogDescription: (name: string) =>
        `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      dialogTitle: 'Delete dataset',
      error: 'Error deleting dataset.',
      success: (name: string) => `Dataset "${name}" deleted successfully.`,
    },
    general: {
      unknownError: 'An unknown error occurred with the dataset.',
    },
    upload: {
      addNew: 'Add new dataset',
      allSuccess: 'All files were uploaded successfully!',
      alreadyExists: 'Dataset already exists.',
      done: 'Done',
      error: 'Error uploading dataset.',
      errorFile: (name: string) => `Error uploading ${name}.`,
      localDropText: 'Drop dataset files here or click to select.',
      noFiles: 'No files uploaded.',
      onlyZip: 'Only ZIP archives are supported for datasets.',
      remove: 'Remove',
      save: 'Save',
      selectFile: 'Please select at least one file.',
      success: (name: string) => `Dataset "${name}" uploaded successfully.`,
      upload: 'Upload',
      uploadDialogDescription:
        'Select a dataset file to upload or drag it here.',
      uploadDialogTitle: 'Upload Dataset',
      uploading: 'Uploading...',
      waitForUploads: 'Please wait until all uploads are complete.',
    },
  },
  model: {
    delete: {
      error: 'Error deleting model.',
      success: (name: string) => `Model "${name}" deleted successfully.`,
    },
    general: {
      unknownError: 'An unknown error occurred with the model.',
    },
    upload: {
      alreadyExists: 'Model already exists.',
      error: 'Error uploading model.',
      fileError: 'Error uploading model file.',
      fileSuccess: (name: string) =>
        `Model file "${name}" uploaded successfully.`,
      githubError: 'Error uploading model from GitHub.',
      githubNotFound: (repo: string, branch: string) =>
        `GitHub repository "${repo}" with branch "${branch}" does not exist or contains no model file.`,
      githubPlaceholder: 'Enter GitHub repository URL',
      githubSuccess: (url: string) =>
        `Model from GitHub URL "${url}" will be uploaded.`,
      huggingfaceError: 'Error uploading model from Hugging Face.',
      huggingfaceIdPlaceholder: 'Enter Hugging Face model ID',
      huggingfaceSuccess: (id: string) =>
        `Model from Hugging Face ID "${id}" will be uploaded.`,
      huggingfaceTagPlaceholder: 'Tag (optional)',
      localDropText: 'Drop model files here or click to select.',
      onlyZip: 'Only ZIP archives are supported for models.',
      selectOne:
        'Please select only one option (file, GitHub URL, or Hugging Face model ID).',
      started: 'Upload started...',
      success: (name: string) => `Model "${name}" uploaded successfully.`,
      upload: 'Upload',
      uploadDialogDescription:
        'Select a model file to upload, enter a GitHub URL, or a Hugging Face model ID.',
      uploadDialogTitle: 'Upload Model',
      uploading: 'Uploading...',
    },
  },
};
