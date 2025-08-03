import Image from 'next/image';
import { Post } from '@/types';
import { getUserImageUrl } from '@/utils';

interface Props {
  post: Post;
}

export default function CommunityPostImage({ post }: Props) {
  // getUserImageUrl 함수 사용
  const imageUrl = getUserImageUrl(
    Array.isArray(post.image) ? post.image[0] : post.image,
  );

  return (
    <div className="flex w-full gap-2 overflow-hidden">
      <div className="relative aspect-square w-[calc(100%-20px)] shrink-0">
        <Image
          src={imageUrl}
          alt="피드 이미지"
          fill
          className="rounded-lg object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
      <div className="relative aspect-square w-[calc(100%-16px)] shrink-0">
        <Image
          src={imageUrl}
          alt="피드 이미지"
          fill
          className="rounded-lg object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
