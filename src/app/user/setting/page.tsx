import { Separator } from '@/components/ui/separator';

import {
  Bell,
  BookAlert,
  ChevronRight,
  Headset,
  Megaphone,
  Moon,
  Scroll,
} from 'lucide-react';
import Link from 'next/link';

import AddressForm from '@/components/features/user/setting/AddressForm';
import { UserLoginInfo } from '@/components/features/user/setting/LoginInfo';
import { LogoutButton } from '@/components/features/user/setting/LogoutButton';
import { getUserAttribute } from '@/data/actions/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function SettingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error('로그인이 필요합니다');
  }

  const addressRes = await getUserAttribute(session.user._id, 'address');
  const addressDetailRes = await getUserAttribute(
    session.user._id,
    'extra/detail_address',
  );
  const postcodeRes = await getUserAttribute(
    session.user._id,
    'extra/postcode',
  );

  if (addressRes.ok !== 1 || addressDetailRes.ok !== 1 || postcodeRes.ok !== 1)
    return null;

  return (
    <div className="flex min-h-[calc(100%-48px)] flex-col">
      <main className="scrollbar-hide flex h-full flex-col gap-2 overflow-y-scroll p-5">
        <section>
          <p>일반</p>
          <div className="flex flex-col gap-3 rounded-[8px] border">
            <ul className="px-3">
              <UserLoginInfo />
              <Separator />
              <AddressForm
                address={addressRes.item.address}
                detail={addressDetailRes.item.extra.detail_address}
                postcode={postcodeRes.item.extra.postcode}
              />
            </ul>
          </div>
        </section>

        <section>
          <p>일반</p>
          <div className="flex flex-col gap-3 rounded-[8px] border">
            <ul className="px-3">
              <li className="flex items-center gap-2.5 py-4">
                <Moon />
                <span className="flex-1">다크모드</span>
                <input type="checkbox" id="dark" className="custom-toggle" />
              </li>
              <Separator />
              <li className="flex items-center gap-2.5 py-4">
                <Bell />
                <span className="flex-1">알림 수신</span>
                <input type="checkbox" className="custom-toggle" />
              </li>
            </ul>
          </div>
        </section>
        <section>
          <p>공지</p>
          <div className="flex flex-col gap-3 rounded-[8px] border">
            <ul className="px-3">
              <li>
                <Link
                  href="/notice"
                  prefetch={true}
                  className="flex items-center gap-2.5 py-4"
                >
                  <Megaphone />
                  <span className="flex-1">공지사항</span>
                  <ChevronRight />
                </Link>
              </li>
              <Separator />
              <li>
                <Link
                  href="/contact"
                  prefetch={true}
                  className="flex items-center gap-2.5 py-4"
                >
                  <Headset />
                  <span className="flex-1">고객센터</span>
                  <ChevronRight />
                </Link>
              </li>
            </ul>
          </div>
        </section>
        <section>
          <p>약관 및 정책</p>
          <div className="flex flex-col gap-3 rounded-[7px] border">
            <ul className="px-3">
              <li>
                <Link
                  href="/terms"
                  prefetch={true}
                  className="flex items-center gap-2.5 py-4"
                >
                  <Scroll />
                  <span className="flex-1">서비스 이용약관</span>
                  <ChevronRight />
                </Link>
              </li>
              <Separator />
              <li>
                <Link
                  href="/policy"
                  prefetch={true}
                  className="flex items-center gap-2.5 py-4"
                >
                  <BookAlert />
                  <span className="flex-1">개인정보 처리방침</span>
                  <ChevronRight />
                </Link>
              </li>
            </ul>
          </div>
        </section>
        <LogoutButton />
      </main>
    </div>
  );
}
