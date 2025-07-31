'use server';

import {
  ApiResPromise,
  Bookmark,
  BookmarkPost,
  GetUserBookmarkResponseDto,
} from '@/types';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function postBookmark(
  type: 'product' | 'user' | 'post',
  target_id: number,
  accessToken: string,
): ApiResPromise<Bookmark> {
  try {
    const body = {
      type,
      target_id,
    };
    console.log(body);
    const res = await fetch(`${API_URL}/bookmarks/${type}`, {
      method: 'POST',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        type,
        target_id,
      }),
    });

    const result = await res.json();

    // 북마크 추가 성공 시 관련 페이지 캐시 무효화
    if (result.ok === 1) {
      revalidatePath('/user/[id]/bookmark', 'page');
      revalidatePath('/user/[id]', 'page');
    }

    return result;
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message:
        '요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.',
    };
  }
}

export async function deleteBookmark(
  _id: number,
  accessToken: string,
): ApiResPromise<null> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/${_id}`, {
      method: 'DELETE',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        _id,
      }),
    });

    const result = await res.json();

    // 북마크 삭제 성공 시 관련 페이지 캐시 무효화 - 이 부분이 없었음!
    if (result.ok === 1) {
      revalidatePath('/user/[id]/bookmark', 'page'); // 스크랩 페이지
      revalidatePath('/user/[id]', 'page'); // 마이페이지
    }

    return result;
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message:
        '요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.',
    };
  }
}

// 나머지 함수들은 그대로...
export async function getBookmarkList(
  type: 'product' | 'user' | 'post',
  accessToken: string,
): ApiResPromise<Bookmark> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/${type}`, {
      method: 'GET',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message:
        '요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.',
    };
  }
}

export async function getBookmark(
  type: 'product' | 'user' | 'post',
  target_id: number,
  accessToken: string,
): ApiResPromise<Bookmark> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/${type}/${target_id}`, {
      method: 'GET',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message:
        '요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.',
    };
  }
}

export async function getBookmarks(
  type: 'product' | 'user' | 'post',
  accessToken: string,
): ApiResPromise<Bookmark[]> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/${type}`, {
      method: 'GET',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message:
        '요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.',
    };
  }
}

export async function getAllUserBookmark(
  _id: number,
): ApiResPromise<GetUserBookmarkResponseDto> {
  try {
    const res = await fetch(`${API_URL}/users/${_id}/bookmarks`, {
      method: 'GET',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message:
        '요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.',
    };
  }
}
