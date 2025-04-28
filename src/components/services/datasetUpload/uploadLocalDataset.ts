export const uploadLocalDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/datasets', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text(); // Server-Fehlermeldung lesen
    throw new Error(`Datensatz-Upload fehlgeschlagen: ${errorText}`);
  }

  return await response.json();
};
