import React from 'react';
import { ARTICLE_STATUS } from '../../types/blog';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case ARTICLE_STATUS.PUBLISHED:
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399' }}></span>
          Published
        </span>
      );
    case ARTICLE_STATUS.PENDING_REVIEW:
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fbbf24' }}></span>
          Pending Review
        </span>
      );
    case ARTICLE_STATUS.APPROVED:
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          color: '#60a5fa',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60a5fa' }}></span>
          Approved
        </span>
      );
    case ARTICLE_STATUS.ARCHIVED:
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: 'rgba(107, 114, 128, 0.15)',
          color: '#9ca3af',
          border: '1px solid rgba(107, 114, 128, 0.3)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af' }}></span>
          Archived
        </span>
      );
    default:
      return null;
  }
};

export const CategoryBadge = ({ category }) => {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '0.72rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      color: '#818cf8',
      border: '1px solid rgba(99, 102, 241, 0.25)'
    }}>
      {category}
    </span>
  );
};
