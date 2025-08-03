// import { create } from 'zustand';

// export interface CartItem {
//   _id: number | string;
//   name: string;
//   price: number;
//   quantity: number;
//   mainImages: string[];
//   size: string | number;
//   color: string;
// }

// interface CartState {
//   // 장바구니 전체 목록
//   cartItems: CartItem[];
//   // 장바구니에 담긴 모든 상품 수량 합계)
//   cartCount: number;
//   // 전체 목록 교체
//   setCartItems: (items: CartItem[]) => void;
//   // 옵션까지 완전히 동일시 수량증가, 아니면 새로 추가
//   addOrUpdateCartItem: (item: CartItem) => void;
//   getTotalItems: () => number;
//   clear: () => void;
// }

// function isSameCartItem(a: CartItem, b: CartItem) {
//   // 상품ID, 옵션이 모두 같으면 true
//   return (
//     a._id === b._id &&
//     (a.size ?? null) === (b.size ?? null) &&
//     (a.color ?? null) === (b.color ?? null)
//   );
// }

// export const useCartStore = create<CartState>((set, get) => ({
//   cartItems: [],
//   cartCount: 0,

//   setCartItems: items =>
//     set({
//       cartItems: items,
//       cartCount: items.reduce((total, item) => total + item.quantity, 0),
//     }),

//   addOrUpdateCartItem: newItem =>
//     set(state => {
//       const idx = state.cartItems.findIndex(item =>
//         isSameCartItem(item, newItem),
//       );
//       let nextCart: CartItem[];
//       if (idx > -1) {
//         // 옵션/상품ID 같으면 수량 증가
//         nextCart = state.cartItems.map((item, i) =>
//           i === idx
//             ? { ...item, quantity: item.quantity + newItem.quantity }
//             : item,
//         );
//       } else {
//         // 완전 새로운 상품/옵션이면 추가
//         nextCart = [...state.cartItems, newItem];
//       }
//       return {
//         cartItems: nextCart,
//         cartCount: nextCart.reduce((total, item) => total + item.quantity, 0),
//       };
//     }),

//   getTotalItems: () => get().cartCount,
//   clear: () => set({ cartItems: [], cartCount: 0 }),
// }));

import { create } from 'zustand';
import { CartItem } from '@/types/cart';

// CartStore 인터페이스 정의
interface CartStore {
  cartItems: CartItem[]; // 장바구니 아이템 배열
  selectedCartIds: number[]; // 체크된 아이템의 ID 저장
  setCartItems: (items: CartItem[]) => void; // 장바구니 아이템 설정
  toggleCartItem: (id: number) => void; // 체크 상태 토글
  removeCartItem: (id: number) => void; // 아이템 삭제
  selectAllCartItems: () => void; // 전체 선택
  deselectAllCartItems: () => void; // 전체 선택 해제
}

// Zustand 스토어 생성
export const useCartStore = create<CartStore>(set => ({
  cartItems: [],
  selectedCartIds: [],
  setCartItems: items => set({ cartItems: items }),
  toggleCartItem: id =>
    set(state => ({
      selectedCartIds: state.selectedCartIds.includes(id)
        ? state.selectedCartIds.filter(itemId => itemId !== id)
        : [...state.selectedCartIds, id],
    })),
  removeCartItem: id =>
    set(state => ({
      cartItems: state.cartItems.filter(item => item._id !== id),
      selectedCartIds: state.selectedCartIds.filter(itemId => itemId !== id),
    })),
  selectAllCartItems: () =>
    set(state => ({
      selectedCartIds: state.cartItems.map(item => item._id),
    })),
  deselectAllCartItems: () => set({ selectedCartIds: [] }),
}));
