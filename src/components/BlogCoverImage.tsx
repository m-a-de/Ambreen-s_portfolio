import Image from 'next/image';

type BlogCoverImageProps = {
  src: string;
  alt: string;
  hasImage: boolean;
  sizes: string;
  className?: string;
};

export default function BlogCoverImage({
  src,
  alt,
  hasImage,
  sizes,
  className = '',
}: BlogCoverImageProps) {
  return (
    <div className={`relative overflow-hidden bg-[#F3EADB] ${className}`}>
      {hasImage && (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-center" />
      )}
    </div>
  );
}
