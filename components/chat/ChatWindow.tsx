"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TbSend } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ChatWindow = () => {
  const { messages, sendMessage, activeConversation } = useChat();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll saat pesan baru masuk
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    await sendMessage(input);
    setIsSending(false);
    setInput("");
  };

  const otherParticipant = activeConversation?.participants?.find(
    (p) => p.user.id !== user?.id
  )?.user;

  if (!otherParticipant)
    return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 h-0 overflow-hidden bg-gray-50/50">
        <ScrollArea className="h-full px-3 py-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs text-center px-4 min-h-[300px]">
              <Avatar className="h-16 w-16 mb-3 opacity-50">
                <AvatarImage src={otherParticipant.profilePicture || ""} />
                <AvatarFallback className="text-2xl">
                  {otherParticipant.fullName[0]}
                </AvatarFallback>
              </Avatar>
              <p>
                Mulai percakapan dengan <br />{" "}
                <span className="font-semibold">
                  {otherParticipant.fullName}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-2">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex gap-2 w-full ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <Avatar className="h-8 w-8 mt-1 shrink-0">
                        <AvatarImage src={msg.sender.profilePicture || ""} />
                        <AvatarFallback className="text-xs">
                          {msg.sender.fullName[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`relative max-w-[70%] px-4 py-2 text-sm shadow-sm rounded-2xl ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-white border text-foreground rounded-tl-sm"
                      }`}
                    >
                      <p className="wrap-break-word whitespace-pre-wrap break-all leading-relaxed">
                        {msg.content}
                      </p>
                      <p
                        className={`text-[10px] mt-1 text-right ${
                          isMe ? "opacity-70" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t bg-white flex gap-2 shrink-0"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1"
          disabled={isSending}
        />
        <Button type="submit" size="icon" disabled={!input.trim() || isSending}>
          <TbSend className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
