import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productImg?: string;
  discountRate?: number;
  options?: { name: string; selectedValue: string }[];
}

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  cartCount: 0,
  addToCart: item =>
    set(state => ({
      cartItems: [...state.cartItems, item],
      cartCount: state.cartCount + item.quantity,
    })),
  getTotalItems: () => get().cartCount,
}));
