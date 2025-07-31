import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { getUserImageUrl } from '@/utils';
import { Post } from '@/types';

interface CommunityPostHeaderProps {
  post: Post;
  isOwner: boolean;
  onOptionsClick: () => void;
}

export default function CommunityPostHeader({
  post,
  isOwner,
  onOptionsClick,
}: CommunityPostHeaderProps) {
  return (
    <div className="flex h-[60px] items-center justify-between px-5">
      <div className="flex items-center gap-2">
        {/* 프로필 이미지 */}
        <div className="h-8 w-8">
          <Image
            src={getUserImageUrl(post.user.image)}
            alt={`${post.user.name} 프로필`}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </div>

        {/* 닉네임, 시간 */}
        <div className="flex flex-col">
          <div className="text-sm font-bold text-black">{post.user.name}</div>
          <div className="text-xs font-normal text-[#4B5563]">
            {post.createdAt}
          </div>
        </div>
      </div>

      {/* 우측 게시글 옵션 아이콘 (본인만 표시) */}
      {isOwner && (
        <button
          onClick={onOptionsClick}
          className="rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <MoreHorizontal size={20} className="text-gray-400" />
        </button>
      )}
    </div>
  );
}
