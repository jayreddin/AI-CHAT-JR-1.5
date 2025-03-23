
import React from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from '@/hooks/useSettings';
import { AppearanceTab } from './settings/AppearanceTab';
import { AISettingsTab } from './settings/AISettingsTab';
import { AdvancedSettingsTab } from './settings/AdvancedSettingsTab';
import { AccountTab } from './settings/AccountTab';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { settings, setSettings, saveSettings } = useSettings(open);

  const handleSaveSettings = () => {
    saveSettings();
    onOpenChange(false);
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Settings"
      description="Customize your AI chat experience"
      footerActions={
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      }
    >
      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <AppearanceTab settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="ai">
          <AISettingsTab settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountTab settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedSettingsTab settings={settings} setSettings={setSettings} />
        </TabsContent>
      </Tabs>
    </DialogForm>
  );
};
