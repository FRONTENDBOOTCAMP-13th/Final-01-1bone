'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Bookmark,
  ChevronRight,
  Star,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types';
import { useFollowStore } from '@/store/follow.store';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import {
  deleteBookmark,
  getBookmark,
  postBookmark,
} from '@/data/actions/bookmark';
import { getUserImageUrl } from '@/utils';

//          interface: 유저 프로필 섹션 Properties          //
interface Props {
  user: User;
  isMypage: boolean;
  isBookmark?: boolean;
  bookmark_id?: number;
}
//          component: 유저 프로필 섹션 컴포넌트          //
export function UserProfileSection({
  user,
  isMypage,
  isBookmark,
  bookmark_id,
}: Props) {
  //          variable: 디폴트 이미지 변수          //

  const imageUrl = getUserImageUrl(user.image);

  //          state: 팔로잉 카운트 상태          //
  const { followCount, setFollowCount, increaseFollow, decreaseFollow } =
    useFollowStore();
  //          state: accessToken 상태          //
  const accessToken = useAuthStore(state => state.accessToken);
  //          state: 팔로우 상태          //
  const [isFollowed, setIsFollowed] = useState(false);
  //          state: 북마크 ID 상태          //
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);

  //          event handler: 팔로우 토큰 버튼 클릭 이벤트 처리          //
  const handleToggleFollow = async () => {
    try {
      if (!accessToken) return;

      if (isFollowed && bookmarkId) {
        // 팔로우 취소 → 북마크 삭제

        const res = await deleteBookmark(bookmarkId, accessToken);

        if (res.ok === 1) {
          decreaseFollow();
          console.log('삭제됨');
          setIsFollowed(false);
        }
      } else {
        // 팔로우 → 북마크 추가
        const res = await postBookmark('user', user._id, accessToken);
        if (res.ok === 1) {
          console.log('추가됨');
          increaseFollow();
          setBookmarkId(res.item._id);
          setIsFollowed(true);
        }
      }
    } catch (err) {
      console.error('팔로우 상태 변경 실패:', err);
    }
  };

  //          effect: 유저의 팔로잉 수를 전역 상태로 설정          //
  useEffect(() => {
    if (user.bookmarkedBy?.users != null) {
      setFollowCount(user.bookmarkedBy.users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMypage, user.bookmark?.users]);

  //          effect: 현재 유저가 이 유저를 팔로우하고 있는지 확인          //
  useEffect(() => {
    if (!isMypage && isBookmark && bookmark_id) {
      setIsFollowed(isBookmark);
      setBookmarkId(bookmark_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMypage, isBookmark]);
  //          render: 유저 프로필 섹션 컴포넌트 렌더링          //
  return (
    <div className="flex flex-col gap-4">
      {/* 프로필 상단 영역 */}
      <div className="flex items-center gap-4">
        {/* 프로필 이미지 */}
        <Image
          src={imageUrl}
          alt="프로필 이미지"
          className="size-16 rounded-full object-cover"
          width={64}
          height={64}
          priority
        />
        {/* 이름과 소개 */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <p className="text-xl font-semibold">{`${user.name} `}</p>
            <p className="text-sm text-[#1A1A1A]">
              {user.extra?.nickname ? `${user.extra.nickname}` : '-'}
            </p>
          </div>
        </div>
        {isMypage && (
          <Link
            href={`/user/${user._id}/bookmark`}
            className="ml-auto cursor-pointer self-start"
          >
            <Button
              variant="ghost"
              className="!hover:bg-transparent ml-auto cursor-pointer self-start !bg-transparent"
            >
              <span>북마크 목록</span>
              <ChevronRight />
            </Button>
          </Link>
        )}
      </div>
      <p className="text-sm font-medium text-[#1A1A1A]">
        {user.extra?.introduction || ''}
      </p>
      <div className="flex gap-3">
        {/* 통계 정보 영역 (팔로우, 팔로잉, 스크랩) */}
        <div className="flex w-full items-center overflow-hidden rounded-md border border-[#E6E6E6] text-base">
          {/* 팔로우 수 */}
          <Link
            href={`${user._id}/follow?tab=follow`}
            className="flex flex-1 flex-col items-center justify-center rounded-xl px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#999999]">팔로우</p>
              {/* <UsersRound size={20} /> */}
              <p className="text-base font-semibold break-words whitespace-pre-wrap text-[#1A1A1A]">
                {followCount ?? 0}
              </p>
            </div>
            {/* <div className="flex justify-end"></div> */}
          </Link>
          <div className="h-1/2">
            <Separator orientation="vertical" className="" />
          </div>

          {/* 팔로잉 수 */}
          <Link
            href={`${user._id}/follow?tab=following`}
            className="flex flex-1 flex-col items-center justify-center rounded-xl px-4 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-[#999999]">팔로잉</p>
              {/* <UserPlus size={20} /> */}
              <p className="text-base font-semibold break-words whitespace-pre-wrap text-[#1A1A1A]">
                {user.bookmark?.users ?? 0}
              </p>
            </div>
            {/* <div className="flex justify-end"></div> */}
          </Link>
        </div>
        {/* 우측 버튼: 마이페이지면 '수정', 아니면 '팔로우' */}
        {isMypage ? (
          <Link href="/user/edit" className="h-10 cursor-pointer">
            <Button
              variant="outline"
              className="h-full cursor-pointer border-[#999999] bg-[#999999] px-5 font-normal text-white !shadow-none hover:bg-[#888888] hover:text-white"
            >
              프로필 수정
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            className="ml-auto h-10 min-w-[103px] cursor-pointer px-5 font-normal !shadow-none hover:bg-[#888888] hover:text-white"
            onClick={handleToggleFollow}
          >
            {isFollowed ? '팔로우취소' : '팔로우'}
          </Button>
        )}
      </div>
    </div>
  );
}
