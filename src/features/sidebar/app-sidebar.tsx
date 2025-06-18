'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DatasetList } from './dataset/dataset-list';
import { DatasetUpload } from './dataset/dataset-upload';
import { ModelList } from './model/model-list';
import { ModelUpload } from './model/model-upload';
import { SyntheticGenerateDialog } from './synthetic/synthetic-generate-dialog';

export const AppSidebar = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [tab, setTab] = useState<'dataset' | 'model'>('model');
  const [syntheticOpen, setSyntheticOpen] = useState(false);

  return (
    <Sidebar className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-all duration-200">
      <SidebarHeader className="header-bg mb-6 w-full pt-4">
        <div className="flex w-full items-center justify-between">
          <Link className="pl-4" href="/" title="Go to homepage">
            <span className="focus:ring-primary hover:bg-muted inline-block min-w-[120px] rounded bg-transparent p-2 text-center text-lg font-semibold text-[var(--sidebar-foreground)] shadow transition-colors focus:ring-2 focus:outline-none">
              Vectorize
            </span>
          </Link>
          <div className="flex gap-2">
            <button
              className="hover:bg-muted rounded p-2"
              onClick={() => setSyntheticOpen(true)}
              title="Generate synthetic dataset"
              type="button"
            >
              <Plus className="h-5 w-5" />
            </button>
            <SyntheticGenerateDialog
              onOpenChange={setSyntheticOpen}
              open={syntheticOpen}
            />
            <button
              className="hover:bg-muted rounded p-2"
              onClick={() => setUploadOpen(true)}
              title="Upload"
              type="button"
            >
              <Upload className="h-5 w-5" />
            </button>
          </div>
        </div>
      </SidebarHeader>
      <Dialog onOpenChange={setUploadOpen} open={uploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
          </DialogHeader>
          <Tabs
            onValueChange={(v) => setTab(v as 'dataset' | 'model')}
            value={tab}
          >
            <TabsList className="mb-4 w-full">
              <TabsTrigger className="flex-1" value="model">
                Model
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="dataset">
                Dataset
              </TabsTrigger>
            </TabsList>
            <TabsContent value="model">
              <ModelUpload />
            </TabsContent>
            <TabsContent value="dataset">
              <DatasetUpload />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <ModelList />
        </SidebarGroup>
        <SidebarGroup>
          <DatasetList />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
