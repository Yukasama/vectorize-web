import axios from 'axios';

export interface Dataset {
  classification?: string;
  created_at?: string;
  file_name?: string;
  id: string;
  name: string;
  rows?: number;
}

export const fetchDatasets = async (): Promise<Dataset[]> => {
  try {
    const response = await axios.get<Dataset[]>(
      'http://localhost:8000/v1/datasets',
    );
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Datensätze:', error);
    return [];
  }
};

export const fetchDatasetById = async (
  id: string,
): Promise<Dataset | undefined> => {
  try {
    const response = await axios.get<Dataset>(
      `http://localhost:8000/v1/datasets/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen des Datensatzes:', error);
    return undefined;
  }
};

export const deleteDataset = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`http://localhost:8000/v1/datasets/${id}`);
    return true;
  } catch (error) {
    console.error('Fehler beim Löschen des Datensatzes:', error);
    return false;
  }
};
