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
import { fetchModels, Model, updateModelName } from '../services/model-service';
import { ModelDetailsHoverCardContent } from './model-details';
import { ModelListOptions } from './model-options';

const ModelListItem = ({ model }: { readonly model: Model }) => {
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(model.name);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!newName.trim() || newName === model.name) {
      setEdit(false);
      setNewName(model.name);
      return;
    }
    setSaving(true);
    try {
      await updateModelName(model.id, newName.trim(), model.version);
      setEdit(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarMenuSubItem key={model.model_tag}>
      <div className="flex w-full min-w-0 items-center">
        <HoverCard>
          <HoverCardTrigger asChild>
            {edit ? (
              <SidebarListItemName
                edit={edit}
                handleSave={handleSave}
                inputRef={inputRef as React.RefObject<HTMLInputElement>}
                name={model.name}
                newName={newName}
                saving={saving}
                setEdit={setEdit}
                setNewName={setNewName}
              />
            ) : (
              <Link
                className="min-w-0 flex-1"
                href={`/model/${model.model_tag}`}
              >
                <SidebarListItemName
                  edit={edit}
                  handleSave={handleSave}
                  inputRef={inputRef as React.RefObject<HTMLInputElement>}
                  name={model.name}
                  newName={newName}
                  saving={saving}
                  setEdit={setEdit}
                  setNewName={setNewName}
                />
              </Link>
            )}
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-96" side="top">
            <ModelDetailsHoverCardContent modelId={model.model_tag} />
          </HoverCardContent>
        </HoverCard>
        <ModelListOptions model={model} setEdit={setEdit} />
      </div>
    </SidebarMenuSubItem>
  );
};

export const ModelList = () => {
  const {
    data: models = [],
    error,
    isLoading,
  } = useQuery({
    queryFn: fetchModels,
    queryKey: ['models'],
  });

  // State for models and UI logic
  const [modelSearch, setModelSearch] = useState('');
  const [showMoreModels, setShowMoreModels] = useState(false);
  const [open, setOpen] = useState(false);

  // Filter models by search term
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase()),
  );

  // Show only 5 by default, show all if showMoreModels is true
  const visibleModels = filteredModels.slice(
    0,
    showMoreModels ? filteredModels.length : 5,
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
                  <div className="flex-1">
                    <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                  </div>
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
              Error loading models: {error.message || String(error)}
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {/* Collapsible section for models */}
      <Collapsible
        className="group/collapsible"
        defaultOpen={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setShowMoreModels(false);
          }
        }}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="sticky top-0 z-10 flex w-full items-center gap-2">
              <span className="text-md">Models</span>
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
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Search models"
                value={modelSearch}
              />
            </div>
            {/* SidebarMenuSub */}
            <SidebarMenuSub>
              {visibleModels.map((model) => (
                <ModelListItem key={model.model_tag} model={model} />
              ))}
            </SidebarMenuSub>
            {/* Show More/Less button */}
            {filteredModels.length > 5 && (
              <button
                className="text-muted-foreground mt-2 w-full text-xs hover:underline"
                onClick={() => setShowMoreModels((v) => !v)}
                type="button"
              >
                {showMoreModels ? 'Show Less' : 'Show More'}
              </button>
            )}
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
};
