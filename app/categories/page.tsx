import { Metadata } from 'next';
import Link from 'next/link';
import { categories, getCategoryColorClass } from '@/lib/tools';
import { Code, ArrowRight, Zap, Shield, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Tool Categories - Free Developer Tools | ToolsLab',
  description:
    'Browse all categories of free developer tools. Find the perfect tools for your development workflow organized by category.',
  keywords:
    'developer tool categories, programming tools, web development, coding utilities, online tools',
  openGraph: {
    title: 'All Tool Categories - ToolsLab',
    description:
      'Browse all categories of free developer tools organized for your development workflow.',
    type: 'website',
    url: 'https://toolslab.dev/categories',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tool Categories - ToolsLab',
    description:
      'Browse all categories of free developer tools organized for your development workflow.',
  },
  alternates: {
    canonical: 'https://toolslab.dev/categories',
  },
};

export default function CategoriesPage() {
  const totalTools = categories.reduce(
    (sum, category) => sum + category.tools.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-pink-400 to-red-600 opacity-10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="text-6xl lg:text-7xl">🛠️</div>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
              Explore Tool{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Categories
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300 lg:text-2xl">
              Discover {totalTools}+ developer tools organized into categories
              for easy browsing
            </p>

            <div className="mb-8">
              <Link
                href="/tools"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Browse All {totalTools} Tools
              </Link>
            </div>

            <div className="mb-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Lightning fast
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Privacy first
              </span>
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Always free
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
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

      {/* Statistics Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900/50">
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
