'use client';

import { Github, Zap, BarChart3, CloudCog, Globe } from 'lucide-react';
import { useUmami } from '@/components/analytics/OptimizedUmamiProvider';

interface PoweredByService {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

const poweredByServices: PoweredByService[] = [
  {
    name: 'GitHub',
    description: 'Code Repository',
    icon: <Github className="h-8 w-8" />,
    url: 'https://github.com',
    color: '#181717',
  },
  {
    name: 'Vercel',
    description: 'Hosting & Deploy',
    icon: <Zap className="h-8 w-8" />,
    url: 'https://vercel.com',
    color: '#000000',
  },
  {
    name: 'Umami',
    description: 'Privacy Analytics',
    icon: <BarChart3 className="h-8 w-8" />,
    url: 'https://umami.is',
    color: '#FF6B35',
  },
  {
    name: 'Cloudflare',
    description: 'CDN & Security',
    icon: <CloudCog className="h-8 w-8" />,
    url: 'https://cloudflare.com',
    color: '#F38020',
  },
  {
    name: 'Porkbun',
    description: 'Domain Registry',
    icon: <Globe className="h-8 w-8" />,
    url: 'https://porkbun.com',
    color: '#FF6B9D',
  },
];

interface PoweredByCardProps {
  service: PoweredByService;
  index: number;
}

function PoweredByCard({ service, index }: PoweredByCardProps) {
  const { trackSocial } = useUmami();

  const handleClick = () => {
    trackSocial(service.name.toLowerCase(), 'powered-by-section');
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
            {service.name}
          </div>
          <div className="text-xs text-gray-600 transition-colors duration-300 group-hover:text-gray-700 dark:text-slate-400 dark:group-hover:text-slate-300">
            {service.description}
          </div>
        </div>
      </div>
    </a>
  );
}

export function PoweredBy() {
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
            Powered By
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Built with industry-leading tools and services
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {poweredByServices.map((service, index) => (
            <PoweredByCard key={service.name} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
