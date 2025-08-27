/**
 * Centralized icon system for optimized tree-shaking
 * Only imports used icons from lucide-react
 */

// Import only the icons we actually use
export {
  // Navigation & UI
  Search,
  X,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Home,
  Menu,

  // Actions & Tools
  Copy,
  Check,
  Download,
  Upload,
  RefreshCw,
  Share2,

  // Tool Icons
  Hash,
  Shield,
  Zap,
  Code,
  FileText,
  Settings,

  // Status & Feedback
  Info,
  HelpCircle,
  AlertCircle,
  CheckCircle,

  // Social & Branding
  Heart,
  Star,
  Sparkles,
  Coffee,

  // Data & Content
  Globe,
  Clock,
  Lock,
  Monitor,
  BookOpen,

  // Interactive Elements
  Plus,
  Minus,
  Eye,
  EyeOff,

  // Tool-specific icons
  Lightbulb,
  MessageCircle,
  Rocket,

  // Type definition
  type LucideIcon,
} from 'lucide-react';

// Define commonly used icon sets for different contexts
export const commonIcons = {
  copy: ['Copy', 'Check'] as const,
  actions: ['Download', 'Upload', 'RefreshCw', 'Share2'] as const,
  navigation: [
    'ArrowRight',
    'ArrowLeft',
    'ChevronRight',
    'ChevronDown',
  ] as const,
  status: ['Check', 'X', 'AlertCircle', 'CheckCircle', 'Info'] as const,
} as const;

// Helper type for icon name validation
export type IconName =
  | 'Search'
  | 'X'
  | 'ChevronRight'
  | 'ChevronDown'
  | 'ArrowRight'
  | 'ArrowLeft'
  | 'Home'
  | 'Menu'
  | 'Copy'
  | 'Check'
  | 'Download'
  | 'Upload'
  | 'RefreshCw'
  | 'Share2'
  | 'Hash'
  | 'Shield'
  | 'Zap'
  | 'Code'
  | 'FileText'
  | 'Settings'
  | 'Info'
  | 'HelpCircle'
  | 'AlertCircle'
  | 'CheckCircle'
  | 'Heart'
  | 'Star'
  | 'Sparkles'
  | 'Coffee'
  | 'Globe'
  | 'Clock'
  | 'Lock'
  | 'Monitor'
  | 'BookOpen'
  | 'Plus'
  | 'Minus'
  | 'Eye'
  | 'EyeOff'
  | 'Lightbulb'
  | 'MessageCircle'
  | 'Rocket';
