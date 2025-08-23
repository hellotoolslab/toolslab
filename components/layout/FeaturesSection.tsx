import { Zap, Shield, Heart, Clock, Globe, Code } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant',
    description:
      'No loading times, no server delays. Everything runs in your browser for lightning-fast performance.',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Private',
    description:
      'Your data never leaves your device. All processing happens locally with zero tracking.',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    description:
      'No subscriptions, no hidden fees, no premium tiers. All tools are free for everyone, always.',
    gradient: 'from-pink-400 to-rose-500',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description:
      'Works offline once loaded. No network dependency means you can use tools anywhere, anytime.',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Globe,
    title: 'Universal',
    description:
      'Works on any device, any browser, any OS. Responsive design adapts to your screen perfectly.',
    gradient: 'from-purple-400 to-violet-500',
  },
  {
    icon: Code,
    title: 'Developer-First',
    description:
      'Built by developers for developers. Keyboard shortcuts, dark mode, and power-user features included.',
    gradient: 'from-teal-400 to-cyan-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container-main">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Why Developers Choose OctoTools
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
            We&rsquo;ve built every tool with the same principles that guide
            great software: fast, reliable, secure, and delightfully simple to
            use.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex rounded-2xl bg-gradient-to-r p-4 ${feature.gradient} shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Floating animation */}
                  <div
                    className={`absolute inset-0 inline-flex rounded-2xl bg-gradient-to-r p-4 ${feature.gradient} opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-30`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center justify-center space-x-12 rounded-2xl bg-gray-50 p-8 dark:bg-gray-900">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                50k+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Users
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-green-600 dark:text-green-400">
                1M+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tools Used
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-purple-600 dark:text-purple-400">
                99.9%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Uptime
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-orange-600 dark:text-orange-400">
                0ms
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Server Delay
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
