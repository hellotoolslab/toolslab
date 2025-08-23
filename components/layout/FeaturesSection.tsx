import { Zap, Shield, Heart, Clock, Globe, Code } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant',
    description: 'No loading times, no server delays. Everything runs in your browser for lightning-fast performance.',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Private',
    description: 'Your data never leaves your device. All processing happens locally with zero tracking.',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    description: 'No subscriptions, no hidden fees, no premium tiers. All tools are free for everyone, always.',
    gradient: 'from-pink-400 to-rose-500',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Works offline once loaded. No network dependency means you can use tools anywhere, anytime.',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Globe,
    title: 'Universal',
    description: 'Works on any device, any browser, any OS. Responsive design adapts to your screen perfectly.',
    gradient: 'from-purple-400 to-violet-500',
  },
  {
    icon: Code,
    title: 'Developer-First',
    description: 'Built by developers for developers. Keyboard shortcuts, dark mode, and power-user features included.',
    gradient: 'from-teal-400 to-cyan-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container-main">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Developers Choose OctoTools</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We&rsquo;ve built every tool with the same principles that guide great software: 
            fast, reliable, secure, and delightfully simple to use.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={feature.title}
                className="group relative p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Floating animation */}
                  <div 
                    className={`absolute inset-0 inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center justify-center space-x-12 bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">50k+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">1M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tools Used</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">0ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Server Delay</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}