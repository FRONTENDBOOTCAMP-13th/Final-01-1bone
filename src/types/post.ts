import { User } from '@/types/user';

export interface PostList {
  _id: number;
  type: string;
  view: number;
  image: string[];
  user: Pick<User, '_id' | 'name' | 'image'>;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  bookmark: number;
  repliesCount: number;
  product: {
    image: string | null;
  };
}

// 게시글에 대한 답글(댓글) 정보를 나타내는 인터페이스(댓글 하나당 구조)
export interface PostReply {
  _id: number; // 댓글 ID
  user: Pick<User, '_id' | 'name' | 'image'>; // 댓글 작성자 (일부 정보만)
  content: string; // 댓글 내용
  like: number; // 좋아요 수
  createdAt: string; // 작성일
  updatedAt: string; // 수정일
}

// 답글 작성 폼에서 사용하는 타입 (content만 입력받음)
export type PostReplyForm = Pick<PostReply, 'content'>;

// 게시글 정보를 나타내는 인터페이스(게시물 하나당 구조)
export interface Post {
  _id: number; // 게시물 ID
  type: string; // 게시판 타입 (community, notice 등)
  title: string; // 제목
  tag: string;
  content: string; // 내용
  image: string[] | string; // 이미지
  user: Pick<User, '_id' | 'name' | 'image'>; // 작성자 (일부 정보만)
  views: number; // 조회수
  repliesCount: number; // 댓글 수
  replies?: PostReply[]; // 댓글 목록 (선택사항)
  createdAt: string; // 작성일
  updatedAt: string; // 수정일
}

// 게시글 작성/수정 폼에서 사용하는 타입
export type PostForm = Partial<
  Pick<Post, 'type' | 'title' | 'content' | '_id'>
> & {
  image?: string | string[]; // 첨부 이미지
  tags?: string; // 태그
};
