import { cn } from "@/lib/utils";
import { useUnit } from "effector-react";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { sendMessage } from "@/features/chat/messages/model";

import { $messages } from "@/entities/message/model";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

interface ChatBoxProps {
  token: string;
  chatId: string;
  userId: string;
  recipientId: string;
}

export const ChatBox = ({ chatId, userId, recipientId }: ChatBoxProps) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messages = useUnit($messages);
  const send = useUnit(sendMessage);

  // Стили для кастомного скролла
  const scrollbarStyles = `
    scrollbar-thin
    scrollbar-thumb-primary
    scrollbar-track-transparent
    hover:scrollbar-thumb-primary/80
  `;

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ block: "end" });
        }, 100);
      }
    };

    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    send({
      chatId,
      senderId: userId,
      recipientId,
      content: text.trim(),
    });

    setText("");

    // Дополнительный скролл после отправки сообщения
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-md overflow-hidden">
      {/* Заголовок чата */}
      <div className="bg-primary/10 p-3 border-b">
        <h3 className="font-medium">Чат</h3>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className={cn("absolute inset-0 overflow-y-auto p-4", scrollbarStyles)}
          ref={scrollAreaRef}
        >
          <div className="space-y-3 min-h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Нет сообщений
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.senderId === userId;

                return (
                  <div
                    key={message._id}
                    className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2",
                        isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <p>{message.content}</p>
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Поле ввода и кнопка отправки */}
      <div className="border-t p-3 bg-background">
        <div className="flex gap-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            className={cn("resize-none min-h-[60px]", scrollbarStyles)}
          />
          <Button onClick={handleSend} size="icon" className="h-auto" disabled={!text.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
