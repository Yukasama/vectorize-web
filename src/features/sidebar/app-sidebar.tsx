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
import { useState } from 'react';
import { DatasetList } from './dataset/dataset-list';
import { DatasetUpload } from './dataset/dataset-upload';
import { ModelList } from './model/model-list';
import { ModelUpload } from './model/model-upload';

export const AppSidebar = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [tab, setTab] = useState<'dataset' | 'model'>('model');

  return (
    <Sidebar className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-all duration-200">
      <SidebarHeader className="mb-6 w-full pt-4">
        <div className="flex w-full items-center justify-between">
          <span className="pl-4 text-lg font-semibold">Vectorize</span>
          <div className="flex gap-2">
            <button
              className="hover:bg-muted rounded p-2"
              title="Neu"
              type="button"
            >
              <Plus className="h-5 w-5" />
            </button>
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
        <SidebarGroup className="mb-0">
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
