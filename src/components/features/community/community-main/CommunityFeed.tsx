'use client';

import { useEffect, useRef, useState } from 'react';
import { Post } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';
import { getUserImageUrl } from '@/utils';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  MessageCircle,
  MoreHorizontal,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { deletePost } from '@/data/actions/post';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modal.store';
import DeleteModal from '@/components/common/DeleteModal';

// 카카오 SDK 타입 정의
interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (options: {
      objectType: string;
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      };
      buttons: Array<{
        title: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      }>;
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

interface Props {
  post: Post;
  page: 'main' | 'detail';
}

export default function CommunityFeed({ post, page }: Props) {
  const { user, accessToken } = useAuthStore();
  const isOwner = user?._id === post.user._id;
  const imageList = Array.isArray(post.image) ? post.image : [post.image];

  //          state: 정렬 영역 요소 참조 상태          //
  const showMoreRef = useRef<HTMLDivElement | null>(null);

  //          state: more 버튼 상태          //
  const [showMore, setShowMore] = useState<boolean>(false);

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  //          function: 라우터 함수          //
  const router = useRouter(); // 라우터 이동용
  //          function: 오픈 모달 함수          //
  const openModal = useModalStore(state => state.openModal); // 성공 모달 열기용
  const clearModals = useModalStore(state => state.clearModals);
  //         event handler: more 버튼 클릭 이벤트 처리          //
  const onMoreButtonClickHandler = () => {
    setShowMore(!showMore);
  };

  //          event handler: 정렬 박스 외부 영역 클릭 이벤트 처리          //
  const handleOutsideClose = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (showMore && !showMoreRef.current?.contains(target)) setShowMore(false);
  };

  const onDeleteModalOpenHandler = () => {
    openModal(({ onClose }) => (
      <DeleteModal
        key="delete-modal"
        onClose={onClose}
        onConfirm={onDeleteButtonClickHandler}
      />
    ));
  };
  //         event handler: 삭제 버튼 클릭 이벤트 처리          //
  const onDeleteButtonClickHandler = async () => {
    if (!accessToken) return;

    const formData = new FormData();
    formData.append('_id', post._id.toString());
    formData.append('accessToken', accessToken);

    const res = await deletePost(null, formData);

    if (res.ok === 1) {
      clearModals();
      router.push('/community');
    } else {
      console.error('게시물 삭제 안됨');
    }
  };

  //          effect: 정렬 박스 외부 영역 클릭 시 실행할 함수          //
  useEffect(() => {
    document.addEventListener('click', handleOutsideClose);

    return () => document.removeEventListener('click', handleOutsideClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMore]);
  return (
    <div className="w-full overflow-hidden text-[#4A4A4A]">
      {/* 헤더 영역 */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-3">
        <Link
          href={`/user/${post.user._id}`}
          className="relative aspect-square w-[38px] overflow-hidden rounded-full"
        >
          <Image
            src={getUserImageUrl(post.user.image)}
            alt={post.user.name}
            fill
          />
        </Link>
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-bold">{post.user.name}</span>
          <span className="text-xs font-normal text-[#999999]">
            {post.updatedAt.slice(0, 10)}
          </span>
        </div>
        {isOwner && (
          <div className="relative">
            <button
              className="cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
              onClick={onMoreButtonClickHandler}
            >
              <EllipsisVertical size={22} className="text-gray-400" />
            </button>
            {showMore && (
              <div
                ref={showMoreRef}
                className="absolute right-0 z-40 rounded-sm border border-[#dddddd] bg-white px-3 py-2 text-[#4D4D4D] shadow"
              >
                <Link
                  href={`/community/update/${post._id}`}
                  className="w-fit appearance-none px-8 py-1 leading-none whitespace-nowrap"
                  // onClick={onUpdateButtonClickHandler}
                >
                  <span className="text-[#98B87E]">수정</span>
                </Link>
                <div className="my-1">
                  <Separator />
                </div>
                <button
                  className="w-fit cursor-pointer appearance-none px-8 py-1 leading-none whitespace-nowrap"
                  onClick={onDeleteModalOpenHandler}
                >
                  {'삭제'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 본문 영역 */}
      <div className="px-4 pb-2">
        <p
          className={cn(
            'whitespace-pre-wrap text-[#4A4A4A]',
            page === 'main' ? 'line-clamp-3' : '',
          )}
        >
          {post.content}
        </p>
        {page === 'main' && (
          <Link
            href={`/community/${post._id}`}
            className="inline-block text-sm text-[#98B87E] underline"
          >
            자세히 보기
          </Link>
        )}
      </div>

      {/* 이미지 슬라이드 영역 */}
      <div className="relative flex w-full items-center justify-center px-4">
        <Swiper
          spaceBetween={10}
          slidesPerView={1} // 한 화면에 1.2장 보이게
          modules={[Navigation, Pagination]}
          onSwiper={swiper => {
            setSwiper(swiper);
            setCurrentIndex(swiper.activeIndex);
          }}
          onSlideChange={swiper => {
            setCurrentIndex(swiper.activeIndex);
          }}
          pagination={{ type: 'custom' }}
          className="w-full"
        >
          {imageList.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative aspect-square w-full">
                <Image
                  src={img}
                  alt={`피드 이미지 ${idx + 1}`}
                  fill
                  className="rounded-lg object-cover object-center"
                />
                <div className="absolute top-4 right-4 rounded-full bg-white/70 px-2 text-sm text-[#999999]">
                  {idx + 1}/{post.image.length}
                </div>

                {currentIndex > 0 && (
                  <div
                    className="prevEl absolute top-1/2 left-4 z-50 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/30 text-[#6E6E6E]"
                    onClick={() => {
                      swiper?.slidePrev();
                    }}
                  >
                    <ChevronLeft size={28} />
                  </div>
                )}
                {currentIndex < post.image?.length - 1 && (
                  <div
                    className="nextEl absolute top-1/2 right-4 z-50 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/30 text-[#6E6E6E]"
                    onClick={() => {
                      swiper?.slideNext();
                    }}
                  >
                    <ChevronRight size={28} />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 아이콘 영역 */}
      <div className="flex h-12 items-center justify-between px-5 text-[#4A4A4A]">
        {/* 좌측 댓글,공유 아이콘 */}
        <div className="flex items-center gap-3.5">
          <Link
            href={`/community/${post._id}`}
            className="flex cursor-pointer items-center"
          >
            <MessageCircle size={24} className="mr-1.5" />
            <span className="font-semibold">{post.repliesCount}</span>
          </Link>
          <button className="cursor-pointer">
            <SquareArrowOutUpRight size={24} className="" />
          </button>
        </div>

        {/* 우측 북마크 아이콘 */}
        <button className="cursor-pointer">
          <Bookmark size={24} className="text-[#98B87E]" fill="#98B87E" />
        </button>
      </div>
      <div className="px-4 pt-3">
        <Separator />
      </div>
    </div>
  );
}
