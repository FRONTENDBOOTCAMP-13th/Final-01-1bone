'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  ProductActionButtons,
  ProductQuantitySelector,
  TotalPrice,
} from '@/components/features/shop/ProductDetail/ProductDetail';
import { OptionSelector } from '@/components/features/shop/ProductDetail/OptionSelector';
import { useCart } from '@/hooks/useCart';
import Modal, { ModalPanel, ModalBackdrop } from '@/components/common/Modal';

// CTABar 컴포넌트
export const Cta = ({ price }: { price: number }) => {
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isQuantitySelectorEnabled, setIsQuantitySelectorEnabled] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // swipe down 시 바텀시트 닫기
  const swipeHandlers = useSwipeable({
    onSwipedDown: () => setIsBottomSheetOpen(false),
    trackMouse: true,
  });

  // 바텀시트 열기
  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
    setQuantity(1);
    setSelectedOption('');
    setIsQuantitySelectorEnabled(false);
  };

  // 바텀시트 내 실제 "장바구니 담기" 버튼
  const handleAddToCart = () => {
    if (selectedOption && quantity > 0) {
      addToCart({
        name: selectedOption,
        quantity,
        price,
      });
      setIsBottomSheetOpen(false);
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 2000);
    }
  };

  return (
    <>
      {/* 상품 액션 버튼 (ex: 하단 고정) -> 바텀시트를 여는 용도 */}
      <div className="bt-rounded-[8px] fixed bottom-0 z-30 w-full max-w-[600px] bg-white px-5 py-3">
        <ProductActionButtons onCartClick={handleOpenBottomSheet} />
      </div>

      {/* 바텀시트 */}
      {isBottomSheetOpen && (
        <div
          {...swipeHandlers}
          className="fixed bottom-[133px] z-20 w-full max-w-[600px] rounded-t-[16px] bg-white shadow-lg"
        >
          {/* 스와이프 핸들 */}
          <div className="flex justify-center">
            <div className="mt-2.5 h-[4px] w-[109px] rounded-full bg-[#3D3D3D]" />
          </div>

          {/* 옵션 선택 */}
          <div className="bg-white px-5 pt-3.5">
            {/* <OptionSelector
              name="size"
              options={['S', 'M', 'L', 'XL']}
              selectedOption={selectedOption}
              onSelect={option => {
                setSelectedOption(option);
                setIsQuantitySelectorEnabled(true);
              }}
            /> */}
            <OptionSelector
              options={{
                size: [260, 270, 280],
                color: ['brown', 'grey', 'red'],
              }}
              selectedOptions={{
                size: 260,
                color: 'brown',
              }}
              onSelect={(key, selectedOption) => {
                console.log(`Selected ${key}:`, selectedOption);
              }}
            />
          </div>

          {/* 수량 선택 */}
          {isQuantitySelectorEnabled && (
            <div className="bg-white px-5 py-3">
              <ProductQuantitySelector
                selectedOption={selectedOption}
                quantity={quantity}
                onIncrease={() => setQuantity(quantity + 1)}
                onDecrease={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                price={price}
                discountedPrice={price * 0.9}
              />
            </div>
          )}

          {/* 총 결제 금액 */}
          {isQuantitySelectorEnabled && (
            <TotalPrice quantity={quantity} price={price} />
          )}

          {/* 바텀시트 내, "장바구니에 담기" 버튼 (옵션 수량 선택시만) */}
          {isQuantitySelectorEnabled && (
            <div className="flex justify-end p-5">
              <button
                className="rounded-md bg-pink-500 px-6 py-2 font-semibold text-white"
                onClick={handleAddToCart}
              >
                장바구니에 담기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ModalBackdrop />
          <ModalPanel className="px-8 py-6">
            <div className="p-2 text-center">
              <p className="text-lg font-semibold">
                장바구니에 상품이 담겼습니다.
              </p>
            </div>
          </ModalPanel>
        </Modal>
      )}
    </>
  );
};
