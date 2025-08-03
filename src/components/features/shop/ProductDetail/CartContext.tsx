'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import {
  fetchCartList,
  deleteCartItem,
  updateCartItemQuantity,
} from '@/data/functions/CartFetch.client';
import { useAuthStore } from '@/store/auth.store';

// CartContext 타입 정의
interface CartContextType {
  cartItems: any[];
  cartCount: number;
  setCartItems: (items: any[]) => void;
}

// CartContext 생성
const CartContext = createContext<CartContextType | undefined>(undefined);

// useCart 훅 정의
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider 컴포넌트 정의
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { cartItems, setCartItems } = useCartStore();
  const accessToken = useAuthStore.getState().accessToken;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await fetchCartList();
        setCartItems(data.item);
      } catch (error) {
        console.error('장바구니 불러오는 중 오류 발생:', error);
      }
    };

    if (accessToken) {
      fetchCartItems();
    }
  }, [accessToken, setCartItems]);

  return (
    <CartContext.Provider
      value={{
        // cartItems가 undefined일 경우 빈 배열로 설정
        cartItems: cartItems || [],
        // cartItems가 undefined일 경우 0으로 설정
        cartCount: cartItems?.length || 0,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// CartItemCardProps 타입 정의
export interface CartItemCardProps {
  id: number;
  path: string;
  name: string;
  price: number;
  quantity: number;
  isChecked?: boolean;
}

// CartItemCard 컴포넌트 정의
export function CartItemCard({
  id,
  path,
  name,
  price,
  quantity,
  isChecked = false,
}: CartItemCardProps) {
  const { removeCartItem, updateCartItemQuantity } = useCartStore();

  const handleRemove = async () => {
    try {
      await deleteCartItem(id);
      removeCartItem(id);
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      await updateCartItemQuantity(id, newQuantity);
      updateCartItemQuantity(id, newQuantity);
    } catch (error) {
      console.error('수량 변경 중 오류 발생:', error);
    }
  };

  return (
    <>
      <div className="relative mx-auto h-[6.5rem] w-[21.875rem]">
        {/* 체크박스 */}
        <div className="mt-1">
          <button
            className="cursor-pointer"
            aria-label={isChecked ? '상품 선택 해제' : '상품 선택'}
          >
            {isChecked ? (
              <Image
                src="/check-on.svg"
                alt="check icon"
                width={20}
                height={20}
              />
            ) : (
              <Image
                src="/check-off.svg"
                alt="uncheck icon"
                width={20}
                height={20}
              />
            )}
          </button>
        </div>

        {/* 상품 이미지 */}
        <div className="relative bottom-8 ml-8">
          <Image
            src={path || ''}
            alt={name}
            className="rounded-xl border-2"
            width={80}
            height={80}
          />
        </div>

        {/* 상품 정보 */}
        <div className="absolute top-0 left-34">
          <p className="text-lg leading-6 font-semibold">
            {name?.length > 10 ? `${name.slice(0, 10)}...` : name}
          </p>
          <p>{price.toLocaleString()}원</p>
        </div>

        {/* 수량 조절 */}
        <div className="absolute bottom-2 left-34 flex items-center">
          <button
            className="cursor-pointer"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus size={18} />
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            className="cursor-pointer"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus size={18} />
          </button>
        </div>

        {/* 삭제 아이콘 */}
        <div className="absolute top-2 right-0">
          <button className="cursor-pointer" onClick={handleRemove}>
            <X size={18} />
          </button>
        </div>
      </div>
      <hr className="mx-7 mb-7" />
    </>
  );
}
