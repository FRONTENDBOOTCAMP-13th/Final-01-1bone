'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

// 옵션 선택 컴포넌트
export const OptionSelector = ({
  name,
  options,
  selectedOption,
  onSelect,
}: {
  name: string;
  options: string[] | number[];
  selectedOption: string;
  onSelect: (selectedOption: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="h-auto rounded-[8px] border border-[#EAEAEA] bg-white">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between bg-transparent p-2 text-black"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${name} 옵션 선택 드롭다운`}
      >
        <span className="text-[16px] text-[#000]">
          {selectedOption || `${name}`}
        </span>
        <ChevronDown
          className={`h-[24px] w-[24px] text-black transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          className="border-t border-[#EAEAEA]"
          role="listbox"
          aria-label={`${name} 옵션 선택`}
        >
          {options.map(option => (
            <li
              key={option.toString()}
              className="cursor-pointer border-b border-[#EAEAEA] p-2 text-[#666]"
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
