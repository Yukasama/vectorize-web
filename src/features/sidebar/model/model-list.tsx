import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchModels } from '../services/model-service';
import { ModelDetailsDialog } from './model-details';
import { ModelListItem } from './model-options';
import type { Model } from '../services/model-service';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem } from '@/components/ui/sidebar';

export const ModelList = () => {
  // State for models and UI logic
  const [models, setModels] = useState<Model[]>([]);
  const [modelSearch, setModelSearch] = useState('');
  const [modelsDropdownOpen, setModelsDropdownOpen] = useState(false);
  const [showMoreModels, setShowMoreModels] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

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

  // Show only 5 by default, show all if showMoreModels is true
  const visibleModels = filteredModels.slice(
    0,
    showMoreModels ? filteredModels.length : 5,
  );

  // Open the model details dialog
  const openModelDetails = (model_tag: string) => {
    setSelectedModelId(model_tag);
    setDetailsOpen(true);
  };

  // Remove deleted model from list
  const handleModelDeleted = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <SidebarMenu>
      {/* Collapsible section for models */}
      <Collapsible
        className="group/collapsible"
        defaultOpen={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setShowMoreModels(false); // oder setShowMoreDatasets(false)
          }
        }}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="sticky top-0 z-10 flex w-full items-center gap-2 bg-[var(--sidebar)]">
              <span className="text-md font-semibold">Models</span>
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
                <SidebarMenuSubItem key={model.id}>
                  <ModelListItem
                    model={model}
                    onDeleted={handleModelDeleted}
                    onDetails={openModelDetails}
                  />
                </SidebarMenuSubItem>
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
      {/* Model details dialog */}
      <ModelDetailsDialog
        modelId={detailsOpen ? selectedModelId : undefined}
        onClose={() => setDetailsOpen(false)}
        open={detailsOpen}
      />
    </SidebarMenu>
  );
};
