import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { fetchDatasets } from '@/features/sidebar/services/dataset-service';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DatasetDetailsDialog } from './dataset-details';
import { DatasetListItem } from './dataset-options';

interface Dataset {
  id: string;
  name: string;
}

export const DatasetList = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetSearch, setDatasetSearch] = useState('');
  const [datasetsDropdownOpen, setDatasetsDropdownOpen] = useState(false);
  const [showMoreDatasets, setShowMoreDatasets] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<
    string | undefined
  >();
  const [open, setOpen] = useState(false);

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
    <SidebarMenu>
      <Collapsible
        className="group/collapsible"
        defaultOpen={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setShowMoreDatasets(false);
          }
        }}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="sticky top-0 z-10 flex w-full items-center gap-2 bg-[var(--sidebar)]">
              <span className="text-md">Datasets</span>
              <span className="ml-auto flex flex-row items-center gap-2">
                {open ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {/* Search input */}
            <div className="mt-2 flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                onChange={(e) => setDatasetSearch(e.target.value)}
                placeholder="Search datasets"
                value={datasetSearch}
              />
            </div>
            <SidebarMenuSub>
              {visibleDatasets.map((dataset) => (
                <SidebarMenuSubItem key={dataset.id}>
                  <DatasetListItem
                    dataset={dataset}
                    onDeleted={handleDeleted}
                    onDetails={openDatasetDetails}
                  />
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
            {/* Show More/Less */}
            {filteredDatasets.length > 5 && (
              <button
                className="text-muted-foreground mt-2 w-full text-xs hover:underline"
                onClick={() => setShowMoreDatasets((v) => !v)}
                type="button"
              >
                {showMoreDatasets ? 'Show Less' : 'Show More'}
              </button>
            )}
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
      <DatasetDetailsDialog
        datasetId={detailsOpen ? selectedDatasetId : undefined}
        onClose={() => setDetailsOpen(false)}
        open={detailsOpen}
      />
    </SidebarMenu>
  );
};
