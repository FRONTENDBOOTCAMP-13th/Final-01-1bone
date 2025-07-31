// import CommunityHeader from '@/components/features/community/community-common/CommunityHeader';
import WriteForm from '@/components/features/community/community-create/FeedWriteForm';

export default async function WritePage() {
  return (
    <div className="min-h-screen">
      {/* <div className="pt-5">
        <CommunityHeader title="피드등록" />
        <hr className="mt-2" />
      </div> */}

      <WriteForm />
    </div>
  );
}
