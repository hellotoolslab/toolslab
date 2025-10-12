export interface BlogArticle {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  content?: string;
  publishDate: Date;
  modifiedDate?: Date;
  readTime: string;
  category:
    | 'Tutorial'
    | 'Guide'
    | 'Comparison'
    | 'Best Practices'
    | 'Deep Dive';
  thumbnail?: string;
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  relatedTools: string[];
  relatedArticles?: string[];
  tags: string[];
  isPillar?: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
    keywords?: string[];
  };
}

export interface BlogArticleContent {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  publishDate: string;
  modifiedDate?: string;
  readTime: string;
  category:
    | 'Tutorial'
    | 'Guide'
    | 'Comparison'
    | 'Best Practices'
    | 'Deep Dive';
  author: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
    keywords?: string[];
  };
  toc: TOCItem[];
  faq: FAQItem[];
  relatedTools: string[];
  relatedArticles?: string[];
  tags?: string[];
  isPillar?: boolean;
  content: {
    sections: ArticleSection[];
  };
}

export interface ArticleSection {
  id: string;
  title?: string;
  html: string;
}

export interface ArticleWithLocale {
  article: BlogArticleContent | null;
  locale: string;
  isFallback: boolean;
}

export interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface FAQItem {
  question: string;
  answer: string;
}
