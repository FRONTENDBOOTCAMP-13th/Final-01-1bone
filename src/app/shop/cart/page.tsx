'use client';

import { useEffect, useState } from 'react';
import { fetchCartList } from '@/data/functions/CartFetch.client';
import { CartItem } from '@/types/cart';
import { CartItemCard } from '@/components/features/shopping-cart/CartItemCard';
import { ChevronLeft, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePurchaseStore } from '@/store/order.store';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { fetchDeleteAllCarts } from '@/data/functions/CartFetch.client';

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    selectedCartIds,
    selectAllCartItems,
    deselectAllCartItems,
    removeCartItem,
    setCartItems,
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCartList(1, 10);
        setCartItems(data.products);
      } catch (err) {
        console.error('장바구니 데이터를 가져오는 중 오류 발생:', err);
        setError('장바구니 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, [setCartItems]);

  if (isLoading) return <p className="py-10 text-center">로딩 중...</p>;
  if (error) return <p className="py-10 text-center text-red-500">{error}</p>;
  if (cartItems.length === 0) {
    return <p className="py-10 text-center">장바구니가 비어 있습니다.</p>;
  }

  const handleSelectedRemove = async () => {
    try {
      if (selectedCartIds.length === 0) {
        alert('삭제할 항목을 선택하세요.');
        return;
      }

      // API 호출로 선택된 항목 삭제
      await fetchDeleteAllCarts(selectedCartIds);

      // Zustand 상태에서 삭제된 항목 제거
      selectedCartIds.forEach(id => removeCartItem(id));

      alert('선택된 항목이 삭제되었습니다.');
    } catch (error) {
      console.error('선택 삭제 중 오류 발생:', error);
      alert('선택 삭제에 실패했습니다.');
    }
  };

  const handelAddBuy = () => {
    const selectedItems = cartItems.filter(item =>
      selectedCartIds.includes(item._id),
    );

    const purchaseData = selectedItems.map(item => ({
      id: item._id.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      productImg: item.mainImages[0] || '',
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
          onClick={selectAllCartItems}
          aria-label="전체 상품 선택"
          className="absolute top-3.5"
        >
          <Image
            src="/check-on.svg"
            alt="전체 선택 설정 버튼"
            width={20}
            height={20}
            className="ml-5"
          />
        </button>
        <button
          onClick={deselectAllCartItems}
          aria-label="전체 상품 선택 해제"
          className="absolute top-3.5 left-20"
        >
          <Image
            src="/check-off.svg"
            alt="전체 선택 해제 버튼"
            width={20}
            height={20}
            className="ml-5"
          />
        </button>
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
            key={`${item._id}-${item.name}-${index}`}
            id={item._id}
            path={item.mainImages[0]}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            isChecked={selectedCartIds.includes(item._id)}
          />
        ))}
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
