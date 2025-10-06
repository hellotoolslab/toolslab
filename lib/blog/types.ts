export interface BlogArticle {
  slug: string;
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
  };
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
