interface RenderTextProps {
  text: string;
}

export function RenderText({ text }: RenderTextProps) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
} 