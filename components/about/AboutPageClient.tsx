'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Shield,
  Zap,
  Globe,
  Lock,
  Users,
  Code,
  Heart,
  Star,
  Github,
  Smartphone,
  Monitor,
  Palette,
  Settings,
  CheckCircle,
  ArrowRight,
  Twitter,
  Mail,
  ExternalLink,
  Sparkles,
  Target,
  Eye,
  Coffee,
  Rocket,
  Award,
  Lightbulb,
  Download,
  Clock,
  Cpu,
  Beaker,
  Microscope,
  TestTube,
} from 'lucide-react';
import { tools } from '@/data/tools';
import { LabLogo } from '@/components/icons/LabLogo';

const stats = [
  { label: 'Laboratory Tools', value: '35+', icon: Beaker },
  { label: 'Researchers Worldwide', value: '10K+', icon: Users },
  { label: 'Experiments Daily', value: '50K+', icon: TestTube },
  { label: 'Countries', value: '150+', icon: Globe },
];

const features = [
  {
    icon: Beaker,
    title: 'Lab-Grade Privacy',
    description:
      'Your data stays in your secure laboratory environment. All experiments run locally.',
    color: 'text-lab-primary dark:text-lab-primary',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description:
      'Optimized algorithms deliver results faster than any laboratory equipment.',
    color: 'text-lab-accent dark:text-lab-accent',
    bgColor: 'bg-amber-100 dark:bg-amber-900/20',
  },
  {
    icon: TestTube,
    title: 'Portable Lab',
    description:
      'Your complete laboratory works anywhere, even without internet connection.',
    color: 'text-lab-secondary dark:text-lab-secondary',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Responsive design that works perfectly on all devices.',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    icon: Palette,
    title: 'Dark Mode',
    description: 'Beautiful light and dark themes for comfortable coding.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
  },
  {
    icon: Microscope,
    title: 'Open Research',
    description:
      'Transparent methodology you can inspect, replicate, and improve.',
    color: 'text-lab-danger dark:text-lab-danger',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
  },
];

const team = [
  {
    name: 'Research Team',
    role: 'Innovating Solutions',
    description:
      'Scientists and engineers crafting precision tools for developers.',
    icon: Microscope,
    color: 'text-lab-primary dark:text-lab-primary',
  },
  {
    name: 'Laboratory Community',
    role: 'Collaborative Research',
    description:
      'Researchers worldwide using and improving ToolsLab every day.',
    icon: Users,
    color: 'text-lab-secondary dark:text-lab-secondary',
  },
  {
    name: 'Fellow Scientists',
    role: 'Open Research',
    description:
      'Brilliant minds contributing experiments, discoveries, and insights.',
    icon: Beaker,
    color: 'text-lab-accent dark:text-lab-accent',
  },
];

const timeline = [
  {
    year: '2025',
    title: 'ToolsLab Founded',
    description:
      'Established our digital laboratory with essential tools for precise development.',
    icon: Rocket,
    color: 'text-lab-primary',
  },
  {
    year: '2025',
    title: 'Community Growth',
    description:
      'Scientists and developers worldwide began using our laboratory.',
    icon: Users,
    color: 'text-green-600',
  },
  {
    year: 'Future',
    title: 'New Experiments',
    description:
      'Expanding our laboratory equipment based on researcher feedback and discoveries.',
    icon: Sparkles,
    color: 'text-purple-600',
  },
];

