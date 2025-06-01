import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchDatasets } from '@/features/sidebar/services/dataset-service';
import { messages } from '@/lib/messages';
import { ChevronDown, ChevronUp, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DatasetDetailsDialog } from './dataset-details';
import { DatasetListItem } from './dataset-options';
import { DatasetUpload } from './dataset-upload';

interface Dataset {
  id: string;
  name: string;
}

export const DatasetList = ({ isOpen }: { isOpen: boolean }) => {
  // State for all dataset list UI logic
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetSearch, setDatasetSearch] = useState('');
  const [datasetsDropdownOpen, setDatasetsDropdownOpen] = useState(false);
  const [showMoreDatasets, setShowMoreDatasets] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<
    string | undefined
  >();

  // Fetch datasets from API on first render
  useEffect(() => {
    const loadDatasets = async () => {
      const data = await fetchDatasets();
      setDatasets(data);
    };
    void loadDatasets();
  }, []);

  // Returns true if dataset matches the search term
  const filterDataset = (dataset: Dataset): boolean =>
    dataset.name.toLowerCase().includes(datasetSearch.toLowerCase());

  // Remove a dataset from the list after deletion
  const handleDeleted = (id: string) => {
    setDatasets(removeDatasetById(id));
  };

  // Helper to remove dataset by id
  const removeDatasetById = (id: string) => (prev: Dataset[]) =>
    prev.filter((d) => d.id !== id);

  // Open the details dialog for a dataset
  const openDatasetDetails = (id: string) => {
    setSelectedDatasetId(id);
    setDetailsOpen(true);
  };

  // Render all visible dataset items
  const renderDatasetListItems = (datasets: Dataset[]) =>
    datasets.map((dataset) => (
      <DatasetListItem
        dataset={dataset}
        key={dataset.id}
        onDeleted={handleDeleted}
        onDetails={openDatasetDetails}
      />
    ));

  // Filter and slice datasets for display
  const filteredDatasets = datasets.filter((element) => filterDataset(element));
  const visibleDatasets = filteredDatasets.slice(
    0,
    showMoreDatasets ? filteredDatasets.length : 5,
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3
            className={`text-md font-semibold transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Datasets
          </h3>
          {/* Show upload button only if sidebar is open */}
          {isOpen && <DatasetUpload />}
          {/* Show add new button only if sidebar is open */}
          {isOpen && (
            <Button
              onClick={() => alert(messages.dataset.upload.addNew)}
              size="icon"
              variant="ghost"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
        {/* Toggle dropdown for dataset list */}
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
      {/* Dropdown content for datasets */}
      {datasetsDropdownOpen && isOpen && (
        <div className="mt-2">
          {/* Search input for datasets */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              onChange={(e) => setDatasetSearch(e.target.value)}
              placeholder="Search datasets"
              value={datasetSearch}
            />
          </div>
          {/* List of dataset items */}
          <div
            className={`mt-4 space-y-2 ${
              showMoreDatasets ? 'max-h-[calc(100%-4rem)] overflow-y-auto' : ''
            }`}
          >
            {renderDatasetListItems(visibleDatasets)}
          </div>
          {/* Show More/Less button if there are more than 5 datasets */}
          {filteredDatasets.length > 5 && (
            <Button
              className="mt-2 w-full"
              onClick={() => setShowMoreDatasets(!showMoreDatasets)}
              variant="ghost"
            >
              {showMoreDatasets ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </div>
      )}
      {/* Dialog for dataset details */}
      <DatasetDetailsDialog
        datasetId={detailsOpen ? selectedDatasetId : undefined}
        onClose={() => setDetailsOpen(false)}
        open={detailsOpen}
      />
    </div>
  );
};
