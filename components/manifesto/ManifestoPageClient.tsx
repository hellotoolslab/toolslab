'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
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
  ArrowRight
} from 'lucide-react'

const principles = [
  {
    title: 'Privacy by Design',
    text: 'Every tool is built with privacy as the foundation. No tracking, no data collection, no surveillance.',
    icon: Shield,
    gradient: 'from-green-400 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20'
  },
  {
    title: 'Offline First',
    text: 'Your tools should work anywhere, anytime. No internet? No problem. Everything works locally.',
    icon: WifiOff,
    gradient: 'from-blue-400 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20'
  },
  {
    title: 'Open & Transparent',
    text: 'Our code is open source. You can inspect, modify, and contribute to every line.',
    icon: Code,
    gradient: 'from-purple-400 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20'
  },
  {
    title: 'Performance Matters',
    text: 'Fast tools make happy developers. We optimize for speed and efficiency in everything we build.',
    icon: Zap,
    gradient: 'from-orange-400 to-red-600',
    bgGradient: 'from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20'
  }
]

const values = [
  {
    text: 'We value your privacy above profit',
    icon: Heart,
    color: 'text-red-600'
  },
  {
    text: 'We build for the long term, not for quick wins',
    icon: Mountain,
    color: 'text-blue-600'
  },
  {
    text: 'We believe in the power of open source',
    icon: Github,
    color: 'text-purple-600'
  },
  {
    text: 'We prioritize user experience over everything else',
    icon: Star,
    color: 'text-yellow-600'
  }
]

export default function ManifestoPageClient() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activePrinciple, setActivePrinciple] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    const interval = setInterval(() => {
      setActivePrinciple((prev) => (prev + 1) % principles.length)
    }, 4000)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const parallaxOffset = scrollY * 0.5

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          />
          <div 
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-600/20 via-orange-600/10 to-transparent rounded-full blur-3xl"
            style={{ transform: `translateY(${-parallaxOffset}px)` }}
          />
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 mb-8">
              <Scroll className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                The OctoTools Manifesto
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              The OctoTools
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Manifesto
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Our commitment to building a better web for developers
          </p>

          <div className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
            We believe in a different kind of web. A web where your privacy is respected, your data stays yours, and tools work for you, not against you.
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-blue-900/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 mb-8">
              <Crown className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                Our Principles
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Built on{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Unshakeable
              </span>
              {' '}Principles
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon
              return (
                <div
                  key={principle.title}
                  className={`group relative p-8 lg:p-12 rounded-3xl transition-all duration-500 cursor-pointer ${
                    activePrinciple === index 
                      ? 'scale-105 shadow-2xl' 
                      : 'hover:scale-102 shadow-xl hover:shadow-2xl'
                  } bg-gradient-to-br ${principle.bgGradient} border border-white/50 dark:border-gray-800/50`}
                  onMouseEnter={() => setActivePrinciple(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${principle.gradient} mb-8 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      {principle.title}
                    </h3>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {principle.text}
                    </p>
                  </div>

                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${principle.gradient} opacity-20 group-hover:opacity-40 transition-opacity`} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-black dark:to-gray-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 mb-8">
              <Star className="w-5 h-5 mr-3 text-yellow-400" />
              <span className="text-yellow-400 font-medium">
                Our Values
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
              Our Core{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div
                  key={value.text}
                  className="group relative p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 p-4 rounded-2xl bg-gray-800 border border-gray-600">
                      <IconComponent className={`w-8 h-8 ${value.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <Quote className="w-8 h-8 text-gray-500 mb-4" />
                      <p className="text-xl text-gray-200 leading-relaxed">
                        {value.text}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 mb-8">
            <Handshake className="w-5 h-5 mr-3 text-white" />
            <span className="text-white font-medium">
              Our Commitment
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12">
            Our Sacred{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Promise
            </span>
          </h2>

          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur border border-white/20 mb-16">
            <blockquote className="text-xl md:text-2xl text-gray-100 leading-relaxed italic">
              "This is our promise to you: We will never compromise on these principles. OctoTools will always be a sanctuary for developers who value privacy, performance, and transparency."
            </blockquote>
            
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join the Movement
            </h3>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Help us build the tools that the web deserves. Together, we can create a better digital future.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/tools/json-formatter"
                className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-3"
              >
                <Rocket className="w-6 h-6 group-hover:animate-pulse" />
                Start Using Our Tools
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="https://github.com/octotools"
                className="group px-10 py-5 bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-2xl transition-all hover:scale-105 flex items-center gap-3"
              >
                <Github className="w-6 h-6" />
                Join the Movement
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-6">
              Built with Love, Powered by Principle
            </h3>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Every line of code, every design decision, every feature is guided by these principles. 
              This isn't just software—it's our commitment to a better, more private, more human web.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <Coffee className="w-5 h-5" />
              <span>Made with ❤️ by developers who care</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}