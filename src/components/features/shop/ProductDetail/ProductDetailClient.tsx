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
import { ProductOption } from '@/types/product';
import { ProductQuantitySelector } from '@/components/features/shop/ProductDetail/ProductDetail';

// 장바구니 아이콘 컴포넌트 추가
export function CartIcon() {
  const { cartCount } = useCart();
  return (
    <div className="relative">
      <ShoppingCart />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
          {cartCount}
        </span>
      )}
    </div>
  );
}

// 뒤로가기 버튼
export function GoBackButton({ stroke }: { stroke: string }) {
  const handleGoBack = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <button onClick={handleGoBack}>
      <ChevronLeft className={stroke} />
    </button>
  );
}

// 장바구니 담기 버튼 컴포넌트 추가
export function AddToCartBtn({
  product,
}: {
  product: { id: string; name: string; price: number; productImg?: string };
}) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          productImg: product.productImg || '',
        });
        alert('장바구니에 추가되었습니다!');
      }}
      className="rounded-md bg-[#FE508B] px-4 py-2 text-white hover:bg-[#e6457b]"
    >
      장바구니 담기
    </button>
  );
}

// 상품 상세 하위 로직
export default function CartActions({
  price,
  options,
  discountRate,
  item,
}: {
  price: number;
  options: { size: number[]; color: string[] };
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
  const [selectedOptions, setSelectedOptions] = useState<{
    size?: number;
    color?: string;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const hasOptions = options && (options.size || options.color);
  const allOptionsSelected =
    !hasOptions || (selectedOptions.size && selectedOptions.color);

  const handleOptionChange = (
    type: 'size' | 'color',
    value: string | number,
  ) => {
    setSelectedOptions(prev => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    if (!isBottomSheetOpen) {
      // 바텀시트가 열리지 않은 상태에서는 아무 작업 않도록
      setIsBottomSheetOpen(true);
      return;
    }

    if (!allOptionsSelected) {
      alert('모든 옵션을 선택해주세요.');
      return;
    }

    alert('장바구니에 추가되었습니다!');
    setIsBottomSheetOpen(false);
  };

  const handleBuyNow = () => {
    if (!isBottomSheetOpen) {
      // 바텀시트가 열리지 않은 상태에서는 아무 작업 않도록
      setIsBottomSheetOpen(true);
      return;
    }
    if (!allOptionsSelected) {
      alert('모든 옵션을 선택해주세요.');
      return;
    }

    alert('결제 페이지로 이동합니다!');
    setIsBottomSheetOpen(false);

    const selectedOptionDetails = {
      size: selectedOptions.size,
      color: selectedOptions.color,
    };

    // router.push({
    //   pathname: '/checkout',
    //   query: {
    //     id: item.id,
    //     name: item.name,
    //     price: item.price,
    //     quantity,
    //     options: JSON.stringify(selectedOptionDetails),
    //   },
    // });
  };

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => setIsBottomSheetOpen(false),
    trackMouse: true,
  });

  return (
    <>
      {/* 상품 액션 버튼 */}
      <div className="bt-rounded-[8px] fixed bottom-0 z-30 w-full max-w-[600px] bg-white px-5 py-3">
        <ProductActionButtons
          onCartClick={handleAddToCart}
          onBuyNowClick={handleBuyNow}
          product={{
            id: item.id,
            name: item.name,
            price: item.price,
            productImg: item.productImg || '',
          }}
          options={options.size?.map(size => ({
            id: size.toString(),
            name: `사이즈 ${size}`,
            price: item.price,
          }))}
        />
      </div>

      {/* 바텀시트 어두운 배경 */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div className="h-full w-full max-w-[600px] bg-black opacity-50"></div>
        </div>
      )}

      {/* 바텀시트 */}
      {isBottomSheetOpen && (
        <div
          {...swipeHandlers}
          className={`fixed z-20 flex w-full max-w-[600px] flex-col rounded-t-[16px] bg-white shadow-lg ${
            hasOptions ? 'bottom-[78px]' : 'bottom-[78px]'
          }`}
        >
          <div className="flex justify-center">
            <div className="mt-2.5 h-[4px] w-[109px] rounded-full bg-[#3D3D3D]" />
          </div>

          {hasOptions ? (
            <>
              {/* 사이즈 옵션 */}
              {options.size && (
                <div className="bg-white px-5 pt-3.5">
                  <OptionSelector
                    name="사이즈"
                    options={options.size}
                    selectedOption={selectedOptions.size?.toString() || ''}
                    onSelect={value =>
                      handleOptionChange('size', Number(value))
                    }
                  />
                </div>
              )}

              {/* 색상 옵션 */}
              {options.color && (
                <div className="bg-white px-5 pt-3.5">
                  <OptionSelector
                    name="색상"
                    options={options.color}
                    selectedOption={selectedOptions.color || ''}
                    onSelect={value => handleOptionChange('color', value)}
                  />
                </div>
              )}

              {allOptionsSelected && (
                <ProductQuantitySelector
                  selectedOption={`사이즈: ${selectedOptions.size}, 색상: ${selectedOptions.color}`}
                  quantity={quantity}
                  onIncrease={() => setQuantity(prev => prev + 1)}
                  onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                  price={item.price}
                  originalPrice={item.originalPrice || item.price}
                  item={item}
                />
              )}
              {allOptionsSelected && (
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
    </>
  );
}

// NavBar에서 사용할 수 있게 내보내기
CartActions.GoBackButton = GoBackButton;
CartActions.CartIcon = CartIcon;
CartActions.AddToCartBtn = AddToCartBtn;
