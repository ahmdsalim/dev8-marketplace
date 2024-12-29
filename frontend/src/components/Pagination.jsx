import ReactPaginate from "react-paginate";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const Pagination = ({ pageCount, onPageChange }) => {
  return (
    <ReactPaginate
      previousLabel={<ChevronLeft className="w-4 h-4" />}
      nextLabel={<ChevronRight className="w-4 h-4" />}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName={
        "pagination flex justify-center items-center space-x-2 mt-8"
      }
      pageClassName={"pagination__page"}
      pageLinkClassName={
        "pagination__link w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
      }
      activeClassName={"pagination__page--active"}
      activeLinkClassName={"bg-black text-white hover:bg-gray"}
      previousClassName={"pagination__previous"}
      nextClassName={"pagination__next"}
      previousLinkClassName={
        "pagination__nav-link w-8 h-8 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200"
      }
      nextLinkClassName={
        "pagination__nav-link w-8 h-8 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200"
      }
      disabledClassName={
        "pagination__link--disabled opacity-50 cursor-not-allowed"
      }
      breakClassName={"pagination__break"}
      breakLinkClassName={
        "pagination__link w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-700"
      }
    />
  );
};
