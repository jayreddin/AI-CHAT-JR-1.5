
import React from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { formatDistanceToNow } from "date-fns";

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryDialog({ open, onOpenChange }: HistoryDialogProps) {
  const { chats, setCurrentChat } = useChat();

  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);
    onOpenChange(false);
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Chat History"
      description="Your previous conversations"
    >
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center text-muted-foreground p-4">
            No chat history found
          </p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className="p-3 rounded-md border hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="font-medium">{chat.title}</div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>
                  {chat.messages.length} message{chat.messages.length !== 1 && "s"}
                </span>
                <span>
                  {formatDistanceToNow(new Date(chat.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </DialogForm>
  );
}
