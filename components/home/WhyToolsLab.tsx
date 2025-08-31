'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Link, Moon, Smartphone, Rocket } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Instant Processing',
    description:
      'Everything runs in your browser. No server delays, no waiting.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Zero Data Storage',
    description:
      'Your data never leaves your device. Complete privacy guaranteed.',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Link,
    title: 'Chain Tools Together',
    description:
      'Smart workflow automation. Connect tools for complex operations.',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Easy on your eyes during late coding sessions.',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'Desktop, tablet, mobile ready. Code from anywhere.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Rocket,
    title: 'No Signup Required',
    description:
      'Start using tools immediately. No barriers, just productivity.',
    color: 'from-red-400 to-orange-500',
  },
];

export function WhyToolsLab() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Why Choose ToolsLab?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Six reasons developers love our platform
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.color} text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>

                    {/* Decorative element */}
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-20 dark:from-gray-700 dark:to-gray-800" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional trust message */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Built with ❤️ by developers who understand your needs
          </p>
        </div>
      </div>
    </section>
  );
}
