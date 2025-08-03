import { ApiResPromise, Post, PostReply } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 게시판 타입에 해당하는 게시글 목록을 가져옵니다.
 * @param {string} boardType - 게시판 타입(예: community, notice 등)
 * @returns {Promise<ApiRes<Post[]>>} - 게시글 목록 응답 객체
 */
export async function fetchPosts(boardType: string): ApiResPromise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts?type=${boardType}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
      next: {
        tags: [`posts?type=${boardType}`],
      },
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '게시물 목록을 불러오는데 실패했습니다.' };
  }
}

/**
 * 특정 게시글의 상세 정보를 가져옵니다.
 * @param {number} _id - 게시글의 고유 ID
 * @returns {Promise<ApiRes<Post>>} - 게시글 상세 정보 응답 객체
 */
export async function fetchPost(_id: number): ApiResPromise<Post> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
      next: {
        tags: [`posts/${_id}`],
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '게시물을 불러오는데 실패했습니다.' };
  }
}

/**
 * 특정 게시글의 댓글 목록을 가져옵니다.
 * @param {number} _id - 게시글의 고유 ID
 * @returns {Promise<ApiRes<PostReply[]>>} - 댓글 목록 응답 객체
 */
export async function fetchReplies(_id: number): ApiResPromise<PostReply[]> {
  try {
    const res = await fetch(
      `${API_URL}/posts/${_id}/replies?sort={"createdAt": -1}`,
      {
        headers: {
          'Client-Id': CLIENT_ID,
        },
        cache: 'no-store',
        next: {
          tags: [`posts/${_id}/replies`],
        },
      },
    );
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '댓글을 불러오는데 실패했습니다.' };
  }
}
