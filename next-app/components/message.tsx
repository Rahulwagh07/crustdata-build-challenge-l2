import { Brain, User} from "lucide-react";
import { useState } from "react";
import { RenderText } from "./render-text";
import { RenderCodeBlock } from "./render-codeblock";

interface MessageProps {
  text: string;
  isUser: boolean;
  isLoading?: boolean;
}

export default function Message({ text, isUser, isLoading = false }: MessageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderContent = (content: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    let lastIndex = 0;
    const elements = [];
    let codeBlockIndex = 0;

    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        elements.push(<RenderText key={`text-${codeBlockIndex}`} text={content.slice(lastIndex, match.index)} />);
      }
      elements.push(
        <RenderCodeBlock
          key={`code-${codeBlockIndex}`}
          code={match[1]}
          index={codeBlockIndex}
          copiedIndex={copiedIndex}
          onCopy={handleCopy}
        />
      );
      codeBlockIndex++;
      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      elements.push(<RenderText key={`text-${codeBlockIndex}`} text={content.slice(lastIndex)} />);
    }

    return elements;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-3 max-w-[85%]`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md ${
            isUser
              ? "bg-gray-900/50 border border-gray-700/30"
              : "bg-gray-900/50 border border-gray-700/30"
          }`}
        >
          {isUser ? 
            <User className="h-4 w-4 text-gray-400" />
           :  <Brain className="h-4 w-4 text-gray-400" />}
        </div>
        <div
          className={`rounded-lg px-4 py-2 text-sm border ${
            isUser
              ? "bg-blue-900/30 backdrop-blur-sm text-blue-100 border-blue-700/50"
              : "bg-gray-900/30 backdrop-blur-sm text-gray-100 border-gray-700/50"
          }`}
        >
          <div className="prose prose-invert max-w-none">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-pulse">Thinking</span>
                <span className="animate-pulse">...</span>
              </div>
            ) : (
              renderContent(text)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
