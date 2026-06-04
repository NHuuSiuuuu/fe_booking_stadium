"use client";

type Props = {
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
};

function Pagination({ page, totalPage, setPage }: Props) {
  return (
    <div className="my-[70px] ml-[15px] tex-[14px]">
      <ul className="flex">
        {/* Prev */}
        {page > 1 && (
          <li
            onClick={() => setPage(page - 1)}
            className="tex-[14px] font-semibold flex mr-[10px] justify-center items-center w-9 h-9 border border-[#e1e1e1] cursor-pointer"
          >
            &#10094;
          </li>
        )}

        {/* 
            
            {Array.from({ length: totalPage }: Tạo mảng có 10 phần tử nhưng lúc này nó là [undefined, undefined, undefined, undefined, undefined] 
            (_, index) : Tức là  (value, index) => {} (value Giá trị phần tử - index: vị trí)
            
            */}

        {Array.from({ length: totalPage }, (_, index) => {
          const pageNumber = index + 1;

          // chỉ hiển thị page gần current
          // 2>=1 và 2 <= 3
          if (
            pageNumber === 1 ||
            pageNumber === totalPage ||
            (pageNumber >= page - 1 && pageNumber <= page + 1)
          ) {
            return (
              <li
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`tex-[14px] font-semibold flex mr-[10px] justify-center items-center w-9 h-9 border cursor-pointer
            ${
              page === pageNumber
                ? "bg-black text-white"
                : "border-[#e1e1e1] bg-white text-[#333]"
            }`}
              >
                {pageNumber}
              </li>
            );
          }

          // dấu ...
          if (pageNumber === page - 2 || pageNumber === page + 2) {
            return (
              <li
                key={pageNumber}
                className="font-semibold flex mr-[10px] justify-center items-center w-9 h-9"
              >
                ...
              </li>
            );
          }

          return null; // ko render ra những số không cần hiển thị
        })}

        {/* Next */}
        {page < totalPage && (
          <li
            onClick={() => setPage(page + 1)}
            className="font-semibold flex mr-[10px] justify-center items-center w-9 h-9 border border-[#e1e1e1] cursor-pointer"
          >
            &#10095;
          </li>
        )}
      </ul>
    </div>
  );
}

export default Pagination;
