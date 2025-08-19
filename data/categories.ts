export const categoryColors: Record<string, string> = {
  text: '#3B82F6',        // Blue
  converters: '#10B981',  // Emerald
  generators: '#8B5CF6',  // Violet
  security: '#EF4444',    // Red
  formatters: '#F59E0B',  // Amber
  minifiers: '#EC4899',   // Pink
  css: '#06B6D4',        // Cyan
  image: '#84CC16',      // Lime
  default: '#6B7280'      // Gray
}

export const categories = [
  { id: 'text', name: 'Text Tools', color: categoryColors.text },
  { id: 'converters', name: 'Converters', color: categoryColors.converters },
  { id: 'generators', name: 'Generators', color: categoryColors.generators },
  { id: 'security', name: 'Security', color: categoryColors.security },
  { id: 'formatters', name: 'Formatters', color: categoryColors.formatters },
  { id: 'minifiers', name: 'Minifiers', color: categoryColors.minifiers },
  { id: 'css', name: 'CSS Tools', color: categoryColors.css },
  { id: 'image', name: 'Image Tools', color: categoryColors.image }
]