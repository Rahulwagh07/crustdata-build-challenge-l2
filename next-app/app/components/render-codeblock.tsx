import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface RenderCodeBlockProps {
  code: string;
  index: number;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}

export function RenderCodeBlock({ code, index, copiedIndex, onCopy }: RenderCodeBlockProps) {
  const language = code.trim().startsWith("curl") ? "bash" : "json";

  return (
    <div className="relative group">
      <button
        onClick={() => onCopy(code.trim(), index)}
        className="absolute right-2 top-2 p-2 rounded-lg bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-700/50"
      >
        {copiedIndex === index ? (
          <Check className="h-3 w-3 text-green-400" />
        ) : (
          <Copy className="h-3 w-3 text-gray-400 hover:text-gray-300" />
        )}
      </button>
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            padding: "1em",
            borderRadius: "0.5em",
            marginTop: "0.5em",
            marginBottom: "0.5em",
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
} 