import { Copy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

//          interface: 피드 카드 컴포넌트 Properties          //
interface Props {
  images: string | string[];
  href: string;
  alt: string;
  onClick?: () => void;
}

//          component: 피드 카드 컴포넌트          //
export function FeedCard({ images, onClick, href }: Props) {
  //          variable: 이미지 여러개인지 판단          //
  const isMultiple = Array.isArray(images) && images.length > 1;
  //
  //          variable: 첫번째 이미지를 메인 이미지로 선정          //
  const firstImage = Array.isArray(images) ? images[0] : images;

  //          render: 피드 카드 컴포넌트 렌더링          //
  return (
    <Link
      href={href}
      className="relative aspect-square w-full cursor-pointer overflow-hidden rounded"
      onClick={onClick}
      prefetch={true}
    >
      {images && (
        <Image
          src={`${firstImage}`}
          alt="피드 이미지"
          fill
          sizes="184px"
          className="object-cover"
          priority
        />
      )}
      {isMultiple && (
        <div className="absolute top-1 right-1 z-10 rounded p-1 text-white">
          <Copy size={16} fill="white" />
        </div>
      )}
    </Link>
  );
}
