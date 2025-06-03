'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import { DatasetList } from './dataset/dataset-list';
import { DatasetUpload } from './dataset/dataset-upload';
import { ModelList } from './model/model-list';
import { ModelUpload } from './model/model-upload';

export function AppSidebar() {
  const { open } = useSidebar();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [tab, setTab] = useState<'model' | 'dataset'>('model');

  return (
    <Sidebar className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-all duration-200">
      <SidebarHeader className="w-full mb-6 pt-4">
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-semibold pl-4">Vectorize</span>
          <div className="flex gap-2">
            <button
              className="rounded p-2 hover:bg-muted"
              title="Neu"
              type="button"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              className="rounded p-2 hover:bg-muted"
              title="Upload"
              type="button"
              onClick={() => setUploadOpen(true)}
            >
              <Upload className="h-5 w-5" />
            </button>
          </div>
        </div>
      </SidebarHeader>
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
          </DialogHeader>
          <Tabs value={tab} onValueChange={v => setTab(v as 'model' | 'dataset')}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="model" className="flex-1">Model</TabsTrigger>
              <TabsTrigger value="dataset" className="flex-1">Dataset</TabsTrigger>
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
          <ModelList isOpen={open} />
        </SidebarGroup>
        <SidebarGroup>
          <DatasetList isOpen={open} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
