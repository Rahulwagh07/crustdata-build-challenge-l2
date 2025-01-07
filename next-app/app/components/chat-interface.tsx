"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Message from "./message";
import { getResponse } from "../utils/response";
import { SendHorizontal } from "lucide-react";

export default function ChatInterface() {
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      const initialHeight = 40;
      textareaRef.current.style.height = `${initialHeight}px`;
      const scrollHeight = textareaRef.current.scrollHeight;
      const hasVerticalScroll = scrollHeight > initialHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
      textareaRef.current.classList.toggle(
        "custom-scrollbar",
        hasVerticalScroll
      );
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessages = [
        ...messages,
        { text: input, isUser: true },
        { text: getResponse(input), isUser: false },
      ];
      setMessages(newMessages);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    }
  };

  return (
    <Card className="relative overflow-hidden border border-gray-800 bg-gray-900/30 backdrop-blur-sm h-full flex flex-col">
      <div className="flex flex-col h-full">
        <div
          ref={chatContainerRef}
          className={`flex-1 p-4 overflow-y-auto custom-scrollbar ${
            messages.length > 0 ? "space-y-4" : ""
          }`}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Ask me anything about Crustdata&apos;s APIs
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <Message
                key={index}
                text={message.text}
                isUser={message.isUser}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-800/30 bg-gray-900/20 backdrop-blur-sm">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about Crustdata APIs..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="bg-gray-900/50 border-gray-700/50 text-gray-100 placeholder:text-gray-500 focus:ring-0 focus:border-gray-600 min-h-[40px] max-h-[200px] py-2.5"
                style={{ resize: "none" }}
              />
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleSend}
                className="bg-[#EBFF00] hover:bg-[#d4e600] text-black font-medium w-10 h-10 p-0"
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
