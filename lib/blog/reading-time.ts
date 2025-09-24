export function calculateReadingTime(text: string): string {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;

  // Remove HTML tags if present
  const plainText = text.replace(/<[^>]*>/g, '');

  // Count words
  const words = plainText.trim().split(/\s+/).length;

  // Calculate reading time
  const minutes = Math.ceil(words / wordsPerMinute);

  // Return formatted string
  return `${minutes} min read`;
}
