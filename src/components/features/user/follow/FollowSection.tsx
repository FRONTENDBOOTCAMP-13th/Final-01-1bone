import UserPreviewCard from '@/components/features/user/UserPreviewCard';

import { Bookmark } from '@/types';
import { getUserImageUrl } from '@/utils';

export default function FollowSection({ byUser }: { byUser: Bookmark[] }) {
  console.log('byuser', byUser);
  return (
    <>
      {byUser.map(bookmark => (
        <UserPreviewCard
          key={bookmark._id}
          variant="horizontal"
          id={bookmark.user._id}
          image={getUserImageUrl(bookmark.user.image)}
          introduction={bookmark.user.extra?.introduction ?? ''}
          name={bookmark.user.name}
          bookmarkId={bookmark._id}
        />
      ))}
    </>
  );
}
