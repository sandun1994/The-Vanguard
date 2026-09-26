import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Layers } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 20,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalItems <= pageSize) {
    return (
      <div style={{
        marginTop: '2.5rem',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={15} color="#6366f1" />
          <span>Showing all <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> articles on this page</span>
        </div>
        <span style={{
          fontSize: '0.75rem',
          padding: '2px 8px',
          borderRadius: '999px',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          color: '#6366f1',
          fontWeight: '600'
        }}>
          Page 1 of 1 (Max 20/page)
        </span>
      </div>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Helper to generate smart visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const visiblePages = getPageNumbers();

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Article Pagination"
      style={{
        marginTop: '3rem',
        marginBottom: '2rem',
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Left: Range and Count Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '9px',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6366f1'
        }}>
          <Layers size={17} />
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{startItem}–{endItem}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> articles
          </div>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
            Displaying 20 articles per page
          </div>
        </div>
      </div>

      {/* Right: Page Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {/* First Page Button */}
        {totalPages > 5 && (
          <button
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            title="First Page"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-main)',
              color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: currentPage === 1 ? 0.4 : 1,
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronsLeft size={16} />
          </button>
        )}

        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
          style={{
            height: '34px',
            padding: '0 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-main)',
            color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            opacity: currentPage === 1 ? 0.4 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        {/* Page Number Buttons */}
        {visiblePages.map(page => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: isActive ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                backgroundColor: isActive ? '#6366f1' : 'var(--bg-main)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next Page"
          style={{
            height: '34px',
            padding: '0 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-main)',
            color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            opacity: currentPage === totalPages ? 0.4 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          Next <ChevronRight size={16} />
        </button>

        {/* Last Page Button */}
        {totalPages > 5 && (
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            title="Last Page"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-main)',
              color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: currentPage === totalPages ? 0.4 : 1,
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronsRight size={16} />
          </button>
        )}
      </div>
    </nav>
  );
};
