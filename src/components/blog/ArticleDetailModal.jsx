import React from 'react';
import { ArticleReaderPage } from './ArticleReaderPage';

export const ArticleDetailModal = ({ article, allArticles = [], onClose, onSelectArticle, onOpenAuthorModal }) => {
  if (!article) return null;

  return (
    <ArticleReaderPage
      article={article}
      allArticles={allArticles}
      onBack={onClose}
      onSelectArticle={onSelectArticle}
      onOpenAuthorModal={onOpenAuthorModal}
    />
  );
};
