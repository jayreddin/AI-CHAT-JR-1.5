
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogFormProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogForm({
  title,
  description,
  children,
  footerActions,
  open,
  onOpenChange,
}: DialogFormProps) {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isMobile ? 'w-[95vw] max-h-[85vh]' : 'max-w-3xl max-h-[85vh]'} overflow-hidden flex flex-col`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto py-2 flex-1">{children}</div>
        {footerActions && (
          <DialogFooter className="mt-4 flex justify-end gap-2">
            {footerActions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
