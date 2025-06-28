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
import { SidebarListItemName } from '@/components/ui/sidebar-list-item';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  Dataset,
  fetchDatasets,
  updateDataset,
} from '../services/dataset-service';
import { DatasetDetailsHoverCard } from './dataset-details';
import { DatasetOptions } from './dataset-options';

const DatasetListItem = ({ dataset }: { dataset: Dataset }) => {
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(dataset.name);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!newName.trim() || newName === dataset.name) {
      setEdit(false);
      setNewName(dataset.name);
      return;
    }
    setSaving(true);
    try {
      if (dataset.version === undefined) {
        throw new Error('Missing dataset version');
      }
      await updateDataset(dataset.id, newName.trim(), dataset.version);
      setEdit(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarMenuSubItem key={dataset.id}>
      <div className="flex w-full min-w-0 items-center">
        <HoverCard>
          <HoverCardTrigger asChild>
            {edit ? (
              <SidebarListItemName
                edit={edit}
                handleSave={handleSave}
                inputRef={inputRef as React.RefObject<HTMLInputElement>}
                name={dataset.name}
                newName={newName}
                saving={saving}
                setEdit={setEdit}
                setNewName={setNewName}
              />
            ) : (
              <Link className="min-w-0 flex-1" href={`/dataset/${dataset.id}`}>
                <SidebarListItemName
                  edit={edit}
                  handleSave={handleSave}
                  inputRef={inputRef as React.RefObject<HTMLInputElement>}
                  name={dataset.name}
                  newName={newName}
                  saving={saving}
                  setEdit={setEdit}
                  setNewName={setNewName}
                />
              </Link>
            )}
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-96" side="top">
            <DatasetDetailsHoverCard datasetId={dataset.id} />
          </HoverCardContent>
        </HoverCard>
        <DatasetOptions dataset={dataset} setEdit={setEdit} />
      </div>
    </SidebarMenuSubItem>
  );
};

export const DatasetList = () => {
  const {
    data: datasets = [],
    error,
    isLoading,
  } = useQuery({
    queryFn: fetchDatasets,
    queryKey: ['datasets'],
  });

  const [datasetSearch, setDatasetSearch] = useState('');
  const [showMoreDatasets, setShowMoreDatasets] = useState(false);
  const [open, setOpen] = useState(false);

  const filteredDatasets = datasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(datasetSearch.toLowerCase()),
  );

  const visibleDatasets = filteredDatasets.slice(
    0,
    showMoreDatasets ? filteredDatasets.length : 5,
  );

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="p-4">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((key) => (
                <div
                  className="flex items-center gap-2"
                  key={`skeleton-${key}`}
                >
                  <div className="bg-muted h-6 w-6 animate-pulse rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="p-4">
            <div className="bg-destructive/10 border-destructive text-destructive rounded border p-2 text-sm">
              Error loading datasets: {error.message || String(error)}
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {/* Collapsible section for datasets */}
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
            <SidebarMenuButton className="sticky top-0 z-10 flex w-full items-center gap-2">
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
                <DatasetListItem dataset={dataset} key={dataset.id} />
              ))}
            </SidebarMenuSub>
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
