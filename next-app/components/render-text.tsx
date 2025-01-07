import ReactMarkdown from 'react-markdown';

interface RenderTextProps {
  text: string;
}

export function RenderText({ text }: RenderTextProps) {
  const convertUrlsToMarkdown = (text: string) => {
    const markdownLinkRegex = /\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    
    return text.replace(markdownLinkRegex, (url1) => {
      return `${url1}`;
    }).replace(/(https?:\/\/[^\s]+)(?!\]|\))/g, (url) => {
      const cleanUrl = url.replace(/[.,;)]$/, '');
      return `${cleanUrl}`;
    });
  };

  const processedText = convertUrlsToMarkdown(text);

  return (
    <div className="break-words">
      <ReactMarkdown
        components={{
          p: ({ children }) => {
            const content = children?.toString() || '';
            const isShortText = content.length < 50 && !content.includes('\n');
            
            return (
              <span className={`whitespace-pre-wrap break-words leading-relaxed text-gray-200 ${
                isShortText ? '' : 'block mb-4'
              }`}>
                {children}
              </span>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer inline-block"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 text-gray-200 font-mono text-sm">
              {children}
            </code>
          )
        }}
      >
        {processedText}
      </ReactMarkdown>
    </div>
  );
} 