'use client';

import { useState } from 'react';

export default function FeedCategorySelect() {
  const [selectedCategory, setSelectedCategory] = useState('');

  // 7개 카테고리 목록
  const categories = [
    '항수',
    '리빙',
    '홈카페',
    '인테리어',
    '인형',
    '패션',
    '굿즈',
  ];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="w-full">
      {/* 숨겨진 input - FormData에서 읽을 값 */}
      <input type="hidden" name="category" value={selectedCategory} />

      {/* 제목 텍스트 */}
      <div className="mb-3">
        <span className="text-sm font-bold text-black">카테고리 설정</span>
      </div>

      {/* 카테고리 버튼들 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleCategoryClick(category)}
            className={`h-10 w-[82px] rounded-3xl text-sm ${
              selectedCategory === category
                ? 'bg-[#FE508B] text-white' // 선택된 상태
                : 'bg-[#F3F4F6] text-[#4B5563]' // 기본 상태
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
