'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';

// CartContext 타입 정의
interface CartContextType {
  cartItems: any[];
  setCartItems: (items: any[]) => void;
  cartCount: number;
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
  const [cartItems, setCartItems] = useState<any[]>([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// CartItemCardProps 타입 정의
export interface CardItemCardProps {
  id: number;
  path: string;
  name: string;
  price: number;
  quantity: number;
  isChecked?: boolean;
  onQuantityChange?: (id: number, quantity: number) => void;
  onRemove?: (id: number) => void;
  onCheck?: (id: number, checked: boolean) => void;
}

// CartItemCard 컴포넌트 정의
export function CartItemCard({
  id,
  path,
  name,
  price,
  quantity,
  isChecked = false,
  onQuantityChange,
  onRemove,
  onCheck,
}: CardItemCardProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const handleCheckedChange = () => {
    onCheck?.(id, !isChecked);
  };

  const handleUp = () => {
    if (localQuantity < 99) {
      const newQuantity = localQuantity + 1;
      setLocalQuantity(newQuantity);
      onQuantityChange?.(id, newQuantity);
    }
  };

  const handleDown = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onQuantityChange?.(id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove?.(id);
  };

  console.log('name', name);

  return (
    <>
      <div className="relative mx-auto h-[6.5rem] w-[21.875rem]">
        {/* 체크박스 */}
        <div className="mt-1" onClick={handleCheckedChange}>
          <button
            className="cursor-pointer"
            onClick={handleCheckedChange}
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

        {/* 수량 변경 */}
        <div className="absolute top-14 left-34">
          <button
            className="relative bottom-1 cursor-pointer"
            onClick={handleDown}
          >
            <div className="flex size-7 items-center justify-center rounded-full border border-[#CECECE]">
              <Minus size={20} />
            </div>
          </button>
          <span className="relative bottom-2 px-6">{localQuantity}</span>
          <button
            className="relative bottom-1 cursor-pointer"
            onClick={handleUp}
          >
            <div className="flex size-7 items-center justify-center rounded-full border border-[#CECECE]">
              <Plus size={20} />
            </div>
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
