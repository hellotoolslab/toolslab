import { LucideIcon } from 'lucide-react'

export interface Tool {
  id: string
  slug: string
  name: string
  description: string
  category: string
  icon: LucideIcon
  featured?: boolean
  popular?: boolean
  new?: boolean
}