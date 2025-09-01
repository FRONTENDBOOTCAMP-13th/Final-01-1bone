'use client';

// import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';

// 상품 상세 정보 컴포넌트
export const ProductDetailInfo = ({
  item,
  price,
  discountRate,
  extra,
  sizes,
  colors,
}) => {
  const recommendData = {
    inhwan: { name: '인환', color: 'bg-[#FE508B]', textColor: 'text-white' },
    hyunji: { name: '현지', color: 'bg-[#FAB91D]', textColor: 'text-black' },
    woomin: { name: '우민', color: 'bg-[#51AAED]', textColor: 'text-white' },
    youngchan: { name: '영찬', color: 'bg-[#D2E308]', textColor: 'text-black' },
    ayoung: { name: '아영', color: 'bg-[#6E67DA]', textColor: 'text-white' },
  };

  const recommendInfo = extra?.recommendedBy
    ? recommendData[extra.recommendedBy]
    : null;

  const originalPrice = extra.originalPrice;
  return (
    <section className="h-auto items-center justify-center px-4 py-3">
      {recommendInfo && (
        <span
          className={`mb-2 flex h-[28px] w-[76px] items-center justify-center rounded-[6px] text-[12px] ${recommendInfo.color} ${recommendInfo.textColor}`}
        >
          {recommendInfo.name} PICK
        </span>
      )}
      <h1 className="relative text-[18px] text-[#121212]">{item.name}</h1>
      <span className="flex flex-col pt-4 text-[12px] text-[#828A8F] line-through">
        {originalPrice.toLocaleString()}원
      </span>
      <div className="flex items-center">
        {discountRate > 0 && (
          <span className="pr-2 text-[18px] font-semibold text-[#F05656]">
            {discountRate.toLocaleString()}%
          </span>
        )}
        <span className="justify-self-center text-[18px] font-semibold text-[#34383C]">
          {item.price.toLocaleString()}원
        </span>
        <span className="ml-auto flex h-[30px] w-[76px] items-center justify-center rounded-[3px] bg-[#F3F4F6] text-[14px] text-black">
          무료배송
        </span>
      </div>
    </section>
  );
};

// 수량 선택
export const ProductQuantitySelector = ({
  selectedOption,
  quantity,
  onIncrease,
  onDecrease,
  price,
  originalPrice,
  item,
}: {
  selectedOption?: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  price: number;
  originalPrice: number;
  item: { name: string };
}) => {
  return (
    <section className="mx-4 mt-4 h-auto rounded-[8px] bg-[#F5F6F6] p-3">
      <div className="flex items-start justify-between">
        <h2 className="text-[15px] text-black">{item.name}</h2>
        {selectedOption && (
          <span className="pl-4 text-[14px] font-medium whitespace-nowrap text-[#4B5563]">
            {selectedOption}
          </span>
        )}
      </div>
      <div id="counter" className="mt-4 flex gap-4">
        <button
          type="button"
          className={`flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full border ${
            quantity === 1
              ? 'border-[#ECEDEE] bg-[#EAEAEA]'
              : 'border-[#ECEDEE] bg-white'
          } text-[18px] leading-none text-[#ECEDEE]`}
          onClick={onDecrease}
          disabled={quantity === 1}
        >
          <Minus size={20} color="#575758" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="cursor-pointer px-2 text-[18px] text-[#575758]"
        >
          {quantity}
        </button>
        <button
          type="button"
          className="flex size-7 cursor-pointer items-center justify-center rounded-full border border-[#EAEAEA] bg-white text-[18px] leading-none text-[#4B5563]"
          onClick={onIncrease}
        >
          <Plus size={20} strokeWidth={1.5} color="#575758" />
        </button>
        <span className="ml-auto flex items-center justify-center text-[16px] font-semibold text-[#121212]">
          {(quantity * price).toLocaleString()}원
        </span>
      </div>
    </section>
  );
};

// 상품 액션 버튼 컴포넌트
interface ProductActionButtonsProps {
  onCartClick: () => void;
  onBuyNowClick: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    productImg: string;
  };
  options?: { id: string; name: string; price: number }[];
  cartButtonDisabled?: boolean;
}

export const ProductActionButtons = ({
  onCartClick,
  onBuyNowClick,
  product,
  options,
  cartButtonDisabled = false,
}: ProductActionButtonsProps) => {
  return (
    <div className="mb-3 flex h-[50px] justify-between gap-3">
      <button
        onClick={onCartClick}
        disabled={cartButtonDisabled}
        className={`w-[40%] min-w-[105px] cursor-pointer rounded-[5px] border border-[#C3C3C3] px-2 py-2 text-[16px] text-black hover:bg-[#EAEAEA] ${
          cartButtonDisabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        장바구니 담기
      </button>
      <button
        onClick={onBuyNowClick}
        className="w-[60%] min-w-[105px] cursor-pointer rounded-[5px] bg-[#4B5563] px-2 py-2 text-[16px] font-semibold text-white hover:bg-[#2C2F33]"
      >
        바로 구매하기
      </button>
    </div>
  );
};

// 총 결제 금액 컴포넌트
export const TotalPrice = ({
  quantity,
  price,
  originalPrice,
}: {
  quantity: number;
  price: number;
  originalPrice?: number;
}) => {
  const totalPrice = quantity * (price ?? originalPrice);

  return (
    <section className="z-20 mb-1 flex h-[50px] items-center justify-between bg-white px-4">
      <span className="text-[18px] font-semibold text-black">총 결제 금액</span>
      <span className="text-[20px] font-semibold text-black">
        {totalPrice.toLocaleString()}원
      </span>
    </section>
  );
};
