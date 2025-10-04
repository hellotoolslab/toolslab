'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Code2,
  Zap,
  Shield,
  Users,
  Heart,
  Lightbulb,
  Rocket,
  Star,
  Globe,
  Lock,
  MousePointer,
  Smartphone,
  Moon,
  ArrowRight,
  Coffee,
  Github,
  Twitter,
  MessageCircle,
  GitBranch,
  Sparkles,
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { TypewriterText } from './TypewriterText';
import { AnimatedStatsCard } from './AnimatedStatsCard';
import { VisualTimeline } from './VisualTimeline';
import { FeatureCard } from './FeatureCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface NewAboutPageProps {
  locale?: string;
  dictionary?: any;
}

// Default English timeline steps icons
const timelineIcons = [Lightbulb, Code2, Rocket, Users, Globe, Star];

// Default English feature icons and gradients
const featureConfig = [
  { icon: Zap, gradient: 'from-yellow-500 to-orange-600' },
  { icon: Shield, gradient: 'from-green-500 to-emerald-600' },
  { icon: Heart, gradient: 'from-red-500 to-pink-600' },
  { icon: MousePointer, gradient: 'from-blue-500 to-cyan-600' },
  { icon: Moon, gradient: 'from-purple-500 to-indigo-600' },
  { icon: Smartphone, gradient: 'from-teal-500 to-green-600' },
];

// Social links configuration
const socialLinksConfig = [
  {
    icon: Twitter,
    href: 'https://x.com/tools_lab',
    gradient: 'from-blue-400 to-blue-600',
    hoverColor: 'hover:bg-blue-500',
  },
  {
    icon: Github,
    href: 'https://github.com/hellotoolslab/toolslab',
    gradient: 'from-gray-600 to-gray-800',
    hoverColor: 'hover:bg-gray-700',
  },
  {
    icon: Coffee,
    href: 'https://buymeacoffee.com/toolslab',
    gradient: 'from-yellow-500 to-orange-600',
    hoverColor: 'hover:bg-orange-500',
  },
];

