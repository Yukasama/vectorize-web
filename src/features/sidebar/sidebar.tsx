'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  deleteDataset,
  fetchDatasets,
} from '@/features/sidebar/services/dataset-service';
import { fetchModels } from '@/features/sidebar/services/model-service';
import { messages } from '@/lib/messages';
import {
  ChevronDown,
  ChevronUp,
  Menu,
  MoreVertical,
  Plus,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { DatasetDetailsDialog } from './dataset-details';
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
  // State for models, datasets, search, dropdowns, and dialogs
  const [models, setModels] = useState<Model[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [modelSearch, setModelSearch] = useState('');
  const [datasetSearch, setDatasetSearch] = useState('');
  const [modelsDropdownOpen, setModelsDropdownOpen] = useState(false);
  const [datasetsDropdownOpen, setDatasetsDropdownOpen] = useState(false);
  const [showMoreModels, setShowMoreModels] = useState(false);
  const [showMoreDatasets, setShowMoreDatasets] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<
    string | undefined
  >();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState<Dataset | null>();

  /**
   * Opens the dataset details dialog for the selected dataset.
   */
  const openDatasetDetails = (id: string) => {
    setSelectedDatasetId(id);
    setDetailsOpen(true);
  };

  /**
   * Loads models and datasets on component mount.
   */
  useEffect(() => {
    const loadModels = async () => {
      const data = await fetchModels();
      setModels(data);
    };

    const loadDatasets = async () => {
      const data = await fetchDatasets();
      setDatasets(data);
    };

    void loadModels();
    void loadDatasets();
  }, []);

  /**
   * Filters models based on the search input.
   */
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase()),
  );

  /**
   * Handles dataset deletion and updates state.
   */
  const handleDeleteDataset = async (id: string) => {
    const success = await deleteDataset(id);
    if (success) {
      setDatasets((prev) => prev.filter((d) => d.id !== id));
    } else {
      toast.error(messages.dataset.delete.error);
    }
  };

  /**
   * Filters datasets based on the search input.
   */
  const filteredDatasets = datasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(datasetSearch.toLowerCase()),
  );

  return (
    <div
      className={`bg-accent h-screen text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } overflow-y-auto`}
    >
      {/* Sidebar toggle button */}
      <div className="flex items-center justify-end p-2">
        <Button onClick={() => setIsOpen(!isOpen)} variant="ghost">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-full">
        {/* Models dropdown section */}
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
              {/* Model search input */}
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
                  showMoreModels
                    ? 'max-h-[calc(100%-4rem)] overflow-y-auto'
                    : ''
                }`}
              >
                {filteredModels
                  .slice(0, showMoreModels ? filteredModels.length : 5)
                  .map((model) => (
                    <div
                      className="bg-accent flex items-center justify-between rounded p-2 text-sm"
                      key={model.id}
                    >
                      <span>{model.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => alert(`Edit ${model.name}`)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => alert(`Train ${model.name}`)}
                          >
                            Train
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => alert(`Evaluate ${model.name}`)}
                          >
                            Evaluate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
              </div>
              {/* Show more/less models button */}
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
        </div>

        {/* Datasets dropdown section */}
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
              {isOpen && <DatasetUpload />}
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
              {/* Dataset search input */}
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input
                  onChange={(e) => setDatasetSearch(e.target.value)}
                  placeholder="Search datasets"
                  value={datasetSearch}
                />
              </div>
              {/* Dataset list */}
              <div
                className={`mt-4 space-y-2 ${
                  showMoreDatasets
                    ? 'max-h-[calc(100%-4rem)] overflow-y-auto'
                    : ''
                }`}
              >
                {filteredDatasets
                  .slice(0, showMoreDatasets ? filteredDatasets.length : 5)
                  .map((dataset) => (
                    <div
                      className="flex w-full cursor-pointer items-center justify-between rounded bg-gray-700 p-2 text-sm hover:bg-gray-600"
                      key={dataset.id}
                      onClick={() => openDatasetDetails(dataset.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          openDatasetDetails(dataset.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="flex-1 text-left">{dataset.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            size="icon"
                            tabIndex={-1}
                            variant="ghost"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => alert(`Edit ${dataset.name}`)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => alert(`Train ${dataset.name}`)}
                          >
                            Train
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => alert(`Evaluate ${dataset.name}`)}
                          >
                            Evaluate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDatasetToDelete(dataset);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
              </div>
              {/* Show more/less datasets button */}
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
        </div>
      </ScrollArea>

      {/* Dataset Details Dialog */}
      <DatasetDetailsDialog
        datasetId={detailsOpen ? selectedDatasetId : undefined}
        onClose={() => setDetailsOpen(false)}
        open={detailsOpen}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        datasetName={datasetToDelete?.name ?? ''}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setDatasetToDelete(undefined);
        }}
        onConfirm={async () => {
          if (datasetToDelete) {
            await handleDeleteDataset(datasetToDelete.id);
            toast.success(
              messages.dataset.delete.success(datasetToDelete.name),
              {
                position: 'bottom-right',
              },
            );
            setDeleteDialogOpen(false);
            setDatasetToDelete(undefined);
          }
        }}
        open={deleteDialogOpen}
      />
      {/* Toast notifications for sidebar actions */}
      <Toaster position="bottom-right" />
    </div>
  );
};
