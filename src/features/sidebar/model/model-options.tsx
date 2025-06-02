import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface ModelListItemProps {
  model: { id: string; model_tag: string; name: string };
  onDetails: (model_tag: string) => void;
}

// ModelListItem displays a single model entry with options menu
export const ModelListItem = ({ model, onDetails }: ModelListItemProps) => (
  <div
    className="hover:bg-muted/70 flex cursor-pointer items-center justify-between rounded p-2 text-sm"
    // Clicking the row opens the details dialog for this model
    onClick={() => onDetails(model.model_tag)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onDetails(model.model_tag);
      }
    }}
    role="button"
    tabIndex={0}
  >
    <span>{model.name}</span>
    {/* Dropdown menu for model actions */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => alert(`Edit ${model.name}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert(`Train ${model.name}`)}>
          Train
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert(`Evaluate ${model.name}`)}>
          Evaluate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
