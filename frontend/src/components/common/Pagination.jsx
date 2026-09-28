import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination Component
 * Accessible, responsive page controls strictly adhering to S.O.L.I.D (< 230 lines).
 *
 * @param {number} currentPage - Currently active 1-indexed page
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback when a page is selected
 * @param {string} className - Optional container styling
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  className = '',
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  const handlePageSelect = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Catalog Pagination"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E2E8DF] ${className}`}
    >
      <span className="text-xs font-medium text-[#475569]">
        Showing Page <strong className="text-[#0F172A]">{currentPage}</strong> of{' '}
        <strong className="text-[#0F172A]">{totalPages}</strong>
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handlePageSelect(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E2E8DF] text-xs font-semibold text-[#0F172A] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePageSelect(p)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handlePageSelect(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E2E8DF] text-xs font-semibold text-[#0F172A] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
}
