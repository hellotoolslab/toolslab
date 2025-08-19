import { Metadata } from 'next'
import AboutPageClient from '@/components/about/AboutPageClient'

export const metadata: Metadata = {
  title: 'About OctoTools - Privacy-First Developer Tools',
  description: 'Discover OctoTools\' mission to provide fast, secure, and privacy-first developer tools. Learn about our commitment to keeping your data safe and our open-source approach.',
  keywords: 'about octotools, privacy-first tools, developer tools, open source, offline tools',
  openGraph: {
    title: 'About OctoTools - Privacy-First Developer Tools',
    description: 'Discover OctoTools\' mission to provide fast, secure, and privacy-first developer tools.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}