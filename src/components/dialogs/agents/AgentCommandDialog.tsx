
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AgentCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newAgentCommand: string;
  setNewAgentCommand: (command: string) => void;
  confirmAgentCommand: () => void;
}

export const AgentCommandDialog: React.FC<AgentCommandDialogProps> = ({
  open,
  onOpenChange,
  newAgentCommand,
  setNewAgentCommand,
  confirmAgentCommand
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Command</DialogTitle>
          <DialogDescription>
            Enter a command that will activate this agent in chat. Commands must start with "/".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="command">Command</Label>
            <Input
              id="command"
              value={newAgentCommand}
              onChange={(e) => {
                let value = e.target.value;
                if (value && !value.startsWith('/')) {
                  value = '/' + value;
                }
                setNewAgentCommand(value);
              }}
              placeholder="/command"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={confirmAgentCommand}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
