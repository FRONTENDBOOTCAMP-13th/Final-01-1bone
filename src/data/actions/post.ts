'use server';
import {
  ApiRes,
  Post,
  PostReply,
  ApiResPromise,
  PostList,
  FileUpload,
} from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 게시판 타입에 해당하는 게시글 목록을 가져옵니다.
 * @param {string} boardType - 게시판 타입(예: notice, free 등)
 * @returns {Promise<ApiRes<Post[]>>} - 게시글 목록 응답 객체
 */
export async function getPosts(boardType: string): ApiResPromise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts?type=${boardType}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-cache',
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}

/**
 * 게시글 id로 1개의 게시글을 가져오는 함수
 */
export async function getPostDetail(_id: number): ApiResPromise<Post> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      headers: { 'Client-Id': CLIENT_ID },
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '조회 실패' };
  }
}

/**
 * 게시판 타입에 해당하는 게시글 목록을 가져옵니다.
 * @param {string} boardType - 게시판 타입(예: notice, free 등)
 * @returns {Promise<ApiRes<PostList[]>>} - 게시글 목록 응답 객체
 */
export async function getUserPosts(
  _id: number,
  boardType: string,
): ApiResPromise<PostList[]> {
  try {
    const res = await fetch(`${API_URL}/posts/users/${_id}?type=${boardType}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
    });

    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}

/**
 * 게시글을 생성하는 함수
 */
export async function createPost(
  state: ApiRes<Post> | null,
  formData: FormData,
): ApiResPromise<Post> {
  let imageUrls: string[] = [];
  const attachFiles = formData.getAll('attach') as File[];
  console.log('attach', attachFiles);
  const accessToken = formData.get('accessToken');

  console.log('accesToken', accessToken);

  // 1단계: 이미지가 있으면 먼저 업로드
  // const imageFile = formData.get('images') as File;
  // if (imageFile && imageFile.size > 0) {
  //   const fileFormData = new FormData();
  //   fileFormData.append('attach', imageFile);

  //   try {
  //     const fileRes = await fetch(`${API_URL}/files`, {
  //       method: 'POST',
  //       headers: {
  //         'Client-Id': CLIENT_ID,
  //       },
  //       body: fileFormData,
  //     });

  //     const fileResult = await fileRes.json();

  //     if (fileResult.ok) {
  //       imageUrls = [fileResult.item[0].path];
  //     }
  //   } catch (error) {
  //     console.error('파일 업로드 에러:', error);
  //     return { ok: 0, message: '이미지 업로드에 실패했습니다.' };
  //   }
  // }

  if (attachFiles.length > 0) {
    const fileFormData = new FormData();
    attachFiles.forEach(file => {
      fileFormData.append('attach', file);
    });

    try {
      const fileRes = await fetch(`${API_URL}/files`, {
        method: 'POST',
        headers: {
          'Client-Id': CLIENT_ID,
        },
        body: fileFormData,
      });

      const fileResult = await fileRes.json();

      if (fileResult.ok) {
        imageUrls = fileResult.item.map((file: FileUpload) => file.path);
      }
    } catch (error) {
      console.error('파일 업로드 에러:', error);
      return { ok: 0, message: '이미지 업로드에 실패했습니다.' };
    }
  }

  console.log('업로드된 이미지 url들', imageUrls);

  // 2단계: 게시글 등록
  const body = {
    type: formData.get('type'),
    content: formData.get('content'),
    tag: formData.get('tag'),
    ...(imageUrls.length > 0 && { image: imageUrls }),
  };

  console.log('피드 등록 바디 데이터', body);

  let data: ApiRes<Post>;

  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
    console.log('피드등록 완료 데이터', data);
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }

  // redirect를 try 밖으로 이동
  if (data.ok) {
    revalidatePath(`/${body.type}`); // 목록 페이지 캐시 갱신
    // 메인페이지로 이동 (상세페이지 대신)
    redirect(`/${body.type}`); // /community로 이동
  } else {
    return data;
  }
}

/**
 * 게시글 수정
 */
export async function updatePost(
  state: ApiRes<Post> | null,
  formData: FormData,
  _id: string,
): ApiResPromise<Post> {
  let imageUrls: string[] = [];
  const attachFiles = formData.getAll('attach') as File[];
  console.log('attach', attachFiles);
  const accessToken = formData.get('accessToken');

  console.log('accesToken', accessToken);

  if (attachFiles.length > 0) {
    const fileFormData = new FormData();
    attachFiles.forEach(file => {
      fileFormData.append('attach', file);
    });

    try {
      const fileRes = await fetch(`${API_URL}/files`, {
        method: 'POST',
        headers: {
          'Client-Id': CLIENT_ID,
        },
        body: fileFormData,
      });

      const fileResult = await fileRes.json();

      if (fileResult.ok) {
        imageUrls = fileResult.item.map((file: FileUpload) => file.path);
      }
    } catch (error) {
      console.error('파일 업로드 에러:', error);
      return { ok: 0, message: '이미지 업로드에 실패했습니다.' };
    }
  }

  console.log('업로드된 이미지 url들', imageUrls);

  const body = {
    type: formData.get('type'),
    content: formData.get('content'),
    tag: formData.get('tag'),
    ...(imageUrls.length > 0 && { image: imageUrls }),
  };

  let data: ApiRes<Post>;

  try {
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '게시글 수정에 실패했습니다.' };
  }

  if (data.ok) {
    revalidatePath(`/${body.type}`); // 목록 페이지 캐시 갱신
    // 메인페이지로 이동 (상세페이지 대신)
    redirect(`/${body.type}`); // /community로 이동
  }

  return data;
}

/**
 * 게시글 삭제
 */
export async function deletePost(
  state: ApiRes<null> | null,
  formData: FormData,
): ApiResPromise<null> {
  const _id = formData.get('_id') as string;
  const accessToken = formData.get('accessToken') as string;

  let data: ApiRes<null>;

  try {
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      method: 'DELETE',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    data = await res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '게시글 삭제에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag('posts');
  }

  return data;
}

/**
 * 게시글 단일 조회
 */
export async function getPost(_id: number): ApiResPromise<Post> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
      next: { tags: [`posts/${_id}`] },
    });

    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '게시글을 불러오는데 실패했습니다.' };
  }
}

/**
 * 댓글을 생성하는 함수
 */
export async function createReply(
  state: ApiRes<PostReply> | null,
  formData: FormData,
): ApiResPromise<PostReply> {
  const body = {
    content: formData.get('content'),
  };

  const _id = formData.get('_id');
  const accessToken = formData.get('accessToken');

  let data: ApiRes<PostReply>;

  try {
    const res = await fetch(`${API_URL}/posts/${_id}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag(`posts/${_id}/replies`); // 댓글 목록 캐시 무효화
    revalidateTag(`posts/${_id}`); // 게시글 상세 캐시 무효화
  }

  return data;
}

/**
 * 댓글 수정
 */
export async function updateReply(
  state: ApiRes<PostReply> | null,
  formData: FormData,
): ApiResPromise<PostReply> {
  const _id = formData.get('_id') as string;
  const replyId = formData.get('replyId') as string;
  const content = formData.get('content') as string;
  const accessToken = formData.get('accessToken') as string;

  let data: ApiRes<PostReply>;

  try {
    const res = await fetch(`${API_URL}/posts/${_id}/replies/${replyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content }),
    });

    data = await res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '댓글 수정에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag(`posts/${_id}/replies`);
    revalidateTag(`posts/${_id}`);
  }

  return data;
}

/**
 * 댓글 삭제
 */
export async function deleteReply(
  state: ApiRes<null> | null,
  formData: FormData,
): ApiResPromise<null> {
  const _id = formData.get('_id') as string;
  const replyId = formData.get('replyId') as string;
  const accessToken = formData.get('accessToken') as string;

  let data: ApiRes<null>;

  try {
    const res = await fetch(`${API_URL}/posts/${_id}/replies/${replyId}`, {
      method: 'DELETE',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    data = await res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '댓글 삭제에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag(`posts/${_id}/replies`);
    revalidateTag(`posts/${_id}`);
  }

  return data;
}
