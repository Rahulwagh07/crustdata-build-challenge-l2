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
  const getLanguage = (code: string) => {
    const firstLine = code.trim().split('\n')[0];
    if (firstLine.startsWith('curl') || firstLine.startsWith('GET')) return 'bash';
    if (firstLine.includes('http')) return 'http';
    try {
      JSON.parse(code);
      return 'json';
    } catch {
      return 'plaintext';
    }
  };

  return (
    <div className="relative group my-6">
      <button
        onClick={() => onCopy(code.trim(), index)}
        className="absolute right-3 top-3 p-2 rounded-lg bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        {copiedIndex === index ? (
          <Check className="h-3 w-3 text-green-400" />
        ) : (
          <Copy className="h-3 w-3 text-gray-200" />
        )}
      </button>
      <div className="relative rounded-md overflow-hidden">
        <SyntaxHighlighter
          language={getLanguage(code)}
          style={vscDarkPlus}
          customStyle={{
            background: '#1a1a1a',
            padding: '1.5rem',
            margin: 0,
            borderRadius: '0.375rem',
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.75'
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
} 