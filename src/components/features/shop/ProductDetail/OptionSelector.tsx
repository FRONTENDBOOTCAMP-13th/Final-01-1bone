'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

// 옵션 선택 컴포넌트
export const OptionSelector = ({
  name,
  options,
  selectedOption,
  onSelect,
  onOpen, // 드롭다운 열릴 때 호출되는 이벤트
}: {
  name: string;
  options: string[] | number[];
  selectedOption: string;
  onSelect: (selectedOption: string) => void;
  onOpen?: () => void; // 선택값 초기화를 위한 이벤트
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (!isOpen && onOpen) {
      onOpen(); // 드롭다운 열릴 때 초기화
    }
    setIsOpen(!isOpen);
  };

  return (
    <section className="h-auto rounded-[5px] border border-[#EAEAEA] bg-white">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between bg-transparent p-2 text-black"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${name} 옵션 선택 드롭다운`}
      >
        <span className="text-[16px] text-[#000]">
          {selectedOption || `${name}`} {/* 초기 상태에서는 name 값 표시 */}
        </span>
        <ChevronDown
          className={`h-[24px] w-[24px] text-black transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          className="border-[#EAEAEA]"
          role="listbox"
          aria-label={`${name} 옵션 선택`}
        >
          {options.map(option => (
            <li
              key={option.toString()}
              className="cursor-pointer border-t border-[#EAEAEA] p-2 text-[#666]"
              onClick={() => {
                onSelect(option.toString());
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedOption === option.toString()}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
