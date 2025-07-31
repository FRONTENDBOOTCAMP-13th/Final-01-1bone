import Image from 'next/image';
import { Post } from '@/types';
import { getUserImageUrl } from '@/utils';

interface CommunityPostImageProps {
  post: Post;
}

export default function CommunityPostImage({ post }: CommunityPostImageProps) {
  console.log('post.image:', post.image);

  // getUserImageUrl 함수 사용
  const imageUrl = getUserImageUrl(
    Array.isArray(post.image) ? post.image[0] : post.image,
  );

  console.log('getUserImageUrl 결과:', imageUrl);

  return (
    <div className="relative aspect-square w-full">
      <Image
        src={imageUrl}
        alt="피드 이미지"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
    </div>
  );
}
