'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code, Search, Shield, Heart, Zap, X } from 'lucide-react';
import { categories, getCategoryColorClass } from '@/lib/tools';

export default function CategoriesHubContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const totalTools = categories.reduce(
    (sum, category) => sum + category.tools.length,
    0
  );

  const filteredCategories = categories.filter(
    (category) =>
      searchQuery === '' ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.tools.some(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section with Vibrant Brand Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-cyan-500 to-indigo-600">
        {/* Pattern Overlay */}
        <div className="bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0" />

        {/* Gradient Decorations */}
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/20 to-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/15 to-white/5 blur-3xl" />

        <div className="relative py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Breadcrumbs */}
              <nav className="mb-8 flex justify-center" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-white/70">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-white"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <ArrowRight className="h-3 w-3" />
                  </li>
                  <li className="font-medium text-white">Categories</li>
                </ol>
              </nav>

              {/* Hero Icon */}
              <div className="mb-8 flex justify-center">
                <div className="text-6xl lg:text-7xl">🛠️</div>
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
                Explore Tool{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Categories
                </span>
              </h1>

              {/* Expanded Header Description */}
              <div className="mx-auto mb-8 max-w-4xl text-white/90">
                <p className="mb-4 text-xl lg:text-2xl">
                  Discover {totalTools}+ professional developer tools organized
                  into {categories.length} specialized categories for
                  streamlined workflows and enhanced productivity.
                </p>
                <p className="text-lg leading-relaxed lg:text-xl">
                  Whether you&apos;re{' '}
                  <Link
                    href="/tools/json-formatter"
                    className="text-white underline hover:text-white/80"
                  >
                    formatting JSON data
                  </Link>
                  ,{' '}
                  <Link
                    href="/tools/base64-encode"
                    className="text-white underline hover:text-white/80"
                  >
                    encoding Base64 strings
                  </Link>
                  , or{' '}
                  <Link
                    href="/tools/hash-generator"
                    className="text-white underline hover:text-white/80"
                  >
                    generating secure hashes
                  </Link>
                  , our categorized approach helps you find the right tool
                  instantly. Each category contains battle-tested utilities used
                  by thousands of developers worldwide, from{' '}
                  <strong>data conversion</strong> and{' '}
                  <strong>security operations</strong> to{' '}
                  <strong>text processing</strong> and{' '}
                  <strong>code generation</strong>. Save time navigating complex
                  workflows by browsing tools that complement each other within
                  logical groupings designed for real-world development
                  scenarios.
                </p>
              </div>

              {/* Search Bar */}
              <div className="mx-auto mb-8 max-w-2xl">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full rounded-full border border-white/20 bg-white/10 py-4 pl-12 pr-12 text-white placeholder-white/60 backdrop-blur-sm transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/60 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="mt-2 text-sm text-white/70">
                    Found {filteredCategories.length} categories matching
                    &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/tools"
                  className="inline-flex items-center rounded-full bg-white px-8 py-4 font-semibold text-slate-800 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  Browse All {totalTools} Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <Link
                  href="/tools?sort=popular"
                  className="inline-flex items-center rounded-full border-2 border-white/30 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
                >
                  Popular Tools
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Lightning fast
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  Privacy first
                </span>
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  Always free
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {searchQuery && (
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredCategories.length === 0 ? (
                  <>No categories found for &ldquo;{searchQuery}&rdquo;</>
                ) : (
                  `${filteredCategories.length} categories found`
                )}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category, index) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`relative rounded-2xl border-2 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800 ${getCategoryColorClass(category.id)} overflow-hidden`}
                >
                  {/* Background decoration */}
                  <div className="absolute right-0 top-0 h-24 w-24 opacity-10">
                    <div className="-translate-y-2 translate-x-4 rotate-12 transform text-6xl">
                      {category.icon}
                    </div>
                  </div>

                  {/* Category Icon */}
                  <div className="relative z-10 mb-6">
                    <div
                      className={`inline-flex rounded-2xl bg-gradient-to-br from-white/80 to-gray-100/80 p-4 text-4xl shadow-lg transition-transform group-hover:scale-110 dark:from-gray-700/80 dark:to-gray-800/80`}
                    >
                      {category.icon}
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="relative z-10">
                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {category.name}
                    </h3>

                    <p className="mb-4 line-clamp-2 leading-relaxed text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Code className="h-4 w-4" />
                        <span>{category.tools.length} tools</span>
                      </div>

                      <ArrowRight className="h-5 w-5 transform text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular Categories */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Most Popular Categories
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              The most frequently used tool categories by developers worldwide
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories
                .sort((a, b) => b.tools.length - a.tools.length)
                .slice(0, 4)
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="group rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2 text-2xl text-white">
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                    </div>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {category.tools.length} tools available
                    </p>
                    <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
                      Explore tools
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Organize Developer Tools by Category? */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Why Organize Developer Tools by Category?
            </h2>

            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
              <p>
                Organizing developer tools by category transforms chaotic
                workflows into streamlined processes. Instead of searching
                through hundreds of random utilities, developers can quickly
                navigate to specific tool families that address their immediate
                needs. This categorical approach mirrors how development teams
                naturally think about their work - whether they&apos;re handling
                data transformation, implementing security measures, or
                optimizing text content.
              </p>

              <p>
                Our category system reduces cognitive load by grouping
                complementary tools together. When you&apos;re working with{' '}
                <Link
                  href="/category/data"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  data conversion tasks
                </Link>
                , you&apos;ll find JSON formatters alongside CSV converters and
                SQL beautifiers. Similarly,{' '}
                <Link
                  href="/category/encoding"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  security-focused encoding tools
                </Link>{' '}
                are grouped with hash generators and JWT decoders, creating
                logical workflows that save valuable development time.
              </p>

              <p>
                Each category represents years of developer feedback and usage
                patterns, ensuring that the most frequently needed tools are
                easily discoverable. This organization helps both beginners
                learn about tool relationships and experienced developers
                maintain efficient workflows across complex projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Developer Workflows */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Popular Developer Workflows
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                API Development Flow
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  1.{' '}
                  <Link
                    href="/tools/json-formatter"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Format JSON responses
                  </Link>
                </div>
                <div>
                  2.{' '}
                  <Link
                    href="/tools/jwt-decoder"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Decode JWT tokens
                  </Link>
                </div>
                <div>
                  3.{' '}
                  <Link
                    href="/tools/base64-encode"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Encode API credentials
                  </Link>
                </div>
                <div>
                  4.{' '}
                  <Link
                    href="/tools/hash-generator"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Generate request signatures
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Data Processing Pipeline
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  1.{' '}
                  <Link
                    href="/tools/csv-to-json"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Convert CSV to JSON
                  </Link>
                </div>
                <div>
                  2.{' '}
                  <Link
                    href="/tools/json-formatter"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Validate and format data
                  </Link>
                </div>
                <div>
                  3.{' '}
                  <Link
                    href="/tools/sql-formatter"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Generate SQL queries
                  </Link>
                </div>
                <div>
                  4.{' '}
                  <Link
                    href="/tools/hash-generator"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Create data checksums
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Security & Deployment
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  1.{' '}
                  <Link
                    href="/tools/password-generator"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Generate secure passwords
                  </Link>
                </div>
                <div>
                  2.{' '}
                  <Link
                    href="/tools/uuid-generator"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Create unique identifiers
                  </Link>
                </div>
                <div>
                  3.{' '}
                  <Link
                    href="/tools/base64-encode"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Encode configuration data
                  </Link>
                </div>
                <div>
                  4.{' '}
                  <Link
                    href="/tools/crontab-builder"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Schedule automated tasks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  Which category should I choose for JSON-related tasks?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  JSON tools are primarily found in the{' '}
                  <Link
                    href="/category/data"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Data & Conversion
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/category/formatters"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Formatters
                  </Link>{' '}
                  categories. Use Data & Conversion for transforming JSON to
                  other formats, and Formatters for beautifying and validating
                  JSON structure.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  What&apos;s the difference between Encoding & Security and
                  Generators?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <Link
                    href="/category/encoding"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Encoding & Security
                  </Link>{' '}
                  focuses on transforming existing data (Base64 encoding,
                  hashing), while{' '}
                  <Link
                    href="/category/generators"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Generators
                  </Link>{' '}
                  creates new content from scratch (UUIDs, passwords, QR codes).
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  Can I use multiple tools from different categories together?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Absolutely! Many workflows combine tools across categories.
                  For example, you might generate a UUID, encode it with Base64,
                  then format the result in JSON - using tools from Generators,
                  Encoding, and Data categories respectively.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  Are all tools in each category equally maintained?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, every tool regardless of category receives the same level
                  of attention for performance, security, and user experience.
                  Popular tools like our{' '}
                  <Link
                    href="/tools/json-formatter"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    JSON Formatter
                  </Link>{' '}
                  and specialized utilities receive equal maintenance priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse All Tools CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to Boost Your Development Workflow?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Explore all {totalTools}+ tools or dive into specific categories
            that match your current project needs.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Browse All Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/tools?sort=popular"
              className="inline-flex items-center rounded-full border-2 border-white/30 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
            >
              View Popular Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose ToolsLab */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-12 text-3xl font-bold text-gray-900 dark:text-white">
              Why Developers Choose ToolsLab
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All tools are optimized for speed and work instantly in your
                  browser
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Privacy First
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data never leaves your browser. Everything is processed
                  locally
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Always Free
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No accounts, no limits, no hidden costs. All tools are
                  completely free
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
