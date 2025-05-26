import axios from 'axios';

interface Model {
  id: string;
  name: string;
}

interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalpages: number;
}

export const fetchModels = async (): Promise<Model[]> => {
  try {
    const response = await axios.get<PagedResponse<Model>>(
      'http://localhost:8000/v1/models?page=1&size=100',
    );
    return response.data.items;
  } catch (error) {
    console.error('Fehler beim Abrufen der Modelle:', error);
    return [];
  }
};
