import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
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
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetSearch, setDatasetSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [showMoreDatasets, setShowMoreDatasets] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | undefined>();

  // Fetch datasets from API on first render
  useEffect(() => {
    const loadDatasets = async () => {
      const data = await fetchDatasets();
      setDatasets(data);
    };
    void loadDatasets();
  }, []);

  // Filter datasets by search input
  const filteredDatasets = datasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(datasetSearch.toLowerCase()),
  );
  const visibleDatasets = filteredDatasets.slice(
    0,
    showMoreDatasets ? filteredDatasets.length : 5,
  );

  // Remove a dataset from the list after deletion
  const handleDeleted = (id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
  };

  // Open the details dialog for a dataset
  const openDatasetDetails = (id: string) => {
    setSelectedDatasetId(id);
    setDetailsOpen(true);
  };

  return (
    <SidebarMenu>
      {/* Upload und Plus Button entfernt */}
      <Collapsible defaultOpen={open} onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setShowMoreDatasets(false);
        }
      }} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex items-center w-full gap-2 sticky top-0 z-10 bg-[var(--sidebar)]">
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
                className="mt-2 w-full text-xs text-muted-foreground hover:underline"
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
