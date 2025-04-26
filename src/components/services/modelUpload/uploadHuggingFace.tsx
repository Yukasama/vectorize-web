export const uploadHuggingFace = async (modelId: string, tag: string) => {
  const response = await fetch('/load', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model_id: modelId, tag }),
  });

  if (!response.ok) {
    throw new Error('Hugging Face-Upload fehlgeschlagen');
  }

  return await response.json();
};
