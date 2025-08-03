'use client';

import { useEffect, useState } from 'react';
import { fetchCartList } from '@/data/functions/CartFetch.client';
import { CartItem } from '@/types/cart';
import { CartItemCard } from '@/components/features/shopping-cart/CartItemCard';
import {
  Banknote,
  ChevronLeft,
  CreditCard,
  MapPin,
  WalletCards,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePurchaseStore } from '@/store/order.store';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [ispaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCartList(1, 10);
        setCartItems(
          data.item.map(item => ({
            ...item,
            product: {
              _id: item.product._id,
              image: item.product.image ?? [],
              name: item.product.name,
              path: item.product.image.path,
              price: item.product.price,
              quantity: item.product.quantity,
              size: item.product.size ?? '',
              color: item.product.color ?? '',
              extra: item.product.extra ?? {
                originalPrice: item.product.price,
              },
            },
            isChecked: false,
            cartId: item._id,
            quantity: item.quantity,
          })),
        );
      } catch (err) {
        console.error('장바구니 데이터를 가져오는 중 오류 발생:', err);
        setError('장바구니 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, []);

  if (isLoading) return <p className="py-10 text-center">로딩 중...</p>;
  if (error) return <p className="py-10 text-center text-red-500">{error}</p>;
  if (cartItems.length === 0) {
    return <p className="py-10 text-center">장바구니가 비어 있습니다.</p>;
  }

  const handleAllSelect = () => {
    setIsAllChecked(!isAllChecked);
    setCartItems(prev =>
      prev.map(item => ({
        ...item,
        isChecked: !isAllChecked,
      })),
    );
  };

  const handleItemCheck = (id: number, checked: boolean) => {
    setCartItems(prev => {
      const updatedItems = prev.map(item =>
        item.product._id === id ? { ...item, isChecked: checked } : item,
      );

      const allchecked = updatedItems.every(item => item.isChecked);
      setIsAllChecked(allchecked);
      return updatedItems;
    });
  };

  const handleSelectedRemove = () => {
    const selectedItems = cartItems.filter(item => item.isChecked);

    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    } else {
      setCartItems(prev => prev.filter(item => !item.isChecked));
      setIsAllChecked(false);
    }
  };

  const handleOpenPaymentSheet = () => {
    setIsPaymentSheetOpen(true);
  };

  // ------------------- 충돌
  //  try {
  // API call to delete selected items
  //    await fetchDeleteAllCarts(selectedItems); // API 호출

  const handelAddBuy = () => {
    const selectedItems = cartItems.filter(item => item.isChecked);

    const purchaseData = selectedItems.map(item => ({
      id: item.product._id.toString(),
      name: item.product.name,
      originalPrice: item.product.extra.originalPrice,
      price: item.product.price,
      quantity: item.quantity,
      size: item.product.size,
      color: item.product.color,
      productImg: item.product.image.path || '',
    }));

    console.log('purchaseData', purchaseData);

    // 구매 데이터 저장 및 페이지 이동
    usePurchaseStore.getState().setPurchaseData(purchaseData);
    router.push(`/shop/purchase`);
  };

  return (
    <div className="flex flex-col">
      {/* 상단 */}
      <div className="mt-10">
        <Link href="/shop" className="relative top-7 left-4">
          <ChevronLeft size={24} />
        </Link>
        <p className="text-center text-lg leading-6 font-semibold">장바구니</p>
      </div>
      <hr className="mt-10" />

      {/* 전체 선택 */}
      <div className="relative flex">
        <button
          onClick={handleAllSelect}
          aria-label={isAllChecked ? '전체 상품 선택' : '전체 상품 선택 해제'}
          className="absolute top-3.5"
        >
          {isAllChecked ? (
            <Image
              src="/check-on.svg"
              alt="전체 선택 설정 버튼"
              width={20}
              height={20}
              className="ml-5"
            />
          ) : (
            <Image
              src="/check-off.svg"
              alt="전체 선택 설정 버튼"
              width={20}
              height={20}
              className="ml-5"
            />
          )}
        </button>
        <span className="relative top-3 left-14 text-lg leading-6 font-semibold">
          전체 선택
        </span>
        <button
          className="absolute top-3 right-5 text-[#FE5088]"
          onClick={handleSelectedRemove}
        >
          선택삭제
        </button>
      </div>
      <hr className="my-6" />

      {/* 장바구니에 담긴 상품 리스트 */}
      <div>
        {cartItems.map((item, index) => (
          <CartItemCard
            cartId={item._id}
            key={`${item.product._id}-${item.product.name}-${index}`}
            id={item.product._id}
            path={item.product.image.path}
            name={item.product.name}
            price={item.product.price}
            quantity={item.quantity} // 수정된 부분
            isChecked={item.isChecked}
            onCheck={handleItemCheck}
          />
        ))}
      </div>

      {/* 결제 정보 */}
      <div className="my-6 ml-4 flex flex-col gap-y-4">
        <div>
          <span className="text-[#4B5563]">총 상품금액</span>
          <span className="absolute right-4 font-medium">192,000원</span>
        </div>
        <div>
          <span className="text-[#4B5563]">배송비</span>
          <span className="absolute right-4">무료</span>
        </div>
        <div>
          <span className="text-lg leading-6 font-semibold">총 결제금액</span>
          <span className="absolute right-4 text-lg leading-6 font-semibold text-[#6E67DA]">
            192,000원
          </span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <div className="relative top-3 text-center">
        <button
          className="h-[3.5rem] w-[21.875rem] cursor-pointer rounded-md bg-[#FE508B] text-xl font-semibold text-white hover:bg-[#e6457b]"
          onClick={handelAddBuy}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
