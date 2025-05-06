'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { ChevronDown, ChevronUp, Menu, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DatasetUpload } from './dataset-upload';
import { ModelUpload } from './model-upload';

interface Dataset {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
}

export const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [modelSearch, setModelSearch] = useState('');
  const [datasetSearch, setDatasetSearch] = useState('');
  const [modelsDropdownOpen, setModelsDropdownOpen] = useState(false);
  const [datasetsDropdownOpen, setDatasetsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get<Model[]>(
          'http://localhost:8000/v1/models',
        );
        setModels(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Modelle:', error);
        setModels([]);
      }
    };

    const fetchDatasets = async () => {
      try {
        const response = await axios.get<Dataset[]>(
          'http://localhost:8000/v1/datasets',
        );
        setDatasets(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Datensätze:', error);
        setDatasets([]);
      }
    };

    void fetchModels();
    void fetchDatasets();
  }, []);

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase()),
  );

  const filteredDatasets = datasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(datasetSearch.toLowerCase()),
  );

  return (
    <div
      className={`bg-accent h-full text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center justify-end p-2">
        <h2
          className={`text-lg font-semibold transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        ></h2>
        <Button onClick={() => setIsOpen(!isOpen)} variant="ghost">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-full">
        {/* Modelle Dropdown */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3
                className={`text-md font-semibold transition-opacity duration-300 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Modelle
              </h3>
              {isOpen && <ModelUpload />}
            </div>
            <Button
              onClick={() => setModelsDropdownOpen(!modelsDropdownOpen)}
              variant="ghost"
            >
              {modelsDropdownOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          {modelsDropdownOpen && isOpen && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder="Modelle durchsuchen"
                  value={modelSearch}
                />
              </div>
              <div className="mt-4 space-y-2">
                {filteredModels.map((model) => (
                  <div
                    className="rounded bg-gray-700 p-2 text-sm"
                    key={model.id}
                  >
                    {model.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Datensätze Dropdown */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3
                className={`text-md font-semibold transition-opacity duration-300 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Datensätze
              </h3>
              {isOpen && <DatasetUpload />}
            </div>
            <Button
              onClick={() => setDatasetsDropdownOpen(!datasetsDropdownOpen)}
              variant="ghost"
            >
              {datasetsDropdownOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          {datasetsDropdownOpen && isOpen && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input
                  onChange={(e) => setDatasetSearch(e.target.value)}
                  placeholder="Datensätze durchsuchen"
                  value={datasetSearch}
                />
              </div>
              <div className="mt-4 space-y-2">
                {filteredDatasets.map((dataset) => (
                  <div
                    className="rounded bg-gray-700 p-2 text-sm"
                    key={dataset.id}
                  >
                    {dataset.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
