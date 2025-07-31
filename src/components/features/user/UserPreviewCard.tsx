'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { deleteBookmark, postBookmark } from '@/data/actions/bookmark';
import { ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useFollowStore } from '@/store/follow.store';
import { cn } from '@/lib/utils';

//          interface: 유저 프리뷰 카드 컴포넌트 Properties          //
interface Props {
  id: number;
  name: string;
  introduction?: string;
  image: string;
  onRemove?: (id: number) => void;
  isFollowed?: boolean;
  bookmarkId?: number | null;
  variant: 'horizontal' | 'vertical';
}
//          component: 유저 프리뷰 카드 컴포넌트          //
export default function UserPreviewCard({
  id,
  name,
  introduction,
  image,
  onRemove,
  isFollowed,
  bookmarkId: initialBookmarkId,
  variant = 'vertical',
}: Props) {
  //          variable: variant에 따른 스타일 변수          //
  const variantClass =
    variant === 'vertical'
      ? 'flex-col gap-2 w-[148px] bg-[#70737C14]'
      : 'flex-row w-full';

  //          state: 팔로우 상태          //
  const [isFollowing, setFollowing] = useState<boolean>(false);
  //          state: 북마크 ID 상태          //
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  //          state: accessToken 상태          //\
  const accessToken = useAuthStore(state => state.accessToken);

  //          function: 팔로우 수 증가 함수          //
  const increaseFollow = useFollowStore(state => state.increaseFollow);
  //          function: 팔로우 수 감소 함수          //
  const decreaseFollow = useFollowStore(state => state.decreaseFollow);

  //          event handler: 팔로우/언팔로우 버튼 클릭 이벤트 처리          //
  const handleFollow = async () => {
    if (isFollowing && bookmarkId) {
      if (!accessToken) return null;
      const res = await deleteBookmark(bookmarkId, accessToken);
      if (res.ok) {
        setFollowing(false);
        decreaseFollow();
        setBookmarkId(null);
      }
    } else {
      if (!accessToken) return null;
      const res = await postBookmark('user', id, accessToken);
      if (res.ok) {
        setFollowing(true);
        increaseFollow();
        setBookmarkId(res.item._id);
      }
    }
  };

  //          effect: props로 전달된 팔로우 여부와 북마크 ID를 내부 상태로 반영          //
  useEffect(() => {
    setFollowing(isFollowed ?? false);
    setBookmarkId(initialBookmarkId ?? null);
  }, [isFollowed, initialBookmarkId]);

  //          render: 유저 프리뷰 카드 컴포넌트 렌더링          //
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-between gap-2 rounded-[10px] p-4 text-center select-none',
        variantClass,
      )}
    >
      {/* 유저 정보 클릭 시 유저 상세 페이지로 이동 */}
      <Link
        href={`/user/${id}`}
        className={cn(
          'flex w-full items-center',
          variant === 'vertical' ? 'flex-col' : 'flex-row gap-3',
        )}
        draggable={false}
        prefetch={true}
      >
        {/* 프로필 이미지 */}
        <div
          className={cn(
            'relative aspect-square overflow-hidden rounded-full',
            variant === 'vertical' ? 'mb-3 w-14' : 'w-14',
          )}
        >
          <Image
            src={image}
            alt="프로필 이미지"
            fill
            className="pointer-events-none object-cover object-center select-none"
            sizes={'56px'}
            draggable={false}
          />
        </div>

        {/* 유저 이름 및 소개 */}
        <div
          className={cn(
            'flex-1',
            variant === 'horizontal' &&
              'flex flex-col items-start justify-center',
          )}
        >
          <p
            className={cn(
              'truncate overflow-hidden font-semibold',
              variant === 'horizontal' && 'text-sm',
            )}
          >
            {name}
          </p>
          <p
            className={cn(
              'truncate overflow-hidden text-sm text-[#37383C9C]',
              variant === 'horizontal' ? 'max-w-full whitespace-nowrap' : '',
            )}
          >
            {introduction}
          </p>
        </div>
      </Link>

      {/* 팔로우 버튼 or > 아이콘 */}
      {variant === 'vertical' ? (
        <Button
          variant="outline"
          onClick={handleFollow}
          className={cn('w-full border-[#BAD0E5] text-[#BAD0E5]')}
        >
          {isFollowing ? '팔로우취소' : '팔로우'}
        </Button>
      ) : (
        <ChevronRight />
      )}
      {/* 삭제 아이콘 (추천 유저 제거 버튼) */}
      {variant === 'vertical' && onRemove && (
        <X
          className="absolute top-2 right-2 cursor-pointer"
          size={14}
          stroke="#111111"
          onClick={() => onRemove(id)}
        />
      )}
    </div>
  );
}
