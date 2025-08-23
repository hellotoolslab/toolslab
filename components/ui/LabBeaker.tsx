'use client';

interface LabBeakerProps {
  isAnimating?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-16',
  md: 'w-20 h-24',
  lg: 'w-28 h-32',
};

export const LabBeaker = ({
  isAnimating = true,
  className = '',
  size = 'md',
}: LabBeakerProps) => (
  <div className={`relative ${sizeClasses[size]} ${className}`}>
    {/* Beaker container */}
    <div className="absolute inset-0 overflow-hidden rounded-b-3xl border-2 border-gray-300 bg-gray-50/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900/50">
      {/* Liquid base */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-3xl bg-gradient-to-t from-emerald-500/30 to-purple-500/20" />

      {/* Animated bubbling liquid */}
      {isAnimating && (
        <>
          <div
            className="absolute bottom-0 left-0 right-0 animate-pulse rounded-b-3xl bg-gradient-to-t from-emerald-500/50 to-purple-500/30"
            style={{
              height: '40%',
              animationDuration: '2s',
            }}
          />

          {/* Floating bubbles */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform">
            <div
              className="h-1 w-1 animate-bounce rounded-full bg-white/60"
              style={{ animationDelay: '0s', animationDuration: '1.5s' }}
            />
          </div>
          <div className="absolute bottom-3 left-1/3 -translate-x-1/2 transform">
            <div
              className="h-0.5 w-0.5 animate-bounce rounded-full bg-white/40"
              style={{ animationDelay: '0.3s', animationDuration: '2s' }}
            />
          </div>
          <div className="absolute bottom-4 right-1/3 translate-x-1/2 transform">
            <div
              className="h-0.5 w-0.5 animate-bounce rounded-full bg-white/40"
              style={{ animationDelay: '0.6s', animationDuration: '1.8s' }}
            />
          </div>
        </>
      )}

      {/* Measurement lines */}
      <div className="absolute left-1 right-1 top-1/4">
        <div className="mb-2 h-px bg-gray-300/50 dark:bg-gray-600/50" />
        <div className="mb-2 h-px bg-gray-300/50 dark:bg-gray-600/50" />
        <div className="h-px bg-gray-300/50 dark:bg-gray-600/50" />
      </div>
    </div>

    {/* Beaker spout */}
    <div className="absolute -top-1 left-0 h-2 w-3 rounded-tl-lg border-l-2 border-t-2 border-gray-300 bg-gray-50/50 dark:border-gray-600 dark:bg-gray-900/50" />

    {/* Handle */}
    <div className="absolute right-0 top-1/3 h-6 w-2 rounded-r-lg border-2 border-l-0 border-gray-300 bg-transparent dark:border-gray-600" />
  </div>
);

export default LabBeaker;
