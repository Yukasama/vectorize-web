import axios from 'axios';

interface Dataset {
  id: string;
  name: string;
}

export const fetchDatasets = async (): Promise<Dataset[]> => {
  try {
    const response = await axios.get<Dataset[]>('/data/datasets.json');
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Datensätze:', error);
    return [];
  }
};

export const addDataset = async (dataset: Dataset): Promise<void> => {
  try {
    const response = await axios.post('/datasets.json', dataset);
    console.log('Datensatz hinzugefügt:', response.data);
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Datensatzes:', error);
  }
};
