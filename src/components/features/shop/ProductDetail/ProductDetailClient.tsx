'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import {
  ProductActionButtons,
  TotalPrice,
} from '@/components/features/shop/ProductDetail/ProductDetail';
import { OptionSelector } from '@/components/features/shop/ProductDetail/OptionSelector';
import { useCart } from '@/components/features/shop/ProductDetail/CartContext';
import { ProductQuantitySelector } from '@/components/features/shop/ProductDetail/ProductDetail';
import { fetchAddToCart } from '@/data/functions/CartFetch.client';

import { usePurchaseStore } from '@/store/order.store';
import { SmallLoading } from '@/components/common/SmallLoading';
import toast from 'react-hot-toast';

export default function CartAction({
  price,
  options,
  discountRate,
  item,
}: {
  price: number;
  options: { size: number[] | string[]; color: string[] };
  discountRate: number;
  item: {
    id: string;
    name: string;
    price: number;
    productImg?: string;
    originalPrice?: number;
  };
}) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasOptions = options && (options.size || options.color);

  const resetOptions = () => {
    setSelectedSize(undefined);
    setSelectedColor(undefined);
    setLoading(false); // 옵션 초기화 시 버튼도 활성화
  };

  // 옵션 선택 시 버튼 활성화
  const handleOptionSelect = (type: 'size' | 'color', value: string) => {
    if (type === 'size') setSelectedSize(value);
    if (type === 'color') setSelectedColor(value);
    setLoading(false);
  };

  // 장바구니 담기
  const handleAddToCart = async () => {
    if (loading) return; // 이미 비활성화면 중복 방지

    if (isBottomSheetOpen) {
      // 옵션이 있는 경우
      if (hasOptions) {
        const sizeRequired = options?.size?.length && !selectedSize;
        const colorRequired = options?.color?.length && !selectedColor;

        if (sizeRequired && colorRequired) {
          toast.error('옵션을 모두 선택해 주세요!');
          return;
        }
        if (sizeRequired || colorRequired) {
          toast.error('옵션을 선택해 주세요!');
          return;
        }
      }

      setLoading(true); // 버튼 비활성화

      try {
        const response = await fetchAddToCart({
          product_id: Number(item.id),
          quantity,
          size: selectedSize,
          color: selectedColor,
        });
        console.log('장바구니 추가 성공 응답:', response);

        toast.success('장바구니에 상품이 추가되었습니다!');
        setIsBottomSheetOpen(false); // 바텀시트 닫기
        resetOptions(); // 옵션 초기화
      } catch (error) {
        console.error('장바구니 추가 중 오류 발생:', error);
        toast.error('장바구니 추가에 실패했습니다.');
        setLoading(false); // 실패 시 다시 활성화
      } finally {
        setLoading(false);
      }
    } else {
      setIsBottomSheetOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (!isBottomSheetOpen) {
      setIsBottomSheetOpen(true);
      return;
    }
    if (
      options?.size?.length &&
      !selectedSize &&
      options?.color?.length &&
      !selectedColor
    ) {
      toast.error('옵션을 하나 이상 선택해주세요!');
      return;
    }

    setIsBottomSheetOpen(false);
    setLoading(true);

    const purchaseData = {
      id: item.id,
      name: item.name,
      originalPrice: item.originalPrice,
      price: item.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      productImg: item.productImg || '',
    };

    console.log('purchaseData', purchaseData);

    usePurchaseStore.getState().setPurchaseData([purchaseData]);
    router.push(`/shop/purchase`);
    resetOptions(); // 옵션 초기화
  };

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => {
      setIsBottomSheetOpen(false);
      resetOptions(); // 옵션 초기화
    },
    trackMouse: true,
  });

  // 옵션이 모두 선택되어야 버튼 활성화
  const isOptionSelected =
    (options?.size?.length ? !!selectedSize : true) &&
    (options?.color?.length ? !!selectedColor : true);

  return (
    <>
      {/* 상품 액션 버튼 */}
      <div className="bt-rounded-[8px] fixed bottom-0 z-30 w-full max-w-[600px] bg-white px-4 py-3">
        <ProductActionButtons
          onCartClick={handleAddToCart}
          onBuyNowClick={handleBuyNow}
          product={{
            id: item.id,
            name: item.name,
            price: item.price,
            productImg: item.productImg || '',
          }}
          options={options?.size?.map(size => ({
            id: size.toString(),
            name: `사이즈 ${size}`,
            price: item.price,
          }))}
          // 버튼 비활성화 조건 전달
        />
      </div>

      {/* 바텀시트 어두운 배경 */}
      {isBottomSheetOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center"
          onClick={() => {
            setIsBottomSheetOpen(false);
            resetOptions(); // 옵션 초기화
          }}
        >
          <div className="h-full w-full max-w-[600px] bg-black opacity-50"></div>
        </div>
      )}

      {/* 바텀시트 */}
      {isBottomSheetOpen && (
        <div
          {...swipeHandlers}
          className={`fixed z-20 flex w-full max-w-[600px] min-w-[300px] flex-col rounded-t-[16px] bg-white shadow-lg ${
            hasOptions ? 'bottom-[78px]' : 'bottom-[78px]'
          }`}
        >
          <div className="flex justify-center">
            <div className="mt-1.5 h-[4px] w-[100px] rounded-full bg-[#EAEAEA]" />
          </div>

          {hasOptions ? (
            <>
              {/* 사이즈 옵션 */}
              {options.size && (
                <div className="bg-white px-4 pt-3.5 pb-3">
                  <OptionSelector
                    name="사이즈"
                    options={options.size}
                    selectedOption={selectedSize || ''}
                    onSelect={value => handleOptionSelect('size', value)}
                    onOpen={() => setSelectedSize('')}
                  />
                </div>
              )}

              {options.color && (
                <div className="bg-white px-4 pt-3.5 pb-3">
                  <OptionSelector
                    name="색상"
                    options={options.color}
                    selectedOption={selectedColor || ''}
                    onSelect={value => handleOptionSelect('color', value)}
                    onOpen={() => setSelectedColor('')}
                  />
                </div>
              )}

              {(selectedSize || selectedColor) && (
                <ProductQuantitySelector
                  selectedOption={`${
                    selectedSize ? `${selectedSize}` : ''
                  }${selectedSize && selectedColor ? ' | ' : ''}${
                    selectedColor ? `${selectedColor}` : ''
                  }`}
                  quantity={quantity}
                  onIncrease={() => setQuantity(prev => prev + 1)}
                  onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                  price={item.price}
                  originalPrice={item.originalPrice || item.price}
                  item={item}
                />
              )}
              {(selectedSize || selectedColor) && (
                <TotalPrice
                  quantity={quantity}
                  price={item.price}
                  originalPrice={item.originalPrice}
                />
              )}
            </>
          ) : (
            <>
              <ProductQuantitySelector
                selectedOption=""
                quantity={quantity}
                onIncrease={() => setQuantity(prev => prev + 1)}
                onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                price={item.price}
                originalPrice={item.originalPrice || item.price}
                item={item}
              />
              <TotalPrice
                quantity={quantity}
                price={item.price}
                originalPrice={item.originalPrice}
              />
            </>
          )}
        </div>
      )}

      {loading && <SmallLoading />}
    </>
  );
}
