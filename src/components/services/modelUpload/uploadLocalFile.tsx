export const uploadLocalFile = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch('/models', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Datei-Upload fehlgeschlagen');
  }

  return await response.json();
};
