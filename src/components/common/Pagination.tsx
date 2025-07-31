import React, { Dispatch, SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

//          interface: 페이지네이션 컴포넌트 properties          //
interface Props {
  currentPage: number;
  currentSection: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  viewPageList: number[];
  totalSection: number;
}

//          component: 페이지네이션 컴포넌트          //
export default function Pagination(props: Props) {
  //          state: Properties          //
  const { currentPage, currentSection, viewPageList, totalSection } = props;
  const { setCurrentPage, setCurrentSection } = props;

  //          event handler: 페이지 번호 클릭 이벤트 처리          //
  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
  };
  //          event handler: 이전 클릭 이벤트 처리          //
  const onPreviousClickHandler = () => {
    if (currentSection === 1) return;
    setCurrentPage((currentSection - 1) * 10);
    setCurrentSection(currentSection - 1);
  };
  //          event handler: 다음 클릭 이벤트 처리          //
  const onNextClickHandler = () => {
    if (currentSection === totalSection) return;
    setCurrentPage(currentSection * 10 + 1);
    setCurrentSection(currentSection + 1);
  };

  //          render: 페이지네이션 컴포넌트 렌더링          //
  return (
    <div className="flex items-center gap-4">
      <button className="flex size-8 cursor-pointer items-center justify-center gap-1 rounded-sm border border-[#f2f2f2] bg-white p-1">
        <div className="" onClick={onPreviousClickHandler}>
          <ChevronLeft size={16} strokeWidth={1} />
        </div>
      </button>

      {viewPageList.map(page =>
        page === currentPage ? (
          <button
            key={page}
            className="size-6 cursor-default rounded-sm bg-[#4D4D4D] text-sm font-semibold text-white"
          >
            {page}
          </button>
        ) : (
          <button
            key={page}
            className="size-6 cursor-pointer text-sm font-semibold text-gray-700"
            onClick={() => onPageClickHandler(page)}
          >
            {page}
          </button>
        ),
      )}

      <button className="flex size-8 cursor-pointer items-center justify-center gap-1 rounded-sm border border-[#f2f2f2] bg-white p-1">
        <div className="" onClick={onNextClickHandler}>
          <ChevronRight size={16} strokeWidth={1} />
        </div>
      </button>
    </div>
  );
}
