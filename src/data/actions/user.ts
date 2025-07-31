'use server';
import { uploadFile } from '@/data/actions/file';
import { ApiRes, ApiResPromise, User } from '@/types';
// import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function getUserInfo(_id: number): ApiResPromise<User> {
  try {
    const res = await fetch(`${API_URL}/users/${_id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
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

export async function getUserAttribute(_id: number, attribute: string) {
  try {
    const res = await fetch(`${API_URL}/users/${_id}/${attribute}`, {
      headers: {
        'Client-Id': CLIENT_ID,
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

export async function getOtherUserInfo(_id: number): ApiResPromise<User[]> {
  try {
    const res = await fetch(`${API_URL}/users?custom={"_id":{"$ne":${_id}}}`, {
      headers: {
        'Client-Id': CLIENT_ID,
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

export async function updateUserInfo(
  _id: number,
  formData: FormData,
): ApiResPromise<User> {
  let res: Response;
  let data: ApiRes<User>;

  try {
    const attach = formData.get('attach') as File;
    const accessToken = formData.get('accessToken');
    const nickname = formData.get('nickname')?.toString();
    const introduction = formData.get('introduction')?.toString();
    const address = formData.get('address')?.toString();
    const phone = formData.get('phone')?.toString();
    const detail = formData.get('detail')?.toString();
    const equippedItemCodes = formData.get('equippedItemCodes');
    const ownedItemCodes = formData.get('ownedItemCodes');
    const point = formData.get('point');
    const hobby = formData.get('hobby');
    const postcode = formData.get('postcode');
    const extraRes = await getUserAttribute(_id, 'extra');
    const prevExtra = extraRes.ok === 1 ? extraRes.item.extra : {};
    let image;

    if (attach instanceof File && attach.size > 0) {
      const fileRes = await uploadFile(formData);
      console.log(`fileRes`, fileRes);
      if (fileRes.ok) {
        image = fileRes.item[0].path;
      } else {
        return fileRes;
      }
    }
    const body = {
      ...(address && { address }),
      ...(phone && { phone }),
      extra: {
        ...prevExtra,
        ...(nickname && { nickname }),
        ...(introduction && { introduction }),
        ...(hobby && { hobby }),
        ...(detail && { detail_address: detail }),
        ...(postcode && { postcode }),
        ...(equippedItemCodes && {
          equippedItemCodes: JSON.parse(
            formData.get('equippedItemCodes') as string,
          ),
        }),
        ...(ownedItemCodes && {
          ownedItemCodes: JSON.parse(formData.get('ownedItemCodes') as string),
        }),
        ...(point && { point: parseInt(point.toString(), 10) }),
      },
      ...(image ? { image } : {}),
    };

    res = await fetch(`${API_URL}/users/${_id}`, {
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
    // 네트워크 오류 처리
    console.error(error);
    return {
      ok: 0,
      message:
        '요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다.',
    };
  }

  if (data.ok) {
    // redirect(`/user/${_id}`);
  }

  return data;
}