export function NewAboutPage({ locale, dictionary }: NewAboutPageProps) {
  // Get translations with English fallbacks
  const t = dictionary?.about || {};
  const hero = t.hero || {};
  const stats = t.stats || {};
  const timeline = t.timeline || {};
  const features = t.features || {};
  const story = t.story || {};
  const social = t.social || {};
  const cta = t.cta || {};

  // Build timeline steps from translations
  const timelineSteps = (timeline.steps || []).map(
    (step: any, index: number) => ({
      icon: timelineIcons[index] || Lightbulb,
      title: step.title,
      year: step.year,
      description: step.description,
    })
  );

  // Build features from translations
  const featuresData = (features.items || []).map(
    (item: any, index: number) => ({
      icon: featureConfig[index]?.icon || Zap,
      title: item.title,
      description: item.description,
      gradient: featureConfig[index]?.gradient || 'from-blue-500 to-cyan-600',
    })
  );

  // Build social links from translations
  const socialLinks = (social.links || []).map((link: any, index: number) => ({
    ...socialLinksConfig[index],
    label: link.label,
    description: link.description,
  }));
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <AnimatedBackground />

        <motion.div
          className="relative z-10 mx-auto max-w-6xl px-4 text-center"
          style={{ opacity, scale }}
        >
          {/* Floating logo */}
          <motion.div
            className="mb-8 flex justify-center"
            animate={{
              y: [-10, 10, -10],
              rotateY: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative">
              <motion.div
                className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white shadow-2xl md:h-32 md:w-32"
                whileHover={{
                  scale: 1.1,
                  rotateY: 180,
                }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Code2 className="h-12 w-12 md:h-16 md:w-16" />
              </motion.div>

              {/* Glow effect */}
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 opacity-30 blur-xl" />
            </div>
          </motion.div>

          {/* Main title with gradient */}
          <motion.h1
            className="mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-6xl font-bold text-transparent md:text-8xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {hero.title || 'About ToolsLab'}
          </motion.h1>

          {/* Typewriter subtitle */}
          <div className="mb-8 h-8 text-xl text-gray-300 md:text-2xl">
            <TypewriterText
              text={hero.subtitle || 'Your Developer Toolbox, Reimagined'}
              delay={1500}
              className="font-light"
            />
          </div>

          {/* Animated badges */}
          <motion.div
            className="mb-12 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, staggerChildren: 0.1 }}
          >
            {[
              hero.badges?.free || '100% Free',
              hero.badges?.privacy || 'Privacy First',
              hero.badges?.noRegistration || 'No Registration',
            ].map((text, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 3 + index * 0.2 }}
              >
                <Badge
                  variant="outline"
                  className="border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                >
                  <Heart className="mr-1 h-3 w-3" />
                  {text}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 transform"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center text-white/60">
            <span className="mb-2 text-sm">
              {hero.scrollIndicator || 'Scroll to explore'}
            </span>
            <ArrowRight className="h-4 w-4 rotate-90" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              {stats.title || 'Trusted by Developers'}
            </h2>
            <p className="text-xl text-gray-300">
              {stats.subtitle || 'Numbers that tell our story'}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            <AnimatedStatsCard
              icon={Code2}
              value={stats.tools?.value || '25+'}
              label={stats.tools?.label || 'Developer Tools'}
              description={stats.tools?.description || 'And growing daily'}
              delay={0}
              isNumber={true}
            />
            <AnimatedStatsCard
              icon={Users}
              value={stats.users?.value || '1000+'}
              label={stats.users?.label || 'Daily Users'}
              description={stats.users?.description || 'Worldwide developers'}
              delay={0.1}
              isNumber={true}
            />
            <AnimatedStatsCard
              icon={Zap}
              value={stats.loadTime?.value || '<1s'}
              label={stats.loadTime?.label || 'Load Time'}
              description={stats.loadTime?.description || 'Lightning fast'}
              delay={0.2}
            />
            <AnimatedStatsCard
              icon={Shield}
              value={stats.dataCollected?.value || '0'}
              label={stats.dataCollected?.label || 'Data Collected'}
              description={
                stats.dataCollected?.description || 'Complete privacy'
              }
              delay={0.3}
              isNumber={true}
            />
          </div>
        </div>
      </section>

      {/* Timeline Story Section */}
      <section className="bg-gradient-to-b from-transparent via-purple-900/10 to-transparent py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              {timeline.title || 'The Journey'}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              {timeline.subtitle ||
                'From personal frustration to community resource'}
            </p>
          </motion.div>

          <VisualTimeline steps={timelineSteps} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              {features.title || 'Why Choose ToolsLab?'}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              {features.subtitle ||
                'Built with developers in mind, optimized for your workflow'}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Developer Story Section */}
      <section className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-indigo-900/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <motion.div
              className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-800/80 p-8 backdrop-blur-sm md:p-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background decoration */}
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-2xl" />

              <div className="relative z-10">
                {/* Developer avatar */}
                <motion.div
                  className="mb-8 flex justify-center"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg">
                    <Code2 className="h-10 w-10" />
                  </div>
                </motion.div>

                {/* Quote */}
                <blockquote className="text-center">
                  <motion.p
                    className="mb-8 text-lg italic leading-relaxed text-gray-300 md:text-xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    &ldquo;
                    {story.quote ||
                      "Hi, I'm the developer behind ToolsLab. Like you, I was tired of juggling dozens of browser tabs for simple conversions and generations. Every tool on a different site, most filled with ads, some behind paywalls.\n\nSo I built ToolsLab - my personal Swiss Army knife for development. What started as a local project quickly became invaluable to my team, and now I'm thrilled to share it with developers worldwide.\n\nNo catches, no upsells. Just tools that work, built by a developer who uses them every single day."}
                    &rdquo;
                  </motion.p>

                  <motion.footer
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="mb-2 text-lg font-semibold text-white">
                      {story.author || '— ToolsLab Creator'}
                    </div>
                    <div className="flex justify-center gap-2">
                      <Badge variant="secondary">
                        {story.badges?.developer || 'Full Stack Developer'}
                      </Badge>
                      <Badge variant="secondary">
                        {story.badges?.enthusiast || 'Open Source Enthusiast'}
                      </Badge>
                    </div>
                  </motion.footer>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              {social.title || 'Connect & Support'}
            </h2>
            <p className="text-xl text-gray-300">
              {social.subtitle ||
                'Join the community, contribute, or show your appreciation'}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  className="relative h-full rounded-2xl border border-white/20 bg-slate-800/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/30"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  {/* Icon with brand gradient */}
                  <motion.div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${link.gradient} text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <link.icon className="h-8 w-8" />
                  </motion.div>

                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {link.label}
                  </h3>

                  <p className="mb-6 text-sm text-gray-300">
                    {link.description}
                  </p>

                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-transparent px-4 py-2 font-medium text-white transition-all duration-300 ${link.hoverColor} hover:text-white`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 py-20">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSI3IiBjeT0iNyIgcj0iMiIvPjxjaXJjbGUgY3g9IjM3IiBjeT0iMzciIHI9IjIiLz48Y2lyY2xlIGN4PSI3IiBjeT0iMzciIHI9IjIiLz48Y2lyY2xlIGN4PSIzNyIgY3k9IjciIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="mx-auto h-12 w-12 text-white" />
            </motion.div>

            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              {cta.title || 'Ready to Boost Your Productivity?'}
            </h2>

            <p className="mb-8 text-xl text-purple-100">
              {cta.subtitle ||
                "Join thousands of developers who've made ToolsLab their go-to toolkit. No registration, no costs, just pure productivity."}
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={locale === 'it' ? '/it/tools' : '/tools'}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-8 font-medium text-purple-600 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl"
              >
                <Rocket className="h-5 w-5" />
                {cta.buttons?.exploreTools || 'Explore Tools'}
              </a>

              <a
                href="https://buymeacoffee.com/toolslab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white px-8 font-medium text-white transition-all duration-300 hover:bg-white hover:text-purple-600"
              >
                <Coffee className="h-5 w-5" />
                {cta.buttons?.support || 'Support the Project'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
