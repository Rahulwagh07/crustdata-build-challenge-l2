import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
}

export default function Avatar({ src, alt }: AvatarProps) {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-600">
      <Image src={src} alt={alt} width={32} height={32} />
    </div>
  );
}
