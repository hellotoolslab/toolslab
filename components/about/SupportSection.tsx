'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Server, Zap, Shield, Heart, ExternalLink } from 'lucide-react';
import { trackConversion, trackSocial, trackEngagement } from '@/lib/analytics';
import Link from 'next/link';

const supportBenefits = [
  { icon: Zap, text: 'More tools developed faster' },
  { icon: Server, text: 'Server costs covered' },
  { icon: Coffee, text: 'Late-night coding fuel' },
  { icon: Shield, text: 'Staying independent from corporate interests' },
];

export function SupportSection() {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 5) {
      setShowEasterEgg(true);
      trackEngagement('easter-egg-discovered', {
        location: 'about-support-section',
        clicks: newCount,
      });
      setTimeout(() => setShowEasterEgg(false), 5000);
    } else if (newCount > 5) {
      setClickCount(0);
    }
  };

  const handleDonationClick = () => {
    trackConversion('donation', 'about-support-section');
  };

  const handleSocialClick = (platform: 'twitter') => {
    trackSocial(platform, 'about-support-section');
  };

  return (
    <section className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 py-12 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Support the Mission</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Keep ToolsLab{' '}
              <span className="text-violet-600 dark:text-violet-400">
                Independent
              </span>
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900 md:p-12">
            <div className="mb-8 text-center">
              <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">
                If ToolsLab saved you time today, consider{' '}
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  buying me a coffee
                </span>{' '}
                <button
                  onClick={handleLogoClick}
                  className="cursor-pointer transition-transform hover:scale-110"
                  title={showEasterEgg ? '🎉 You found the easter egg!' : ''}
                >
                  ☕
                </button>
              </p>

              <div className="mb-8 grid gap-6 md:grid-cols-2">
                {supportBenefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.text}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {benefit.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="https://buymeacoffee.com/toolslab"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDonationClick}
                  className="inline-flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-amber-600 hover:to-orange-700"
                >
                  <Coffee className="h-5 w-5" />
                  Buy me a Coffee ☕
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  href="https://twitter.com/toolslab"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick('twitter')}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Follow on 𝕏 @toolslab
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">
                    Not in a position to donate?
                  </span>{' '}
                  That&apos;s totally fine!
                  <br />
                  The tools are here for everyone, regardless.
                </p>

                <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950/30">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">P.S.</span> - No newsletter.
                    I&apos;m too busy building tools to write emails.
                    <br />
                    Follow on 𝕏 if you want updates, or don&apos;t. The tools
                    will be here either way.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-2 text-3xl">🚀</div>
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Always Available
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-2 text-3xl">⚡</div>
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                &lt;100ms
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Processing Speed
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-2 text-3xl">🔒</div>
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                0%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Data Collected
              </div>
            </div>
          </motion.div>

          {/* Easter Egg */}
          {showEasterEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="mt-8 text-center"
            >
              <div className="mx-auto max-w-md rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white">
                <div className="mb-2 text-4xl">🧪⚗️🔬</div>
                <h3 className="mb-2 font-bold">Behind the Scenes</h3>
                <div className="space-y-1 text-sm">
                  <p>🚀 Coded with: VS Code + Coffee</p>
                  <p>⏰ Development time: 247 hours</p>
                  <p>☕ Coffees consumed: 73</p>
                  <p>🐛 Bugs squashed: 142</p>
                  <p className="mt-3 font-semibold">
                    Made with ❤️ for developers
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
