import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories, getToolsByCategory, getCategoryColorClass } from '@/lib/tools';
import { ToolCard } from '@/components/tools/ToolCard';
import { SearchBar } from '@/components/SearchBar';

interface Props {
  params: { category: string };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories.find(cat => cat.id === params.category);
  
  if (!category) {
    return {};
  }
  
  return {
    title: `${category.name} Tools - Free Online Developer Tools | OctoTools`,
    description: `${category.description} Access ${category.tools.length} free ${category.name.toLowerCase()} tools with no signup required.`,
    keywords: [
      category.name.toLowerCase(),
      'developer tools',
      'free tools',
      'online tools',
      ...category.tools.flatMap(tool => tool.keywords).slice(0, 15)
    ],
    openGraph: {
      title: `${category.name} Tools - OctoTools`,
      description: category.description,
      type: 'website',
      url: `https://octotools.org/category/${params.category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Tools - OctoTools`,
      description: category.description,
    },
    alternates: {
      canonical: `https://octotools.org/category/${params.category}`,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find(cat => cat.id === params.category);
  
  if (!category) {
    notFound();
  }
  
  const tools = getToolsByCategory(params.category);
  const popularTools = tools.filter(tool => tool.isPopular);
  const newTools = tools.filter(tool => tool.isNew);
  const otherTools = tools.filter(tool => !tool.isPopular && !tool.isNew);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">
            {category.name}
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-4 pb-12">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center text-4xl
              ${getCategoryColorClass(category.id)} border-2
            `}>
              {category.icon}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {category.name} Tools
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            {category.description}
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {tools.length} tools available
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Always free
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              No signup required
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar placeholder={`Search ${category.name.toLowerCase()} tools...`} />
        </div>

        {/* Tools Grid */}
        <div className="space-y-12">
          {/* Popular Tools */}
          {popularTools.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🔥 Most Popular
                </h2>
                <span className="text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full">
                  {popularTools.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {popularTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* New Tools */}
          {newTools.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ✨ Recently Added
                </h2>
                <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                  {newTools.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* All Other Tools */}
          {otherTools.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🛠️ All Tools
                </h2>
                <span className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full">
                  {otherTools.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* If only one category, show all tools together */}
          {popularTools.length === 0 && newTools.length === 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🛠️ All Tools
                </h2>
                <span className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full">
                  {tools.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Category Description */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className={`
            p-8 rounded-2xl border-l-4
            ${getCategoryColorClass(category.id)} border-l-current
          `}>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              About {category.name}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {category.description} Our {category.name.toLowerCase()} tools are designed to be fast, 
              reliable, and easy to use. No account required, no data stored on our servers, 
              and completely free to use for all your development needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400">⚡</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Lightning Fast</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Instant processing</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">🔒</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Privacy First</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All processing done locally</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400">🆓</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Always Free</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No limits or restrictions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Explore Other Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories
              .filter(cat => cat.id !== category.id)
              .map((otherCategory) => (
                <Link
                  key={otherCategory.id}
                  href={`/category/${otherCategory.id}`}
                  className="group"
                >
                  <div className={`
                    p-6 rounded-xl border-2 transition-all duration-200
                    hover:shadow-lg hover:-translate-y-1
                    ${getCategoryColorClass(otherCategory.id)}
                  `}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl">{otherCategory.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {otherCategory.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {otherCategory.tools.length} tools
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {otherCategory.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}