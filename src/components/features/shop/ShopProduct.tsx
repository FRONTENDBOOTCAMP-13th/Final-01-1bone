'use client';

import { LiveProgress } from '@/components/features/live/LiveProgress';
import { useLiveStore } from '@/store/live.store';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

//        interface: 상품 인터페이스        //
interface ShopProductProps {
  _id: number;
  price: number;
  name: string;
  mainImageSrc: string;
  category: string[];
  discountRate: number;
  recommendedBy: string;
  textPrice: string;
}

//       component: shop main 상품 컴포넌트       //
export const ShopProduct = ({
  _id,
  price,
  name,
  mainImageSrc,
  discountRate,
  recommendedBy,
  textPrice,
}: ShopProductProps) => {
  // 카테고리 한글 변환, 배경색, 글자색
  const recommendData: Record<
    string,
    { name: string; color: string; textColor: string }
  > = {
    inhwan: { name: '인환', color: 'bg-[#FE508B]', textColor: 'text-white' },
    hyunji: { name: '현지', color: 'bg-[#FAB91D]', textColor: 'text-black' },
    woomin: { name: '우민', color: 'bg-[#51AAED]', textColor: 'text-white' },
    youngchan: { name: '영찬', color: 'bg-[#D2E308]', textColor: 'text-black' },
    ayoung: { name: '아영', color: 'bg-[#6E67DA]', textColor: 'text-white' },
  };

  const recommendInfo = recommendData[recommendedBy];

  const currentLive = useLiveStore(state => state.currentLive);

  const now = moment();

  const isLive = currentLive.some(product => {
    if (product._id !== _id) return false;

    const start = moment(product.start);
    const end = moment(product.end);

    return now.isBetween(start, end);
  });

  //        render: 상품 렌더        //
  return (
    <Link
      href={isLive ? '/live' : `/shop/${_id}`}
      className={`mb-2 flex w-full flex-col gap-1`}
    >
      {/* 라이브 중인 상품일 경우 라이브 뱃지 */}
      {isLive && (
        <div className="absolute top-2 -left-2 z-5">
          <LiveProgress />
        </div>
      )}

      <div className={`relative mb-1 aspect-square w-full`}>
        <Image
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          src={`${API_URL}/${mainImageSrc}`}
          alt={`/${mainImageSrc}`}
          sizes="100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="pointer-events-none rounded-xl"
        />
      </div>

      <div className="flex max-w-full gap-2 text-wrap">
        <p className="pointer-events-none overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap">
          {name}
        </p>

        {recommendedBy && (
          <span
            className={`${recommendInfo.color} pointer-events-none flex items-center rounded-sm px-2 text-[8px] whitespace-nowrap ${recommendInfo.textColor}`}
          >
            {recommendInfo.name}PICK
          </span>
        )}
      </div>
      <p className={`${textPrice} font-semibold`}>
        {discountRate && (
          <span className="sale pointer-events-none mr-1 text-[#FE508B]">
            {discountRate}%
          </span>
        )}
        {price}원
      </p>
    </Link>
  );
};
