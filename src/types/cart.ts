import { Product } from '@/types/product';

// 장바구니 상품 한 건 삭제
export interface ProductListRes {
  mainImages: {
    path: string;
  };
  item: {
    _id: number;
    name: string;
    quantity: number;
  };
  extra: {
    originalPrice: number;
  };
}

// 장바구니 상품 수량 수정
export interface CartQuantityUpdateRes {
  ok: number;
  item: {
    quantity: number;
  };
}

// 장바구니 상품 여러건 삭제
export interface DeleteCartsRes {
  ok: number;
  item: CartItem[];
}

// 장바구니에 상품 추가
export interface AddToCartRes {
  mainImages: {
    path: string;
  };
  item: {
    _id: number;
    name: string;
    quantity: number;
  };
  extra: {
    originalPrice: number;
  };
}

// 장바구니 상품 여러건 삭제
// export interface CartItem {
//   id: number;
//   item: {
//     _id: number;
//     name: string;
//     price: number;
//     quantity: number;
//     buyQuantity: number;
//     mainImages: {
//       path: string;
//     };
//     extra: {
//       originalPrice: number;
//       options: {
//         size: number[] | string[];
//         color: string[];
//       };
//     };
//   };
//   isChecked?: boolean;
// }
export interface CartItem {
  id: string;
  name: string;
  price: number;
  productImg?: string;
  extra?: {
    originalPrice: number; // extra 속성 추가
  };
  originalPrice: number;
}

// 장바구니 목록 죄회
export interface CartListRes {
  ok: number;
  item: CartItem[];
}

interface RawCartItem {
  item: {
    _id: number;
    name: string;
    quantity: number;
    buyQuantity: number;
    mainImages: { path: string }[];
    extra: {
      originalPrice: number;
      options: {
        size: number[] | string[];
        color: string[];
      };
    };
  };
}
