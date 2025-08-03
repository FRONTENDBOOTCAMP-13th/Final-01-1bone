'use client';

import { Separator } from '@/components/ui/separator';
import { Comment, PostReply, User } from '@/types';
import { getUserImageUrl } from '@/utils';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Ellipsis } from 'lucide-react';

interface Props {
  comment: PostReply;
}

export default function CommentListItem({ comment }: Props) {
  //          function: 작성일 경과시간 함수          //
  const getElapsedTime = () => {
    const now = dayjs();
    const writeTime = dayjs(comment.updatedAt);

    const gap = now.diff(writeTime, 's');
    if (gap < 60) return `${gap}초 전`;
    if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
    if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;
    return `${Math.floor(gap / 86400)}일 전`;
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full justify-between text-[#4A4A4A]">
        {/* 프로필 영역 */}
        <div className="flex items-center gap-2">
          <div className="relative aspect-square w-8 overflow-hidden rounded-full">
            <Image
              src={getUserImageUrl(comment.user.image)}
              alt={comment.user.name}
              fill
              className="object-cover object-center"
            />
          </div>
          <span className="font-medium">{comment.user.name}</span>
          <div className="h-full py-2">
            <Separator orientation="vertical" />
          </div>
          <div className="text-sm text-[#808080]">{getElapsedTime()}</div>
        </div>
        {/* 수정 삭제 버튼 */}
        <div>
          <Ellipsis className="text-[#4A4A4A]" size={20} />
        </div>
      </div>
      <div>
        <div className="whitespace-pre-wrap text-[#4A4A4A]">
          {comment.content}
        </div>
      </div>
    </div>
  );
}
