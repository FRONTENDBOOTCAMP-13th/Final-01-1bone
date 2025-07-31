'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  productImg?: string;
  name: string;
  price: number;
  quantity: number;
  isChecked?: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'isChecked'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  setQuantity: (id: string, quantity: number) => void;
  toggleCheckItem: (id: string, checked: boolean) => void;
  checkAll: () => void;
  uncheckAll: () => void;
  getTotalCheckedPrice: () => number;
  removeSelectedItems: () => void;
  checkedIds: string[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 로컬스토리지 연동
  useEffect(() => {
    const raw = localStorage.getItem('cartItems');
    if (raw) {
      setCartItems(JSON.parse(raw));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'isChecked'>) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === item.id); // 옵션이 있다면 id+옵션 조합으로
      if (idx !== -1) {
        // 이미 담겨있으면
        const n = [...prev];
        n[idx].quantity += item.quantity;
        n[idx].isChecked = true;
        return n;
      }
      return [...prev, { ...item, isChecked: true }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const removeSelectedItems = () => {
    setCartItems(prev => prev.filter(i => !i.isChecked));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const setQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));
  };

  const toggleCheckItem = (id: string, checked: boolean) => {
    setCartItems(prev =>
      prev.map(i => (i.id === id ? { ...i, isChecked: checked } : i)),
    );
  };

  const checkAll = () =>
    setCartItems(prev => prev.map(i => ({ ...i, isChecked: true })));

  const uncheckAll = () =>
    setCartItems(prev => prev.map(i => ({ ...i, isChecked: false })));

  const getTotalCheckedPrice = () =>
    cartItems.reduce(
      (total, cur) =>
        cur.isChecked ? total + cur.price * cur.quantity : total,
      0,
    );

  const checkedIds = cartItems.filter(i => i.isChecked).map(i => i.id);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        setQuantity,
        toggleCheckItem,
        checkAll,
        uncheckAll,
        getTotalCheckedPrice,
        removeSelectedItems,
        checkedIds,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
