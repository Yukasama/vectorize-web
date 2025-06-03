import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchModels } from '../services/model-service';
import { ModelDetailsDialog } from './model-details';
import { ModelListItem } from './model-options';
import { ModelUpload } from './model-upload';

interface Model {
  id: string;
  model_tag: string;
  name: string;
}

export const ModelList = ({ isOpen }: { isOpen: boolean }) => {
  // State for models and UI logic
  const [models, setModels] = useState<Model[]>([]);
  const [modelSearch, setModelSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>();

  // Fetch models on mount
  useEffect(() => {
    const loadModels = async () => {
      const data = await fetchModels();
      setModels(data);
    };
    void loadModels();
  }, []);

  // Filter models by search input
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase()),
  );
  // Show only 5 by default, show all if showMoreModels is true
  const [showMoreModels, setShowMoreModels] = useState(false);
  const visibleModels = filteredModels.slice(
    0,
    showMoreModels ? filteredModels.length : 5,
  );

  // Open model details dialog
  const openModelDetails = (model_tag: string) => {
    setSelectedModelId(model_tag);
    setDetailsOpen(true);
  };

  return (
    <SidebarMenu>
      {/* Collapsible section for models */}
      <Collapsible
        defaultOpen={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setShowMoreModels(false);
          }
        }}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex items-center w-full gap-2 sticky top-0 z-10 bg-[var(--sidebar)]">
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
            {showMoreModels ? (
              <SidebarMenuSub>
                {visibleModels.map((model) => (
                  <SidebarMenuSubItem key={model.id}>
                    <ModelListItem model={model} onDetails={openModelDetails} />
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            ) : (
              <SidebarMenuSub>
                {visibleModels.map((model) => (
                  <SidebarMenuSubItem key={model.id}>
                    <ModelListItem model={model} onDetails={openModelDetails} />
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
            {/* Show More/Less button */}
            {filteredModels.length > 5 && (
              <button
                className="mt-2 w-full text-xs text-muted-foreground hover:underline"
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
