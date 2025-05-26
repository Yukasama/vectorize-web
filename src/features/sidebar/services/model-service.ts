import axios from 'axios';

interface Model {
  id: string;
  name: string;
}

export const fetchModels = async (): Promise<Model[]> => {
  try {
    const response = await axios.get<Model[]>('/data/models.json');
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Modelle:', error);
    return [];
  }
};
