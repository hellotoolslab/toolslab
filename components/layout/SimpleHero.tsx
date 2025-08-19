import { Search, ArrowRight, Sparkles } from 'lucide-react';

export function SimpleHero() {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="container max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 50k+ developers worldwide</span>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Developer Tools That{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Actually Work
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            No signup. No limits. No BS. Just powerful tools that solve real problems.
          </p>

          {/* Hero Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="search"
                placeholder="Try 'json formatter'"
                className="w-full h-16 pl-16 pr-32 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200"
                readOnly
              />
              
              {/* Search button */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 px-6 py-3 rounded-xl font-medium flex items-center gap-2">
                Search
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <span className="text-white/70 text-sm">Popular:</span>
              {['JSON', 'Base64', 'UUID', 'Hash'].map((term) => (
                <div
                  key={term}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  {term}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}