'use client';

import { BackButton } from '@/components/common/BackButton';
import SearchButton from '@/components/common/SearchHeader';
import { SettingButton } from '@/components/common/SettingButton';
import CharacterInfoModal from '@/components/features/character/ChracterInfoModal';
import { LiveCalendarBtn } from '@/components/features/live/LiveCalendarBtn';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useModalStore } from '@/store/modal.store';
import { Info, Pencil, ShoppingCart, Siren } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { CartIcon } from '@/components/features/shopping-cart/CartIcon';
import { useEffect, useState } from 'react';
import { fetchCartList } from '@/data/functions/CartFetch.client';
import { CartContextType } from '@/types/cart';
import { useCart } from '@/components/features/shop/ProductDetail/CartContext';
// import { useCart } from '@/hooks/useCart';
import { useCartStore } from '@/store/cartStore';

//          component: 헤더 컴포넌트          //
export default function Header() {
  //          state: 로그인 유저 정보 가져오기          //
  const { user } = useAuthStore();

  //          state: 현재 경로(pathname) 가져오기          //
  const pathname = usePathname();

  const router = useRouter();
  //          function: 오픈 모달 함수          //
  const openModal = useModalStore(state => state.openModal); // 성공 모달 열기용

  //          state: 경로에 따른 페이지 상태          //
  const isUserPage = useMemo(() => /^\/user\/\d+/.test(pathname), [pathname]); // 유저 상세 페이지
  const isFollowPage = useMemo(
    () => /^\/user\/\d+\/follow/.test(pathname),
    [pathname],
  ); // 팔로우 페이지
  const isBookmarkPage = useMemo(
    () => /^\/user\/\d+\/bookmark/.test(pathname),
    [pathname],
  ); // 북마크 페이지
  const isProductPage = useMemo(
    () => /^\/shop\/\d+/.test(pathname),
    [pathname],
  ); // 제품 상세 페이지
  const isFeedPage = useMemo(
    () => /^\/community\/\d+/.test(pathname),
    [pathname],
  ); // 피드 페이지
  const isCommunityUpdatePage = useMemo(
    () => /^\/community\/update\/\d+/.test(pathname),
    [pathname],
  );

  //          state: 고정 경로 페이지 상태          //
  const isLoginPage = pathname === '/login'; // 로그인 페이지
  const isShopPage = pathname === '/shop'; // 쇼핑 메인
  const isCommunityPage = pathname === '/community'; // 커뮤니티 메인
  const isCommunityWritePage = pathname === '/community/write'; // 커뮤니티 작성 페이지
  const isSettingPage = pathname === '/user/setting'; // 설정 페이지
  const isEditPage = pathname === '/user/edit'; // 프로필 수정 페이지
  const isCartPage = pathname === '/shop/cart'; // 장바구니 페이지
  const isTermsPage = pathname === '/terms'; // 약관 페이지
  const isPolicyPage = pathname === '/policy'; // 개인정보 처리방침 페이지
  const isNoticePage = pathname.startsWith('/notice'); // 공지사항 페이지
  const isContactPage = pathname === '/contact'; // 고객센터 페이지
  const isCharacterPage = pathname === '/character'; // 고객센터 페이지
  const isSearchPage = pathname.startsWith('/search');
  const isLivePage = pathname === '/live';
  const isHobbyPage = pathname === '/hobby';
  const isRandomHobbyPage = pathname === '/shop/randomHobby';

  //          state: 현재 페이지가 내 마이페이지인지 여부          //
  const isMypage = user && pathname === `/user/${user._id}`;

  //          logic: 헤더 조건 처리 (렌더링 조건)          //
  const showLogo =
    isCommunityPage ||
    isShopPage ||
    isCharacterPage ||
    (isUserPage && isMypage); // 로고 노출 여부
  const showBackButton =
    isSettingPage ||
    isCartPage ||
    isFollowPage ||
    isProductPage ||
    isTermsPage ||
    isPolicyPage ||
    isNoticePage ||
    isContactPage ||
    (isUserPage && !isMypage) ||
    isFeedPage ||
    isLivePage ||
    isHobbyPage ||
    isRandomHobbyPage ||
    isBookmarkPage; // 일반 뒤로가기 버튼 노출 조건
  const showConfirmBackButton =
    isEditPage || isCommunityWritePage || isCommunityUpdatePage; // 뒤로가기 시 확인이 필요한 페이지
  const showCartIcon = isShopPage || isProductPage; // 쇼핑카트 아이콘 노출 조건

  //          state: 장바구니 아이콘의 상품 개수 가져오기            //
  const { cartItems } = useCart(); // 장바구니 아이템 가져오기
  const cartCount = cartItems.length; // 장바구니 상품 개수 계산
  const { setCartItems } = useCart();

  useEffect(() => {
    const fetchAndSetCart = async () => {
      try {
        const res = await fetchCartList(1, 10);
        setCartItems(res.item);
      } catch (err) {
        console.error('장바구니 목록 불러오기 실패', err);
      }
    };
    fetchAndSetCart();
  }, [setCartItems]);

  const confirmBackLabel = useMemo(() => {
    if (isCommunityWritePage) return '피드 작성';
    if (isEditPage) return '프로필 수정';
    if (isCommunityUpdatePage) return '피드 수정';
    return '';
  }, [isCommunityWritePage, isEditPage, isCommunityUpdatePage]);

  //          render: 로그인 페이지에서는 헤더 숨김 처리          //
  if (isLoginPage) return null;

  //          render: 헤더 컴포넌트 렌더링          //
  return (
    <header
      className={cn(
        'w-full',
        isCharacterPage || isLivePage || isHobbyPage ? 'h-0' : 'h-12',
      )}
    >
      <div
        className={cn(
          // ↓ 조건에 따라 absolute 또는 fixed
          isCharacterPage || isLivePage || isHobbyPage
            ? 'absolute bg-transparent'
            : 'fixed bg-white',
          'top-0 z-50 flex min-h-12 w-full max-w-[600px] items-center',
        )}
      >
        <div className="relative flex w-full items-center">
          {/* 왼쪽 영역 */}
          <div className="absolute left-4 flex items-center">
            {showLogo && (
              <Image
                src="/images/etc/logo.svg"
                alt="로고"
                width={70}
                height={50}
                priority
                className="h-auto w-[70px]"
              />
            )}

            {showBackButton && (
              <BackButton
                onClickBack={
                  isHobbyPage ? () => router.replace('/character') : undefined
                }
                className={cn(isLivePage && 'text-white')}
              />
            )}
            {showConfirmBackButton && (
              <BackButton needConfirm label={confirmBackLabel} />
            )}
          </div>

          {/* 가운데 타이틀 영역 */}
          <h3
            className={cn(
              'flex w-full items-center justify-center text-lg font-medium text-[#4A4A4A]',
              isLivePage && 'text-white',
            )}
          >
            {isCommunityWritePage && '피드등록'}
            {isSettingPage && '설정'}
            {isEditPage && '프로필 수정'}
            {isCartPage && '장바구니'}
            {isProductPage && '제품 상세'}
            {isBookmarkPage && '게시물 북마크'}
            {isFeedPage && '피드상세'}
            {isLivePage && '라이브'}
            {isHobbyPage && '취미 선택'}
            {isRandomHobbyPage && '취향 뽑기'}
            {isTermsPage && '서비스 이용약관'}
            {isPolicyPage && '개인정보 처리방침'}
            {isNoticePage && '공지사항'}
            {isContactPage && '고객센터'}
            {isCommunityUpdatePage && '피드수정'}
          </h3>

          {/* 오른쪽 아이콘 영역 */}
          <div className="absolute right-4 flex items-center gap-6">
            {(isShopPage || isSearchPage) && (
              <Suspense>
                <SearchButton />
              </Suspense>
            )}

            {showCartIcon && (
              <div className="absolute right-4 flex items-center gap-6">
                <Link href="/shop/cart" className="relative">
                  <CartIcon />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                      style={{ minWidth: 20 }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {isUserPage && isMypage && <SettingButton />}
            {isUserPage && !isMypage && !isFollowPage && !isBookmarkPage && (
              <Siren />
            )}
            {isCommunityPage && (
              <Link
                href="/community/write"
                className="flex items-center gap-2 rounded-md px-2 py-2"
              >
                <Pencil size={20} className="text-[#4A4A4A]" />
                {/* <span className="text-sm text-[#4A4A4A]">피드 작성</span> */}
              </Link>
            )}
            {isCharacterPage && (
              <>
                <Info
                  className="cursor-pointer"
                  onClick={() =>
                    openModal(({ onClose }) => (
                      <CharacterInfoModal onClose={onClose} />
                    ))
                  }
                />
              </>
            )}

            {isLivePage && <LiveCalendarBtn />}
          </div>
        </div>
      </div>
    </header>
  );
}
