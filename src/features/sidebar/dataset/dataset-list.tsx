import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { fetchDatasets } from '@/features/sidebar/services/dataset-service';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DatasetDetailsHoverCard } from './dataset-details';
import { DatasetListItem } from './dataset-options';

interface Dataset {
  id: string;
  name: string;
  version?: number;
}

export const DatasetList = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetSearch, setDatasetSearch] = useState('');
  const [showMoreDatasets, setShowMoreDatasets] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadDatasets = async () => {
      const data = await fetchDatasets();
      setDatasets(data);
    };
    void loadDatasets();
  }, []);

  const filterDataset = (dataset: Dataset): boolean =>
    dataset.name.toLowerCase().includes(datasetSearch.toLowerCase());

  const filteredDatasets = datasets.filter((element) => filterDataset(element));
  const visibleDatasets = filteredDatasets.slice(
    0,
    showMoreDatasets ? filteredDatasets.length : 5,
  );

  // Remove a dataset from the list after deletion
  const handleDeleted = (id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
  };

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
            {/* SidebarMenuSub */}
            <SidebarMenuSub>
              {visibleDatasets.map((dataset) => (
                <HoverCard key={dataset.id}>
                  <HoverCardTrigger asChild>
                    <Link href={`/dataset/${dataset.id}`}>
                      <SidebarMenuSubItem className="cursor-pointer">
                        <DatasetListItem
                          dataset={{
                            ...dataset,
                            name:
                              dataset.name.length > 12
                                ? dataset.name.slice(0, 12) + '...'
                                : dataset.name,
                          }}
                          onDeleted={handleDeleted}
                        />
                      </SidebarMenuSubItem>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-96" side="top">
                    <DatasetDetailsHoverCard datasetId={dataset.id} />
                  </HoverCardContent>
                </HoverCard>
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
    </SidebarMenu>
  );
};
