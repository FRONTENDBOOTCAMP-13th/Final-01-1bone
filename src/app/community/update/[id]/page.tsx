import FeedUpdateForm from '@/components/features/community/comminity-update/FeedUpdateForm';
import { getPost } from '@/data/actions/post';

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);

  const res = await getPost(postId);

  if (!res.ok || !res.item) return null;

  console.log('post res', res);
  return (
    <div className="flex min-h-[calc(100%-48px)] flex-1 flex-col p-4">
      <FeedUpdateForm post={res.item} />
    </div>
  );
}