export default function AboutPageClient() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-pink-400 to-red-600 opacity-10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <LabLogo
                  className="h-24 w-24 text-lab-primary lg:h-32 lg:w-32"
                  animated
                />
                <div className="absolute -right-2 -top-2 flex h-8 w-8 animate-pulse-glow items-center justify-center rounded-full bg-lab-success">
                  <Beaker className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white lg:text-6xl">
              About{' '}
              <span className="bg-gradient-to-r from-lab-primary to-lab-secondary bg-clip-text text-transparent">
                ToolsLab
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300 lg:text-2xl">
              Your developer tools{' '}
              <span className="font-semibold text-lab-primary dark:text-lab-primary">
                laboratory
              </span>{' '}
              - where precision meets{' '}
              <span className="font-semibold text-lab-secondary dark:text-lab-secondary">
                innovation
              </span>
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/categories"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl active:scale-95"
              >
                <Code className="h-5 w-5" />
                Try Our Tools
              </Link>
              <a
                href="https://github.com/hellotoolslab/toolslab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border-2 border-gray-300 px-8 py-4 font-medium text-gray-700 transition-all hover:scale-105 hover:border-gray-400 active:scale-95 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
              >
                <Github className="h-5 w-5" />
                View Source
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:from-gray-800 dark:to-gray-900"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-flex rounded-full bg-lab-primary/10 p-3 dark:bg-lab-primary/20">
                  <stat.icon className="h-6 w-6 text-lab-primary dark:text-lab-primary" />
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full bg-lab-primary/10 px-4 py-2 font-medium text-lab-primary dark:bg-lab-primary/20 dark:text-lab-primary">
                <Target className="mr-2 h-4 w-4" />
                Our Mission
              </div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                Crafting Tools in Our{' '}
                <span className="text-lab-primary dark:text-lab-primary">
                  Digital Laboratory
                </span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Welcome to ToolsLab - your experimental laboratory for developer
                tools. Each tool is carefully crafted and tested to deliver
                precise results with scientific accuracy. Mix and match tools to
                create powerful workflows, like a scientist combining elements
                for the perfect formula.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">
                      Zero data collection
                    </strong>{' '}
                    - Your information stays with you
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">
                      Blazing fast
                    </strong>{' '}
                    - Optimized for performance and speed
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">
                      Always available
                    </strong>{' '}
                    - Works offline once loaded
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-10" />
              <div className="relative rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
                      <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Privacy First
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your data never leaves your browser
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-lab-primary/10 dark:bg-lab-primary/20">
                      <Zap className="h-8 w-8 text-lab-primary dark:text-lab-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Lightning Fast
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Optimized for maximum performance
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                      <Code className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Open Source
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Transparent and community-driven
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/30">
                      <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Made with Love
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Crafted by developers for developers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-purple-100 px-4 py-2 font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Star className="mr-2 h-4 w-4" />
              Why Choose OctoTools
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              Laboratory-Grade{' '}
              <span className="text-lab-secondary dark:text-lab-secondary">
                Precision
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Every tool is engineered with scientific precision and tested for
              reliability
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group cursor-pointer rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800 ${
                  activeFeature === index
                    ? 'ring-2 ring-blue-500 ring-opacity-50'
                    : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`inline-flex rounded-2xl p-4 ${feature.bgColor} mb-6 transition-transform group-hover:scale-110`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-green-100 px-4 py-2 font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <Clock className="mr-2 h-4 w-4" />
              Our Journey
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              Building the Future,{' '}
              <span className="text-green-600 dark:text-green-400">
                Step by Step
              </span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-8 top-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={item.year} className="relative flex items-start">
                  <div
                    className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full shadow-lg ${
                      index === 0
                        ? 'bg-lab-primary/10 dark:bg-lab-primary/20'
                        : index === 1
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}
                  >
                    <item.icon
                      className={`h-8 w-8 ${item.color} dark:${item.color.replace('600', '400')}`}
                    />
                  </div>

                  <div className="ml-8 flex-1 rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          index === 0
                            ? 'bg-lab-primary/10 text-blue-700 dark:bg-lab-primary/20 dark:text-blue-300'
                            : index === 1
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}
                      >
                        {item.year}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-pink-100 px-4 py-2 font-medium text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
              <Users className="mr-2 h-4 w-4" />
              The Community
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              Built by{' '}
              <span className="text-lab-secondary dark:text-lab-secondary">
                Scientists
              </span>
              , for Developers
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              ToolsLab is powered by a community of researchers who believe in
              precision-engineered tools
            </p>
          </div>

          <div className="mb-16 grid gap-8 lg:grid-cols-3">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="rounded-2xl bg-white p-8 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800"
              >
                <div
                  className={`inline-flex rounded-full bg-gradient-to-br p-6 ${
                    index === 0
                      ? 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30'
                      : index === 1
                        ? 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30'
                        : 'from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30'
                  } mb-6`}
                >
                  <member.icon className={`h-12 w-12 ${member.color}`} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="mb-3 text-lg text-gray-600 dark:text-gray-400">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800 lg:p-12">
              <Coffee className="mx-auto mb-6 h-16 w-16 text-amber-600 dark:text-amber-400" />
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
                Support Our Research?
              </h3>
              <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                ToolsLab is a free research laboratory that requires resources
                to keep the equipment running. If our tools accelerate your
                daily experiments, consider supporting the research.
              </p>
              <p className="mx-auto mb-8 max-w-xl text-base text-gray-500 dark:text-gray-400">
                Your support helps us:
              </p>
              <div className="mx-auto mb-8 grid max-w-3xl gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Keep the servers running
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Develop new tools
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Improve user experience
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="https://buymeacoffee.com/toolslab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-8 py-4 font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-amber-700 hover:shadow-xl"
                >
                  <Coffee className="h-5 w-5" />
                  Buy Me a Coffee
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/hellotoolslab/toolslab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border-2 border-gray-300 px-8 py-4 font-medium text-gray-700 transition-all hover:scale-105 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
                >
                  <Github className="h-5 w-5" />
                  View Source Code
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Preview */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-orange-100 px-4 py-2 font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              <Award className="mr-2 h-4 w-4" />
              Popular Tools
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              Try Our Most{' '}
              <span className="text-orange-600 dark:text-orange-400">
                Popular
              </span>{' '}
              Tools
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools
              .filter((tool) => tool.popular)
              .slice(0, 6)
              .map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-xl bg-lab-primary/10 p-3 transition-transform group-hover:scale-110 dark:bg-lab-primary/20">
                      <tool.icon className="h-6 w-6 text-lab-primary dark:text-lab-primary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-lab-primary dark:group-hover:text-lab-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-lab-primary dark:text-white dark:group-hover:text-lab-primary">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tool.description}
                  </p>
                </Link>
              ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-medium text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              <Code className="mr-2 h-5 w-5" />
              Explore All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
