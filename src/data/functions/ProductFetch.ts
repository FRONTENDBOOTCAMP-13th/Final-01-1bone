'use server';

import { Product, ProductListRes } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    headers: {
      'Client-Id': CLIENT_ID,
    },
    next: {
      tags: ['list'],
      revalidate: 10,
    },
    cache: 'force-cache',
  });

  const data: ProductListRes = await res.json();

  if (!data.ok || !Array.isArray(data.item)) {
    console.error('서버 응답 오류', data);
    return [];
  }

  return data.item;
}

export async function fetchProducts(page: number): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products?page=${page}&limit=10`, {
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
    },
    next: {
      tags: ['list'],
      revalidate: 10,
    },
    cache: 'force-cache',
  });

  const data: ProductListRes = await res.json();

  // console.log('ProductsFetch', data.item.length);
  // console.log(data);

  if (!data.ok || !Array.isArray(data.item)) {
    console.error('서버 응답 오류', data);
    return [];
  }

  return data.item;
}

export async function fetchProductDetail(
  productId: string,
): Promise<{ item: Product }> {
  const res = await fetch(
    `https://fesp-api.koyeb.app/market/products/${productId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
      },
    },
  );
  const data = await res.json();
  console.log('Fetched product detail:', data);
  return data;
}
