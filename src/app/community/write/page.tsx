// import CommunityHeader from '@/components/features/community/community-common/CommunityHeader';
import WriteForm from '@/components/features/community/community-create/FeedWriteForm';

export default async function WritePage() {
  return (
    <div className="flex flex-1 flex-col p-4">
      <WriteForm />
    </div>
  );
}
