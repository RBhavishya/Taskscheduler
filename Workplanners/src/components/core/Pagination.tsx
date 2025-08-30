import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
// import { Cleft } from "../icons/Cleft";
// import { Cright } from "../icons/Cright";

export interface DynamicPaginationProps {
  paginationDetails: {
    total_records: number;
    total_pages: number;
    current_page: number;
    page_size: number;
    next_page: number | null;
    prev_page: number | null;
  };
  pageSize?: number;
  setPage?: (page: number) => void;
  setPageSize?: (size: number) => void;
}
export const Pagination = ({
  paginationDetails,
  pageSize,
  setPage,
  setPageSize,
}: DynamicPaginationProps) => {
  const getPageNumbers = () => {
    const currentPage = paginationDetails.current_page ?? 1;
    const totalPages = paginationDetails.total_pages ?? 1;
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfWindow = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfWindow);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };
  const displayPageSize = pageSize ?? paginationDetails.page_size ?? 5;
  const displayTotalRecords = paginationDetails.total_records;
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Select
          value={displayPageSize.toString()}
          onValueChange={(value) => {
            const newPageSize = Number(value);
            setPageSize?.(newPageSize);
            setPage?.(1);
          }}
        >
          <SelectTrigger className="w-16 h-8 text-sm border border-gray-300 rounded">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20].map((size) => (
              <SelectItem
                key={size}
                value={size.toString()}
                className="text-sm"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-1 text-sm text-gray-600">
          Total: {displayTotalRecords} records | Pages:{" "}
          {paginationDetails.total_pages}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          className="flex items-center justify-center w-8 h-8 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setPage?.(paginationDetails.current_page - 1)}
          disabled={paginationDetails.current_page === 1}
          aria-label="Previous page"
        >
          {/* <Cleft /> */}
        </button>
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === "number" ? (
              <button
                className={`flex items-center justify-center w-7 h-7 text-sm font-medium rounded ${
                  paginationDetails.current_page === page
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setPage?.(page)}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ) : (
              <span className="flex items-center justify-center w-8 h-8 text-sm text-gray-500">
                {page}
              </span>
            )}
          </React.Fragment>
        ))}
        <button
          className="flex items-center justify-center w-8 h-8 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => setPage?.(paginationDetails.current_page + 1)}
          disabled={
            paginationDetails.current_page === paginationDetails.total_pages
          }
          aria-label="Next page"
        >
          {/* <Cright /> */}
        </button>
      </div>
    </div>
  );
};
