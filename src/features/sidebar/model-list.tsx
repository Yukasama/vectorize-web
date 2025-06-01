import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ModelDetailsDialog } from './model-details';
import { ModelListItem } from './model-options';
import { ModelUpload } from './model-upload';
import { fetchModels } from './services/model-service';

interface Model {
  id: string;
  model_tag: string;
  name: string;
}

export const ModelList = ({ isOpen }: { isOpen: boolean }) => {
  // Local state for models and UI logic
  const [models, setModels] = useState<Model[]>([]);
  const [modelSearch, setModelSearch] = useState('');
  const [modelsDropdownOpen, setModelsDropdownOpen] = useState(false);
  const [showMoreModels, setShowMoreModels] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>();

  // Load models on first render
  useEffect(() => {
    const loadModels = async () => {
      const data = await fetchModels();
      setModels(data);
    };
    void loadModels();
  }, []);

  // Filter models by search term
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase()),
  );

  // Open the model details dialog
  const openModelDetails = (model_tag: string) => {
    setSelectedModelId(model_tag);
    setDetailsOpen(true);
  };

  return (
    <div className="border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3
            className={`text-md font-semibold transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Models
          </h3>
          {/* Show upload button only if sidebar is open */}
          {isOpen && <ModelUpload />}
        </div>
        {/* Dropdown toggle button */}
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
      {/* Dropdown content */}
      {modelsDropdownOpen && isOpen && (
        <div className="mt-2">
          {/* Search input */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder="Search models"
              value={modelSearch}
            />
          </div>
          {/* Model list */}
          <div
            className={`mt-4 space-y-2 ${
              showMoreModels ? 'max-h-[calc(100%-4rem)] overflow-y-auto' : ''
            }`}
          >
            {filteredModels
              .slice(0, showMoreModels ? filteredModels.length : 5)
              .map((model) => (
                <ModelListItem
                  key={model.id}
                  model={model}
                  onDetails={openModelDetails}
                />
              ))}
          </div>
          {/* Show More/Less button */}
          {filteredModels.length > 5 && (
            <Button
              className="mt-2 w-full"
              onClick={() => setShowMoreModels(!showMoreModels)}
              variant="ghost"
            >
              {showMoreModels ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </div>
      )}
      {/* Model details dialog */}
      <ModelDetailsDialog
        modelId={detailsOpen ? selectedModelId : undefined}
        onClose={() => setDetailsOpen(false)}
        open={detailsOpen}
      />
    </div>
  );
};
