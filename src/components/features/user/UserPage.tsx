'use client';

import { Bookmark, PostList, User } from '@/types';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserProfileSection } from '@/components/features/user/UserProfileSection';
import { UserFeedTab } from '@/components/features/user/UserFeedTab';
import { UserShopTab } from '@/components/features/user/UserShopTab';
import { useAuthStore } from '@/store/auth.store';
import { useEffect, useState } from 'react';

//          interface: 유저 페이지 컴포넌트 Properties          //
interface Props {
  user: User;
  posts: PostList[];
  userBookmark?: Bookmark[];
  // recommenedUser: User[];
}

//          component: 유저 페이지 컴포넌트          //
export function UserPageClient({ user, posts, userBookmark }: Props) {
  //          state: 로그인 유저 상태          //
  const currentUser = useAuthStore(state => state.user);

  //          state: 마이페이지 상태          //
  const [isMypage, setMypage] = useState<boolean>(true);

  let isBookmark = false;
  let bookmarkId: number | undefined = undefined;

  if (!isMypage && userBookmark) {
    const bookmark = userBookmark.find(
      bookmark => bookmark.user._id === user._id,
    );
    if (bookmark) {
      isBookmark = true;
      bookmarkId = bookmark._id;
    }
  }

  useEffect(() => {
    if (currentUser) {
      setMypage(currentUser._id === user._id);
    }
  }, [currentUser, user]);

  //          render: 유저 페이지 컴포넌트 렌더링          //
  return (
    <main className="flex flex-col">
      {/* 유저 프로필 정보 영역 */}
      <section className="flex flex-col gap-5 p-4">
        <UserProfileSection
          user={user}
          isMypage={isMypage}
          isBookmark={isBookmark}
          bookmark_id={bookmarkId}
        />
      </section>

      {/* 마이페이지일 때만 추천 유저 리스트 표시 */}
      {/* {isMypage && <UserPreviewList recommendedUser={recommenedUser} />} */}

      {/* 피드 및 쇼핑 내역 탭 */}
      <section className="flex flex-col">
        <Tabs defaultValue="feed" className="gap-0">
          {/* 탭 버튼 목록 */}
          <TabsList className="h-14 w-full rounded-none border-b bg-white px-4 py-0">
            <TabsTrigger
              value="feed"
              className="cursor-pointer rounded-none border-none !shadow-none data-[state=active]:bg-[#4A4A4A] data-[state=active]:text-white"
            >
              {isMypage ? '내 피드' : '피드'}
            </TabsTrigger>

            {/* 마이페이지일 때만 쇼핑 내역 탭 추가 */}
            {isMypage && (
              <TabsTrigger
                value="shop"
                className="cursor-pointer rounded-none border-none !shadow-none data-[state=active]:bg-[#4A4A4A] data-[state=active]:text-white"
              >
                쇼핑 내역
              </TabsTrigger>
            )}
          </TabsList>

          {/* 피드 탭 내용 */}
          <TabsContent value="feed">
            <UserFeedTab posts={posts} />
          </TabsContent>

          {/* 마이페이지일 때만 쇼핑 내역 탭 내용 표시 */}
          {isMypage && (
            <TabsContent value="shop">
              <UserShopTab />
            </TabsContent>
          )}
        </Tabs>
      </section>
    </main>
  );
}
