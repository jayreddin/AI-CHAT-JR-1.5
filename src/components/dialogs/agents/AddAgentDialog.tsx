
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAgentDialog: React.FC<AddAgentDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Create a custom AI agent with specific instructions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input
              id="agent-name"
              placeholder="e.g., Marketing Assistant"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-description">Description</Label>
            <Input
              id="agent-description"
              placeholder="e.g., Helps create marketing content"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-command">Command (starts with /)</Label>
            <Input
              id="agent-command"
              placeholder="/marketing"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-prompt">System Prompt</Label>
            <textarea
              id="agent-prompt"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="You are a marketing assistant. Help the user create compelling marketing content..."
            ></textarea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            toast.info('Custom agent creation will be implemented in a future update');
            onOpenChange(false);
          }}>Create Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
