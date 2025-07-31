import Image from 'next/image';
import Tabbar from '@/components/layout/tabbar/Tabbar';
import { CartProvider } from '@/components/features/shop/ProductDetail/CartContext';
import { ProductDetailInfo } from '@/components/features/shop/ProductDetail/ProductDetail';
import { fetchProductDetail } from '@/data/functions/ProductFetch';
import CartAction, {
  CartIcon,
  GoBackButton,
} from '@/components/features/shop/ProductDetail/ProductDetailClient';
import { ProductOption } from '@/types/product';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  console.log('Product ID:', productId);

  if (!productId) {
    return <div>상품 데이터를 불러올 수 없습니다.</div>;
  }

  const res = await fetchProductDetail(productId);

  // 배열에서 첫 번째 상품을 가져옴
  const product = res.item;

  const mainImage = product.mainImages[0];
  const detailImage = product.content[0];

  const mainImageUrl = mainImage
    ? `https://fesp-api.koyeb.app/market/${mainImage.path}`
    : '';
  const detailImageUrl = detailImage
    ? `https://fesp-api.koyeb.app/market/${detailImage.path}`
    : '';

  const options = Array.isArray(product.extra.options)
    ? product.extra.options
    : [];

  return (
    <CartProvider>
      <div className={`relative mb-1 aspect-square w-full`}>
        <Image
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          src={mainImageUrl}
          alt={mainImage?.name || '상품 이미지'}
          className="pointer-events-none"
        />
      </div>

      <ProductDetailInfo
        item={{
          _id: product._id,
          name: product.name,
          price: product.price,
          path: detailImage?.path ?? '',
        }}
        discountRate={product.extra.discountRate}
        price={product.price}
        extra={{
          recommendedBy: product.extra.recommendedBy,
          originalPrice: product.extra.originalPrice,
        }}
      />

      <h2 className="p-5 text-[18px] font-semibold">상품정보</h2>
      <div className="relative mb-1 w-full">
        <Image
          layout="intrinsic"
          width={1920}
          height={1080}
          src={detailImageUrl}
          alt={detailImage?.name || '상품 상세'}
          className="pointer-events-none"
        />
      </div>

      {/* 하위 클라이언트 컴포넌트로 묶어서 이동 */}
      <CartAction
        price={product.price}
        options={product.extra.options}
        discountRate={product.extra.discountRate}
        item={{
          id: String(product._id),
          name: product.name,
          price: product.price,
          productImg: mainImageUrl,
        }}
      />

      <Tabbar />
    </CartProvider>
  );
}
