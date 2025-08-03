'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import {
  Ghost,
  MessageCircle,
  PawPrint,
  Radio,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';

//          component: 탭바 컴포넌트          //
export default function TabBar() {
  //          state: path 상태          //
  const pathname = usePathname();
  //          state: 로그인 유저 상태          //
  const user = useAuthStore(state => state.user);
  //          state: 히든 페이지 상태          //
  const [isHidden, setIsHidden] = useState(false);

  //          function: 탭 활성화 함수          //
  const isActiveTab = (targetPath: string) => pathname.startsWith(targetPath);

  //          effect: path가 변경될 때마다 실행할 함수          //
  useEffect(() => {
    const hidden = [
      '/user/setting',
      '/user/edit',
      '/login',
      '/community/write',
      '/shop/cart',
      '/live',
      '/hobby',
    ];
    const shouldHide = hidden.some(path => pathname.startsWith(path));
    const shopDetailPath = pathname.match(/^\/shop\/\d+/);
    const communityUpdatePath = pathname.match(/^\/community\/update\/\d+/);
    const communityDetailPath = pathname.match(/^\/community\/\d+/);

    setIsHidden(
      shouldHide ||
        !!shopDetailPath ||
        !!communityUpdatePath ||
        !!communityDetailPath,
    );
  }, [pathname]);

  if (isHidden) return null;
  //          render: 탭바 컴포넌트 렌더링          //
  return (
    <>
      <nav className="fixed bottom-0 z-50 flex h-14 w-full max-w-[600px] items-center justify-around border-t border-[#EAEAEA] bg-white">
        {/* 캐릭터 탭 */}
        <Link
          href="/character"
          className="flex h-full w-full flex-col items-center justify-center"
          prefetch={true}
        >
          <motion.div
            whileTap={{ scale: 1.2 }}
            animate={{ scale: isActiveTab('/character') ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <PawPrint
              className="mb-1 size-5"
              stroke={isActiveTab('/character') ? '#4A4A4A' : '#C3C3C3'}
            />
          </motion.div>
          <span
            className={cn(
              'text-xs',
              isActiveTab('/character') ? 'text-[#4A4A4A]' : 'text-[#C3C3C3]',
            )}
          >
            캐릭터
          </span>
        </Link>

        {/* 커뮤니티 탭 */}
        <Link
          href="/community"
          className={cn(
            'flex h-full w-full flex-col items-center justify-center',
            isActiveTab('/community') ? 'text-[#4A4A4A]' : 'text-[#4B5563]',
          )}
          prefetch={true}
        >
          <motion.div
            whileTap={{ scale: 1.2 }}
            animate={{ scale: isActiveTab('/community') ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <MessageCircle
              className="mb-1 size-5"
              stroke={isActiveTab('/community') ? '#4A4A4A' : '#C3C3C3'}
            />
          </motion.div>
          <span
            className={cn(
              'text-xs',
              isActiveTab('/community') ? 'text-[#4A4A4A]' : 'text-[#C3C3C3]',
            )}
          >
            커뮤니티
          </span>
        </Link>

        {/* 라이브 탭 */}
        <Link
          href="/live"
          className={cn(
            'flex h-full w-full flex-col items-center justify-center',
            isActiveTab('/live') ? 'text-[#4A4A4A]' : 'text-[#4B5563]',
          )}
          prefetch={true}
        >
          <motion.div
            whileTap={{ scale: 1.2 }}
            animate={{ scale: isActiveTab('/live') ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Radio
              className="mb-1 size-5"
              stroke={isActiveTab('/live') ? '#4A4A4A' : '#C3C3C3'}
            />
          </motion.div>
          <span
            className={cn(
              'text-xs',
              isActiveTab('/live') ? 'text-[#4A4A4A]' : 'text-[#C3C3C3]',
            )}
          >
            라이브
          </span>
        </Link>

        {/* 쇼핑 탭 */}
        <Link
          href="/shop"
          className="flex h-full w-full flex-col items-center justify-center"
          prefetch={true}
        >
          <motion.div
            whileTap={{ scale: 1.2 }}
            animate={{ scale: isActiveTab('/shop') ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <ShoppingBag
              className="mb-1 size-5"
              stroke={isActiveTab('/shop') ? '#4A4A4A' : '#C3C3C3'}
            />
          </motion.div>
          <span
            className={cn(
              'text-xs',
              isActiveTab('/shop') ? 'text-[#4A4A4A]' : 'text-[#C3C3C3]',
            )}
          >
            쇼핑
          </span>
        </Link>

        {/* 마이페이지 탭 */}
        <Link
          href={user ? `/user/${user?._id}` : '/login'}
          className="flex h-full w-full flex-col items-center justify-center"
          prefetch={true}
        >
          <motion.div
            whileTap={{ scale: 1.2 }}
            animate={{ scale: isActiveTab(`/user/${user?._id}`) ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <UserRound
              className="mb-1 size-5"
              stroke={isActiveTab(`/user/${user?._id}`) ? '#4A4A4A' : '#C3C3C3'}
            />
          </motion.div>
          <span
            className={cn(
              'text-xs',
              isActiveTab(`/user/${user?._id}`)
                ? 'text-[#4A4A4A]'
                : 'text-[#C3C3C3]',
            )}
          >
            마이
          </span>
        </Link>
      </nav>
      <div className="h-14"></div>
    </>
  );
}
