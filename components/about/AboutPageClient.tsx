'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  Users, 
  Code, 
  Heart,
  Star,
  GitBranch,
  Smartphone,
  Monitor,
  Palette,
  Settings,
  CheckCircle,
  ArrowRight,
  Github,
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
  Cpu
} from 'lucide-react'
import { tools } from '@/data/tools'

const stats = [
  { label: 'Developer Tools', value: '35+', icon: Code },
  { label: 'Users Worldwide', value: '10K+', icon: Users },
  { label: 'Tools Used Daily', value: '50K+', icon: Zap },
  { label: 'Countries', value: '150+', icon: Globe },
]

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data never leaves your browser. All processing happens locally.',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with modern web technologies and caching.',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
  },
  {
    icon: Monitor,
    title: 'Works Offline',
    description: 'Once loaded, tools work without internet connection.',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Responsive design that works perfectly on all devices.',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  {
    icon: Palette,
    title: 'Dark Mode',
    description: 'Beautiful light and dark themes for comfortable coding.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
  },
  {
    icon: Code,
    title: 'Open Source',
    description: 'Transparent codebase you can inspect, fork, and contribute to.',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20'
  }
]

const team = [
  {
    name: 'Development Team',
    role: 'Building the Future',
    description: 'Passionate developers creating tools that make your life easier.',
    icon: Code,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'Community',
    role: 'Growing Together',
    description: 'Developers worldwide using and improving OctoTools every day.',
    icon: Users,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'Contributors',
    role: 'Open Source Heroes',
    description: 'Amazing people contributing code, ideas, and feedback.',
    icon: Heart,
    color: 'text-red-600 dark:text-red-400'
  }
]

const timeline = [
  {
    year: '2024',
    title: 'OctoTools Launched',
    description: 'Started with essential developer tools focused on privacy and speed.',
    icon: Rocket,
    color: 'text-blue-600'
  },
  {
    year: '2024',
    title: 'Community Growth',
    description: 'Reached 10,000+ developers using our tools worldwide.',
    icon: Users,
    color: 'text-green-600'
  },
  {
    year: 'Future',
    title: 'More Tools Coming',
    description: 'Expanding our toolkit based on community feedback and needs.',
    icon: Sparkles,
    color: 'text-purple-600'
  }
]

export default function AboutPageClient() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-10 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="text-8xl lg:text-9xl animate-bounce">🐙</div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">OctoTools</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Essential developer tools that work <span className="font-semibold text-green-600 dark:text-green-400">offline</span> and 
              respect your <span className="font-semibold text-blue-600 dark:text-blue-400">privacy</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/tools/json-formatter"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Code className="w-5 h-5" />
                Try Our Tools
              </Link>
              <Link
                href="https://github.com/octotools"
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-medium rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Github className="w-5 h-5" />
                View Source
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium mb-6">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Building Tools That <span className="text-blue-600 dark:text-blue-400">Developers Love</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                OctoTools was born from a simple belief: developer tools should be fast, reliable, and respect your privacy. 
                In a world where your data is constantly harvested, we took a different approach—everything happens in your browser, 
                nothing leaves your device.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Zero data collection</strong> - Your information stays with you
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Blazing fast</strong> - Optimized for performance and speed
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Always available</strong> - Works offline once loaded
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-10" />
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your data never leaves your browser</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Optimized for maximum performance</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Open Source</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transparent and community-driven</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Made with Love</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Crafted by developers for developers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Why Choose OctoTools
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Features That Make Us <span className="text-purple-600 dark:text-purple-400">Different</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Every feature is designed with your privacy, security, and productivity in mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium mb-6">
              <Clock className="w-4 h-4 mr-2" />
              Our Journey
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Building the Future, <span className="text-green-600 dark:text-green-400">Step by Step</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={item.year} className="relative flex items-start">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                    index === 0 ? 'bg-blue-100 dark:bg-blue-900/30' :
                    index === 1 ? 'bg-green-100 dark:bg-green-900/30' : 
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    <item.icon className={`w-8 h-8 ${item.color} dark:${item.color.replace('600', '400')}`} />
                  </div>
                  
                  <div className="ml-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        index === 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        index === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              The Community
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Built by <span className="text-pink-600 dark:text-pink-400">Developers</span>, for Developers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              OctoTools is powered by an amazing community of developers who believe in privacy-first tools
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {team.map((member, index) => (
              <div key={member.name} className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                <div className={`inline-flex p-6 rounded-full bg-gradient-to-br ${
                  index === 0 ? 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30' :
                  index === 1 ? 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30' :
                  'from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30'
                } mb-6`}>
                  <member.icon className={`w-12 h-12 ${member.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
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
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 shadow-2xl">
              <Coffee className="w-16 h-16 text-brown-600 dark:text-brown-400 mx-auto mb-6" />
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Want to Contribute?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                We welcome contributions, feedback, and ideas from the community. 
                Help us build the future of developer tools!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="https://github.com/octotools"
                  className="px-8 py-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-medium rounded-xl transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  Contribute on GitHub
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  href="mailto:hello@octotools.dev"
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-medium rounded-xl transition-all hover:scale-105 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Preview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Popular Tools
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Try Our Most <span className="text-orange-600 dark:text-orange-400">Popular</span> Tools
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.filter(tool => tool.popular).slice(0, 6).map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <tool.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Code className="w-5 h-5 mr-2" />
              Explore All Tools
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}