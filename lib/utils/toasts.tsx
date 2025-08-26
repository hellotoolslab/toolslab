import toast from 'react-hot-toast';

// Toast personalizzate per ToolsLab
export const labToasts = {
  addToLab: (name?: string) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-lg">🧪</span>
          <div>
            <div className="font-medium">Added to your Lab!</div>
            {name && <div className="text-sm opacity-80">{name}</div>}
          </div>
        </div>
      ),
      {
        id: 'add-to-lab',
        duration: 2500,
        style: {
          background: '#059669',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      }
    );
  },

  removeFromLab: (name?: string) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-lg">🗑️</span>
          <div>
            <div className="font-medium">Removed from Lab</div>
            {name && <div className="text-sm opacity-80">{name}</div>}
          </div>
        </div>
      ),
      {
        id: 'remove-from-lab',
        duration: 2500,
        style: {
          background: '#DC2626',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      }
    );
  },

  welcomeToLab: () => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧪</span>
          <div>
            <div className="font-medium">Welcome to Your Lab!</div>
            <div className="text-sm opacity-80">
              Start experimenting with your favorite tools
            </div>
          </div>
        </div>
      ),
      {
        id: 'welcome-lab',
        duration: 4000,
        style: {
          background: '#7C3AED',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      }
    );
  },

  labLimitReached: (type: 'tools' | 'categories', limit: number) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <div className="font-medium">Lab Limit Reached</div>
            <div className="text-sm opacity-80">
              Maximum {limit} {type} allowed in your Lab
            </div>
          </div>
        </div>
      ),
      {
        id: 'lab-limit',
        duration: 3000,
        style: {
          background: '#F59E0B',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      }
    );
  },

  error: (message: string) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-lg">❌</span>
          <div>
            <div className="font-medium">Error</div>
            <div className="text-sm opacity-80">{message}</div>
          </div>
        </div>
      ),
      {
        id: 'lab-error',
        duration: 4000,
        style: {
          background: '#DC2626',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      }
    );
  },

  info: (message: string, subtitle?: string) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-lg">💡</span>
          <div>
            <div className="font-medium">{message}</div>
            {subtitle && <div className="text-sm opacity-80">{subtitle}</div>}
          </div>
        </div>
      ),
      {
        id: 'lab-info',
        duration: 3000,
        style: {
          background: '#3B82F6',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      }
    );
  },
};
