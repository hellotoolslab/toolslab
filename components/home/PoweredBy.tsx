'use client';

import { Github, Zap, BarChart3, CloudCog, Globe } from 'lucide-react';
import { trackSocial } from '@/lib/analytics';
import { useDictionarySectionContext } from '@/components/providers/DictionaryProvider';

interface PoweredByServiceConfig {
  id: 'github' | 'vercel' | 'umami' | 'cloudflare' | 'porkbun';
  icon: React.ReactNode;
  url: string;
  color: string;
}

const servicesConfig: PoweredByServiceConfig[] = [
  {
    id: 'github',
    icon: <Github className="h-8 w-8" />,
    url: 'https://github.com',
    color: '#181717',
  },
  {
    id: 'vercel',
    icon: <Zap className="h-8 w-8" />,
    url: 'https://vercel.com',
    color: '#000000',
  },
  {
    id: 'umami',
    icon: <BarChart3 className="h-8 w-8" />,
    url: 'https://umami.is',
    color: '#FF6B35',
  },
  {
    id: 'cloudflare',
    icon: <CloudCog className="h-8 w-8" />,
    url: 'https://cloudflare.com',
    color: '#F38020',
  },
  {
    id: 'porkbun',
    icon: <Globe className="h-8 w-8" />,
    url: 'https://porkbun.com',
    color: '#FF6B9D',
  },
];

interface PoweredByCardProps {
  service: PoweredByServiceConfig;
  name: string;
  description: string;
  index: number;
}

function PoweredByCard({
  service,
  name,
  description,
  index,
}: PoweredByCardProps) {
  const handleClick = () => {
    trackSocial(service.id, 'powered-by-section');
  };

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-slate-700/70 dark:hover:bg-slate-900/70"
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
        style={{
          background: `linear-gradient(135deg, ${service.color}20, transparent)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div
          className="text-gray-500 transition-all duration-300 group-hover:scale-110 dark:text-slate-500"
          style={{
            color: undefined,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = service.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
          }}
        >
          {service.icon}
        </div>

        <div className="text-center">
          <div className="mb-1 font-semibold text-gray-900 transition-colors duration-300 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-300">
            {name}
          </div>
          <div className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700 dark:text-slate-400 dark:group-hover:text-slate-300">
            {description}
          </div>
        </div>
      </div>
    </a>
  );
}

export function PoweredBy() {
  const { data: t } = useDictionarySectionContext('home');
  const poweredBy = t?.poweredBy;

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Gradient divider line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className="container relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {poweredBy?.title || 'Powered By'}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {poweredBy?.subtitle ||
              'Built with industry-leading tools and services'}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {servicesConfig.map((service, index) => {
            const serviceData =
              poweredBy?.[service.id as keyof typeof poweredBy];
            const isObject =
              typeof serviceData === 'object' && serviceData !== null;
            return (
              <PoweredByCard
                key={service.id}
                service={service}
                name={isObject ? serviceData.name : service.id}
                description={isObject ? serviceData.description : ''}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
