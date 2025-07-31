'use client';

import { Product, ProductListRes } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import {
  AddToCartRes,
  CartListRes,
  CartQuantityUpdateRes,
  DeleteCartsRes,
} from '@/types/cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
const accessToken = useAuthStore.getState().accessToken;

// 장바구니 목록 조회(로그인)
// export async function fetchCartList(page: number): Promise<Product[]> {
//   const res = await fetch(`${API_URL}/carts?page=${page}&limit=10`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Client-Id': CLIENT_ID,
//       Authorization: `Bearer ${accessToken}`,
//     },
//     next: {
//       tags: ['cart'],
//       revalidate: 10,
//     },
//     cache: 'force-cache',
//   });

//   const data: ProductListRes = await res.json();
//   if (!data.ok || !Array.isArray(data.item)) {
//     console.error('서버 응답 오류', data);
//     return [];
//   }

//   return data.item;
// }

// 장바구니 목록 조회(로그인)
// export async function fetchCartList(
//   page: number = 1,
//   limit: number = 10,
// ): Promise<CartListRes> {
//   const res = await fetch(`${API_URL}/carts?page=${page}&limit=${limit}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Client-Id': CLIENT_ID,
//       Authorization: `Bearer ${accessToken}`,
//     },
//     cache: 'no-store',
//   });
//   if (!res.ok) throw new Error('장바구니 불러오기 실패');
//   return await res.json();
// }

export async function fetchCartList(
  page: number = 1,
  limit: number = 10,
): Promise<CartListRes> {
  console.log('Access Token:', accessToken);
  console.log('Auth Store State:', useAuthStore.getState());
  console.log('API URL:', `${API_URL}/carts?page=${page}&limit=${limit}`);
  console.log('Client ID:', CLIENT_ID);

  if (!accessToken) {
    throw new Error('Access Token이 없습니다. 로그인 상태를 확인하세요.');
  }

  const res = await fetch(`${API_URL}/carts?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('장바구니 불러오기 실패');
  return await res.json();
}

// 장바구니 상품 추가
export async function fetchAddToCart(
  product_id: number,
  quantity: number,
): Promise<AddToCartRes> {
  const res = await fetch(`${API_URL}/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ product_id, quantity }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('장바구니 추가 실패');
  return await res.json();
}

// 장바구니 여러건 삭제
// export async function fetchdeleteCartsItems(
//   cartIds: number[],
// ): Promise<DeleteCartsRes> {
//   const res = await fetch(`${API_URL}/carts`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//       'Client-Id': CLIENT_ID,
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: JSON.stringify({ carts: cartIds }),
//     cache: 'no-store',
//   });

//   if (!res.ok) {
//     throw new Error('Failed to delete cart items');
//   }

//   const data: DeleteCartsRes = await res.json();
//   return data;
// }

// 장바구니 상품 한 건 삭제
export async function deleteCartItem(id: number): Promise<DeleteCartsRes> {
  const res = await fetch(`${API_URL}/carts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('삭제 실패');
  return await res.json();
}

// 장바구니 상품 수량 수정
// export async function updateCartItemQuantity(
//   id: number,
//   quantity: number,
// ): Promise<CartQuantityUpdateRes> {
//   const res = await fetch(`${API_URL}/carts/${id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       'Client-Id': CLIENT_ID,
//       Authorization: `Bearer ${useAuthStore}`,
//     },
//     body: JSON.stringify({ quantity }),
//     cache: 'no-store',
//   });

//   if (!res.ok) {
//     throw new Error(
//       '요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.',
//     );
//   }

//   const data: CartQuantityUpdateRes = await res.json();
//   return data;
// }

export async function updateCartItemQuantity(
  id: number,
  quantity: number,
): Promise<CartQuantityUpdateRes> {
  const res = await fetch(`${API_URL}/carts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ quantity }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('수량 변경 실패');
  return await res.json();
}
