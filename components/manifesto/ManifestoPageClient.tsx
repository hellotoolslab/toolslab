'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Shield,
  Zap,
  Users,
  Code,
  Heart,
  Star,
  Quote,
  Scroll,
  Crown,
  Mountain,
  WifiOff,
  Github,
  ExternalLink,
  UserCheck,
  Award,
  Coffee,
  Handshake,
  Rocket,
  ArrowRight,
} from 'lucide-react';

const principles = [
  {
    title: 'Privacy by Design',
    text: 'Every tool is built with privacy as the foundation. No tracking, no data collection, no surveillance.',
    icon: Shield,
    gradient: 'from-green-400 to-emerald-600',
    bgGradient:
      'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
  },
  {
    title: 'Offline First',
    text: 'Your tools should work anywhere, anytime. No internet? No problem. Everything works locally.',
    icon: WifiOff,
    gradient: 'from-blue-400 to-cyan-600',
    bgGradient:
      'from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20',
  },
  {
    title: 'Open & Transparent',
    text: 'Our code is open source. You can inspect, modify, and contribute to every line.',
    icon: Code,
    gradient: 'from-purple-400 to-violet-600',
    bgGradient:
      'from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20',
  },
  {
    title: 'Performance Matters',
    text: 'Fast tools make happy developers. We optimize for speed and efficiency in everything we build.',
    icon: Zap,
    gradient: 'from-orange-400 to-red-600',
    bgGradient:
      'from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20',
  },
];

const values = [
  {
    text: 'We value your privacy above profit',
    icon: Heart,
    color: 'text-red-600',
  },
  {
    text: 'We build for the long term, not for quick wins',
    icon: Mountain,
    color: 'text-blue-600',
  },
  {
    text: 'We believe in the power of open source',
    icon: Github,
    color: 'text-purple-600',
  },
  {
    text: 'We prioritize user experience over everything else',
    icon: Star,
    color: 'text-yellow-600',
  },
];

export default function ManifestoPageClient() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      setActivePrinciple((prev) => (prev + 1) % principles.length);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute -left-1/2 -top-1/2 h-full w-full rounded-full bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent blur-3xl"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          />
          <div
            className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-pink-600/20 via-orange-600/10 to-transparent blur-3xl"
            style={{ transform: `translateY(${-parallaxOffset}px)` }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          <div className="mb-8">
            <div className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 dark:border-blue-800">
              <Scroll className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-600 dark:text-blue-400">
                The ToolsLab Manifesto
              </span>
            </div>
          </div>

          <h1 className="mb-8 text-5xl font-black md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ToolsLab
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Manifesto</span>
          </h1>

          <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:text-2xl lg:text-3xl">
            Our commitment to building a better web for developers
          </p>

          <div className="mx-auto mb-16 max-w-3xl text-lg leading-relaxed text-gray-500 dark:text-gray-400 md:text-xl">
            We believe in a different kind of web. A web where your privacy is
            respected, your data stays yours, and tools work for you, not
            against you.
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-blue-900/10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-purple-200 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-3 dark:border-purple-800">
              <Crown className="mr-3 h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-purple-600 dark:text-purple-400">
                Our Principles
              </span>
            </div>
            <h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              Built on{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Unshakeable
              </span>{' '}
              Principles
            </h2>
          </div>

          <div className="mb-20 grid gap-12 lg:grid-cols-2">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div
                  key={principle.title}
                  className={`group relative cursor-pointer rounded-3xl p-8 transition-all duration-500 lg:p-12 ${
                    activePrinciple === index
                      ? 'scale-105 shadow-2xl'
                      : 'shadow-xl hover:scale-102 hover:shadow-2xl'
                  } bg-gradient-to-br ${principle.bgGradient} border border-white/50 dark:border-gray-800/50`}
                  onMouseEnter={() => setActivePrinciple(index)}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />

                  <div className="relative z-10">
                    <div
                      className={`inline-flex rounded-2xl bg-gradient-to-br p-6 ${principle.gradient} mb-8 transition-transform group-hover:scale-110`}
                    >
                      <IconComponent className="h-12 w-12 text-white" />
                    </div>

                    <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
                      {principle.title}
                    </h3>

                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                      {principle.text}
                    </p>
                  </div>

                  <div
                    className={`absolute right-4 top-4 h-12 w-12 rounded-full bg-gradient-to-br ${principle.gradient} opacity-20 transition-opacity group-hover:opacity-40`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-black dark:to-gray-950" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-3">
              <Star className="mr-3 h-5 w-5 text-yellow-400" />
              <span className="font-medium text-yellow-400">Our Values</span>
            </div>
            <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Our Core{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
          </div>

          <div className="mb-20 grid gap-8 md:grid-cols-2">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.text}
                  className="group relative rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-gray-600 lg:p-12"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 rounded-2xl border border-gray-600 bg-gray-800 p-4">
                      <IconComponent className={`h-8 w-8 ${value.color}`} />
                    </div>

                    <div className="flex-1">
                      <Quote className="mb-4 h-8 w-8 text-gray-500" />
                      <p className="text-xl leading-relaxed text-gray-200">
                        {value.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-6 py-3">
            <Handshake className="mr-3 h-5 w-5 text-white" />
            <span className="font-medium text-white">Our Commitment</span>
          </div>

          <h2 className="mb-12 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Our Sacred{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Promise
            </span>
          </h2>

          <div className="relative mb-16 rounded-3xl border border-white/20 bg-gradient-to-br from-white/5 to-white/10 p-12 backdrop-blur">
            <blockquote className="text-xl italic leading-relaxed text-gray-100 md:text-2xl">
              &ldquo;This is our promise to you: We will never compromise on
              these principles. ToolsLab will always be a sanctuary for
              developers who value privacy, performance, and
              transparency.&rdquo;
            </blockquote>

            <div className="absolute -left-6 -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
              <Quote className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Join the Movement
            </h3>
            <p className="mx-auto mb-12 max-w-3xl text-xl text-gray-300">
              Help us build the tools that the web deserves. Together, we can
              create a better digital future.
            </p>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/tools/json-formatter"
                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl"
              >
                <Rocket className="h-6 w-6 group-hover:animate-pulse" />
                Start Using Our Tools
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="https://bitbucket.org/toolslab/toolslab"
                className="group flex items-center gap-3 rounded-2xl border-2 border-white/30 bg-transparent px-10 py-5 font-semibold text-white transition-all hover:scale-105 hover:border-white/50"
              >
                <Github className="h-6 w-6" />
                Join the Movement
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-20 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-12 dark:border-blue-800 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 transform">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Heart className="h-8 w-8 animate-pulse text-white" />
              </div>
            </div>

            <h3 className="mb-6 mt-8 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Built with Love, Powered by Principle
            </h3>

            <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Every line of code, every design decision, every feature is guided
              by these principles. This isn&apos;t just software—it&apos;s our
              commitment to a better, more private, more human web.
            </p>

            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <Coffee className="h-5 w-5" />
              <span>Made with ❤️ by developers who care</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
