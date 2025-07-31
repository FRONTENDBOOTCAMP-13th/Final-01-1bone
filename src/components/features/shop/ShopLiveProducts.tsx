'use client';

import { ShopProduct } from '@/components/features/shop/ShopProduct';
import { useLiveStore } from '@/store/live.store';
import { Product } from '@/types';
import moment from 'moment';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.css';

export const ShopLiveProducts = ({ liveData }: { liveData: Product[] }) => {
  const currentLive = useLiveStore(state => state.currentLive);
  const now = moment();

  const getLiveRank = (product: Product) => {
    const start = moment(product.extra.live?.start);
    const end = moment(product.extra.live?.end);

    if (now.isBetween(start, end)) return 0; // 라이브 중
    if (now.isBefore(start)) return 1; // 라이브 예정
    return 2; // 라이브 끝
  };

  const sortedLiveData = [...liveData].sort(
    (a, b) => getLiveRank(a) - getLiveRank(b),
  );

  const liveProducts = sortedLiveData.map(product => {
    const liveInfo = currentLive.find(live => live._id === product._id);
    const isLiveNow = liveInfo && now.isBetween(liveInfo.start, liveInfo.end);
    const isEnded = now.isAfter(product.extra.live?.end);

    const matchedLive = liveData.find(live => live._id === product._id);
    const start = moment(matchedLive?.extra?.live?.start);

    return (
      <SwiperSlide key={product._id} className="mr-2.5 !w-[calc(100%/3.5)]">
        {!isLiveNow ? (
          <div className="pointer-events-none select-none">
            <div className="absolute z-2 flex aspect-square w-full rounded-2xl bg-black/50 text-white">
              <p className="absolute top-1/2 h-fit w-full -translate-y-1/2 text-center text-xs md:text-sm">
                {isEnded ? (
                  '종료된 라이브'
                ) : (
                  <>
                    {start.format('MM월 DD일')} <br />
                    {start.format('HH시')} <br />
                    라이브 예정
                  </>
                )}
              </p>
            </div>
            <ShopProduct
              _id={product._id}
              price={product.price}
              name={product.name}
              mainImageSrc={product.mainImages[0]?.path}
              category={product.extra.category}
              discountRate={product.extra.discountRate}
              recommendedBy={product.extra.recommendedBy}
              textPrice="text-sm"
            />
          </div>
        ) : (
          <ShopProduct
            _id={product._id}
            price={product.price}
            name={product.name}
            mainImageSrc={product.mainImages[0]?.path}
            category={product.extra.category}
            discountRate={product.extra.discountRate}
            recommendedBy={product.extra.recommendedBy}
            textPrice="text-sm"
          />
        )}
      </SwiperSlide>
    );
  });

  return (
    <>
      <Swiper spaceBetween={10} slidesPerView={3.5}>
        {liveProducts}
      </Swiper>

      {liveData.length === 0 && (
        <p className="p-10 text-center text-[#c3c3c3]">
          이번 달 라이브 특가 상품이 없습니다.
        </p>
      )}
    </>
  );
};
