import { Metadata } from 'next';
import { tools, categories, getPopularTools } from '@/lib/tools';
import { ToolCard } from '@/components/tools/ToolCard';
// import { CategoryCard } from '@/components/tools/CategoryCard';
import { SimpleHero } from '@/components/layout/SimpleHero';
import { FeaturesSection } from '@/components/layout/FeaturesSection';

export const metadata: Metadata = {
  title: 'OctoTools - Essential Developer Tools',
  description: 'A comprehensive collection of developer tools for encoding, formatting, converting, and generating. All tools work offline and respect your privacy.',
  openGraph: {
    title: 'OctoTools - Essential Developer Tools',
    description: 'A comprehensive collection of developer tools for encoding, formatting, converting, and generating. All tools work offline and respect your privacy.',
    url: 'https://octotools.dev',
    siteName: 'OctoTools',
    type: 'website',
  },
};

export default function HomePage() {
  const popularTools = getPopularTools().slice(0, 6);
  const sortedTools = [...tools].sort((a, b) => b.searchVolume - a.searchVolume);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SimpleHero />

      {/* Quick Access Tools */}
      <section className="container-main py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Quick Access</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Jump straight into the most popular tools. No setup required.
          </p>
        </div>
        
        <div className="tools-grid">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showStats />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our collection of tools organized by functionality. 
              Each category offers specialized utilities for different development needs.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryColor = {
                data: '#0EA5E9',
                encoding: '#10B981',
                text: '#8B5CF6', 
                generators: '#F97316',
                web: '#EC4899',
                dev: '#F59E0B'
              }[category.id] || '#3B82F6';
              
              return (
                <div 
                  key={category.id} 
                  className="relative p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer overflow-hidden"
                >
                  {/* Color accent */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: categoryColor }}
                  />
                  
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${categoryColor}20`,
                        borderColor: `${categoryColor}40`,
                        color: categoryColor
                      }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${categoryColor}20`,
                            color: categoryColor
                          }}
                        >
                          {category.tools.length} tool{category.tools.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Preview Tools */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Featured Tools:
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {category.tools.slice(0, 4).map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-colors"
                        >
                          <span className="text-lg flex-shrink-0">{tool.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {tool.name}
                            </div>
                            {tool.isPopular && (
                              <div className="text-xs text-amber-600 dark:text-amber-400">Popular</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {category.tools.length > 4 && (
                      <div className="text-center pt-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          +{category.tools.length - 4} more tools
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: categoryColor }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* All Tools Section */}
      <section className="container-main py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">All Tools</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete collection of developer utilities, sorted by popularity.
          </p>
        </div>
        
        <div className="tools-grid">
          {sortedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-16">
        <div className="container-main text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who trust OctoTools for their daily tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <div className="flex items-center gap-2 text-lg">
              <span className="text-2xl">⚡</span>
              <span>Instant</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <span className="text-2xl">🔒</span>
              <span>Private</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <span className="text-2xl">💝</span>
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}