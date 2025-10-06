import { BlogArticle } from './types';

export const mockArticles: BlogArticle[] = [
  {
    slug: 'json-formatting-complete-guide',
    title: 'JSON Formatting: The Complete Developer Guide',
    excerpt:
      'Master JSON formatting with our comprehensive guide. Learn syntax rules, best practices, common errors, and advanced techniques for clean, readable JSON.',
    publishDate: new Date('2025-09-25'),
    modifiedDate: new Date('2025-09-25'),
    readTime: '12 min read',
    category: 'Guide',
    isPillar: true,
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'json-formatter',
      'json-validator',
      'csv-to-json',
      'xml-formatter',
    ],
    relatedArticles: ['json-vs-xml-vs-yaml', 'api-testing-best-practices'],
    tags: [
      'json',
      'formatting',
      'data-structures',
      'validation',
      'best-practices',
    ],
    seo: {
      metaTitle:
        'JSON Formatting: The Complete Developer Guide | ToolsLab Blog',
      metaDescription:
        'Master JSON formatting with our comprehensive guide. Learn syntax rules, best practices, common errors, and advanced techniques.',
      // ogImage: '/og-images/json-formatting-guide.png', // Commented out to test default image
    },
  },
  {
    slug: 'base64-encoding-explained',
    title: 'Base64 Encoding Explained: When and How to Use It',
    excerpt:
      'Deep dive into Base64 encoding. Understand how it works, when to use it, and best practices for implementing Base64 in your applications.',
    publishDate: new Date('2025-01-18'),
    readTime: '8 min read',
    category: 'Tutorial',
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'base64-encoder',
      'base64-to-image',
      'url-encoder',
      'jwt-decoder',
    ],
    relatedArticles: ['password-security-guide', 'api-testing-best-practices'],
    tags: [
      'base64',
      'encoding',
      'security',
      'data-transmission',
      'binary-data',
    ],
    seo: {
      metaTitle: 'Base64 Encoding Explained: When and How to Use It | ToolsLab',
      metaDescription:
        'Deep dive into Base64 encoding. Understand how it works, when to use it, and best practices for implementation.',
      ogImage: '/og-images/base64-guide.png',
    },
  },
  {
    slug: 'json-vs-xml-vs-yaml',
    title: 'JSON vs XML vs YAML: Choosing the Right Format',
    excerpt:
      'Comprehensive comparison of JSON, XML, and YAML. Learn the strengths, weaknesses, and ideal use cases for each data serialization format.',
    publishDate: new Date('2025-01-15'),
    readTime: '10 min read',
    category: 'Comparison',
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'json-formatter',
      'xml-formatter',
      'json-to-yaml',
      'csv-to-json',
    ],
    relatedArticles: [
      'json-formatting-complete-guide',
      'api-testing-best-practices',
    ],
    tags: [
      'json',
      'xml',
      'yaml',
      'data-formats',
      'comparison',
      'serialization',
    ],
    seo: {
      metaTitle:
        'JSON vs XML vs YAML: Choosing the Right Data Format | ToolsLab',
      metaDescription:
        'Comprehensive comparison of JSON, XML, and YAML. Learn strengths, weaknesses, and ideal use cases for each format.',
      ogImage: '/og-images/data-formats-comparison.png',
    },
  },
  {
    slug: '10-essential-developer-tools',
    title: '10 Essential Developer Tools That Save Hours Daily',
    excerpt:
      'Discover the must-have developer tools that streamline your workflow. From formatters to generators, these tools will transform your productivity.',
    publishDate: new Date('2025-01-12'),
    readTime: '7 min read',
    category: 'Guide',
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'json-formatter',
      'regex-tester',
      'password-generator',
      'unix-timestamp',
      'sql-formatter',
    ],
    relatedArticles: ['json-formatting-complete-guide', 'regex-patterns-guide'],
    tags: [
      'productivity',
      'developer-tools',
      'workflow',
      'efficiency',
      'best-tools',
    ],
    seo: {
      metaTitle:
        '10 Essential Developer Tools That Save Hours Daily | ToolsLab',
      metaDescription:
        'Discover must-have developer tools that streamline your workflow. From formatters to generators, transform your productivity.',
      ogImage: '/og-images/essential-tools.png',
    },
  },
  {
    slug: 'regex-patterns-guide',
    title: 'Regular Expressions: From Basics to Advanced Patterns',
    excerpt:
      'Master regular expressions with this comprehensive guide. Learn pattern matching, capturing groups, lookarounds, and real-world regex applications.',
    publishDate: new Date('2025-01-10'),
    readTime: '15 min read',
    category: 'Deep Dive',
    isPillar: true,
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'regex-tester',
      'text-formatter',
      'case-converter',
      'string-encoder',
    ],
    relatedArticles: [
      '10-essential-developer-tools',
      'api-testing-best-practices',
    ],
    tags: [
      'regex',
      'pattern-matching',
      'text-processing',
      'validation',
      'advanced-techniques',
    ],
    seo: {
      metaTitle:
        'Regular Expressions: From Basics to Advanced Patterns | ToolsLab',
      metaDescription:
        'Master regular expressions with this comprehensive guide. Learn pattern matching, capturing groups, and real-world applications.',
      ogImage: '/og-images/regex-guide.png',
    },
  },
  {
    slug: 'api-testing-best-practices',
    title: 'API Testing Best Practices for Modern Development',
    excerpt:
      'Learn essential API testing strategies, tools, and methodologies. From unit tests to integration testing, ensure your APIs are robust and reliable.',
    publishDate: new Date('2025-01-08'),
    readTime: '11 min read',
    category: 'Best Practices',
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'json-formatter',
      'jwt-decoder',
      'base64-encoder',
      'url-encoder',
    ],
    relatedArticles: ['json-formatting-complete-guide', 'json-vs-xml-vs-yaml'],
    tags: ['api', 'testing', 'rest', 'best-practices', 'quality-assurance'],
    seo: {
      metaTitle: 'API Testing Best Practices for Modern Development | ToolsLab',
      metaDescription:
        'Learn essential API testing strategies, tools, and methodologies. Ensure your APIs are robust and reliable.',
      ogImage: '/og-images/api-testing.png',
    },
  },
  {
    slug: 'password-security-guide',
    title: 'Password Security: Generation, Storage, and Management',
    excerpt:
      'Complete guide to password security. Learn about strong password generation, secure storage methods, and modern authentication best practices.',
    publishDate: new Date('2025-01-05'),
    readTime: '9 min read',
    category: 'Guide',
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'password-generator',
      'hash-generator',
      'base64-encoder',
      'jwt-decoder',
    ],
    relatedArticles: [
      'base64-encoding-explained',
      'api-testing-best-practices',
    ],
    tags: [
      'security',
      'passwords',
      'authentication',
      'encryption',
      'best-practices',
    ],
    seo: {
      metaTitle:
        'Password Security: Generation, Storage, and Management | ToolsLab',
      metaDescription:
        'Complete guide to password security. Learn strong password generation, secure storage, and modern authentication practices.',
      ogImage: '/og-images/password-security.png',
    },
  },
  {
    slug: 'color-theory-for-developers',
    title: 'Color Theory for Developers: Beyond Hex Codes',
    excerpt:
      'Understanding color theory for web development. From hex codes to HSL, learn how to create beautiful, accessible color schemes for your applications.',
    publishDate: new Date('2025-01-03'),
    readTime: '8 min read',
    category: 'Tutorial',
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'color-converter',
      'hex-to-rgb',
      'color-palette',
      'css-gradient',
    ],
    relatedArticles: [
      '10-essential-developer-tools',
      'sql-formatting-standards',
    ],
    tags: ['color', 'design', 'css', 'accessibility', 'web-development'],
    seo: {
      metaTitle:
        'Color Theory for Developers: Beyond Hex Codes | ToolsLab Blog',
      metaDescription:
        'Understanding color theory for web development. Learn to create beautiful, accessible color schemes for your applications.',
      ogImage: '/og-images/color-theory.png',
    },
  },
  {
    slug: 'sql-formatting-standards',
    title: 'SQL Formatting Standards and Why They Matter',
    excerpt:
      'Learn SQL formatting best practices and standards. Improve readability, maintainability, and team collaboration with properly formatted SQL queries.',
    publishDate: new Date('2025-01-01'),
    readTime: '7 min read',
    category: 'Best Practices',
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'sql-formatter',
      'json-formatter',
      'csv-to-json',
      'text-formatter',
    ],
    relatedArticles: [
      'json-formatting-complete-guide',
      '10-essential-developer-tools',
    ],
    tags: ['sql', 'database', 'formatting', 'standards', 'best-practices'],
    seo: {
      metaTitle: 'SQL Formatting Standards and Why They Matter | ToolsLab Blog',
      metaDescription:
        'Learn SQL formatting best practices and standards. Improve readability and maintainability of your database queries.',
      ogImage: '/og-images/sql-formatting.png',
    },
  },
  {
    slug: 'url-encoding-decoding-guide',
    title: 'The Ultimate Guide to URL Encoding and Decoding',
    excerpt:
      'Comprehensive guide to URL encoding and decoding. Understand percent-encoding, special characters, and best practices for handling URLs in applications.',
    publishDate: new Date('2024-12-28'),
    readTime: '13 min read',
    category: 'Deep Dive',
    isPillar: true,
    author: {
      name: 'ToolsLab Team',
      bio: 'Building developer tools that save time and improve productivity.',
    },
    relatedTools: [
      'url-encoder',
      'url-decoder',
      'base64-encoder',
      'query-string-parser',
    ],
    relatedArticles: [
      'base64-encoding-explained',
      'api-testing-best-practices',
    ],
    tags: ['url', 'encoding', 'web-standards', 'http', 'percent-encoding'],
    seo: {
      metaTitle: 'The Ultimate Guide to URL Encoding and Decoding | ToolsLab',
      metaDescription:
        'Comprehensive guide to URL encoding and decoding. Understand percent-encoding, special characters, and best practices.',
      ogImage: '/og-images/url-encoding.png',
    },
  },
];
