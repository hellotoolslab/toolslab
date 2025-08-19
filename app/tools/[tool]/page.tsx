import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolPageClient from '@/components/tools/ToolPageClient'
import { tools } from '@/data/tools'

interface ToolPageProps {
  params: {
    tool: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = tools.find(t => t.slug === params.tool)
  
  if (!tool) {
    return {
      title: 'Tool Not Found - OctoTools',
    }
  }

  return {
    title: `${tool.name} - Free Online Tool | OctoTools`,
    description: tool.description,
    keywords: `${tool.name}, ${tool.category}, online tool, free tool, web utility`,
    openGraph: {
      title: `${tool.name} - OctoTools`,
      description: tool.description,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    tool: tool.slug,
  }))
}

export default function ToolPage({ params, searchParams }: ToolPageProps) {
  const tool = tools.find(t => t.slug === params.tool)

  if (!tool) {
    notFound()
  }

  return <ToolPageClient toolSlug={params.tool} searchParams={searchParams} />
}