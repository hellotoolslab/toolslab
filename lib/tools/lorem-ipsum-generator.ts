/**
 * Lorem Ipsum Generator - Generate placeholder text
 * Supports words, sentences, and paragraphs with various formats
 */

export type GenerationType = 'words' | 'sentences' | 'paragraphs';
export type OutputFormat = 'plain' | 'html' | 'markdown';
export type TextVariant = 'classic' | 'cicero' | 'hipster' | 'office' | 'tech';

export interface LoremIpsumOptions {
  type: GenerationType;
  count: number;
  format: OutputFormat;
  variant: TextVariant;
  startWithLoremIpsum: boolean;
}

export interface LoremIpsumResult {
  text: string;
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  sentenceCount: number;
}

// Classic Lorem Ipsum text corpus
const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'at',
  'vero',
  'eos',
  'accusamus',
  'iusto',
  'odio',
  'dignissimos',
  'ducimus',
  'blanditiis',
  'praesentium',
  'voluptatum',
  'deleniti',
  'atque',
  'corrupti',
  'quos',
  'dolores',
  'quas',
  'molestias',
  'excepturi',
  'obcaecati',
  'cupiditate',
  'provident',
  'similique',
  'neque',
  'impedit',
  'quo',
  'minus',
  'quod',
  'maxime',
  'placeat',
  'facere',
  'possimus',
  'omnis',
  'assumenda',
  'repellendus',
  'temporibus',
  'autem',
  'quibusdam',
  'officiis',
  'debitis',
  'aut',
  'rerum',
  'necessitatibus',
  'saepe',
  'eveniet',
  'voluptates',
  'repudiandae',
  'recusandae',
  'itaque',
  'earum',
  'hic',
  'tenetur',
  'sapiente',
  'delectus',
  'reiciendis',
  'voluptatibus',
  'maiores',
  'alias',
  'perferendis',
  'doloribus',
  'asperiores',
  'repellat',
];

// Original Cicero text (De Finibus Bonorum et Malorum)
const CICERO_WORDS = [
  'sed',
  'ut',
  'perspiciatis',
  'unde',
  'omnis',
  'iste',
  'natus',
  'error',
  'sit',
  'voluptatem',
  'accusantium',
  'doloremque',
  'laudantium',
  'totam',
  'rem',
  'aperiam',
  'eaque',
  'ipsa',
  'quae',
  'ab',
  'illo',
  'inventore',
  'veritatis',
  'et',
  'quasi',
  'architecto',
  'beatae',
  'vitae',
  'dicta',
  'sunt',
  'explicabo',
  'nemo',
  'enim',
  'ipsam',
  'quia',
  'voluptas',
  'aspernatur',
  'odit',
  'fugit',
  'consequuntur',
  'magni',
  'dolores',
  'eos',
  'qui',
  'ratione',
  'sequi',
  'nesciunt',
  'neque',
  'porro',
  'quisquam',
  'est',
  'dolorem',
  'ipsum',
  'adipisci',
  'velit',
  'numquam',
  'eius',
  'modi',
  'tempora',
  'incidunt',
  'labore',
  'magnam',
  'aliquam',
  'quaerat',
  'minima',
  'nostrum',
  'exercitationem',
  'ullam',
  'corporis',
  'suscipit',
  'laboriosam',
  'aliquid',
  'commodi',
  'consequatur',
  'autem',
  'vel',
  'eum',
  'iure',
  'reprehenderit',
  'voluptate',
  'esse',
  'quam',
  'nihil',
  'molestiae',
  'illum',
  'fugiat',
  'quo',
  'nulla',
  'pariatur',
];

// Tech/Developer themed words
const TECH_WORDS = [
  'api',
  'cloud',
  'server',
  'data',
  'code',
  'deploy',
  'stack',
  'framework',
  'backend',
  'frontend',
  'database',
  'query',
  'cache',
  'async',
  'sync',
  'function',
  'component',
  'module',
  'package',
  'library',
  'runtime',
  'compile',
  'debug',
  'test',
  'build',
  'release',
  'version',
  'branch',
  'merge',
  'commit',
  'repository',
  'pipeline',
  'container',
  'docker',
  'kubernetes',
  'microservice',
  'endpoint',
  'webhook',
  'token',
  'auth',
  'session',
  'cookie',
  'header',
  'request',
  'response',
  'payload',
  'json',
  'xml',
  'rest',
  'graphql',
  'schema',
  'migration',
  'rollback',
  'backup',
  'restore',
  'monitor',
  'log',
  'metric',
  'alert',
  'scale',
  'load',
  'balance',
  'proxy',
  'gateway',
  'firewall',
  'ssl',
  'encryption',
  'hash',
  'algorithm',
  'optimize',
  'refactor',
  'iterate',
  'agile',
];

// Hipster themed words
const HIPSTER_WORDS = [
  'artisan',
  'authentic',
  'biodiesel',
  'brooklyn',
  'cardigan',
  'chambray',
  'chillwave',
  'craft',
  'crucifix',
  'diy',
  'dreamcatcher',
  'echo',
  'ethical',
  'farm',
  'fixie',
  'flannel',
  'forage',
  'gastropub',
  'gentrify',
  'gluten',
  'hashtag',
  'helvetica',
  'hella',
  'hoodie',
  'intelligentsia',
  'irony',
  'jean',
  'kale',
  'keytar',
  'kickstarter',
  'kinfolk',
  'knausgaard',
  'kombucha',
  'leggings',
  'letterpress',
  'listicle',
  'lomo',
  'lumbersexual',
  'marfa',
  'meditation',
  'meggings',
  'microdosing',
  'mixtape',
  'mumblecore',
  'mustache',
  'narwhal',
  'neutra',
  'normcore',
  'organic',
  'paleo',
  'pabst',
  'photo',
  'pinterest',
  'plaid',
  'polaroid',
  'portland',
  'post',
  'poutine',
  'pug',
  'quinoa',
  'raclette',
  'raw',
  'readymade',
  'retro',
  'ramps',
  'salvia',
  'schlitz',
  'selvage',
  'semiotics',
  'seitan',
  'shoreditch',
  'single',
  'skateboard',
  'slow',
  'small',
  'snackwave',
  'sriracha',
  'stumptown',
  'subway',
  'succulents',
  'sustainable',
  'synth',
  'tattooed',
  'thundercats',
  'toast',
  'tofu',
  'tote',
  'truffaut',
  'trust',
  'tumblr',
  'typewriter',
  'umami',
  'unicorn',
  'vape',
  'vegan',
  'vexillologist',
  'vice',
  'vinyl',
  'viral',
  'waistcoat',
  'wayfarers',
  'williamsburg',
  'wolf',
];

// Office/Business themed words
const OFFICE_WORDS = [
  'synergy',
  'leverage',
  'optimize',
  'streamline',
  'stakeholder',
  'deliverable',
  'bandwidth',
  'paradigm',
  'proactive',
  'scalable',
  'robust',
  'actionable',
  'ecosystem',
  'milestone',
  'roadmap',
  'alignment',
  'initiative',
  'strategy',
  'innovation',
  'disruption',
  'transformation',
  'engagement',
  'empowerment',
  'collaboration',
  'integration',
  'implementation',
  'optimization',
  'facilitation',
  'monetization',
  'diversification',
  'standardization',
  'prioritization',
  'benchmark',
  'metrics',
  'analytics',
  'dashboard',
  'pipeline',
  'funnel',
  'touchpoint',
  'visibility',
  'transparency',
  'accountability',
  'sustainability',
  'agility',
  'flexibility',
  'productivity',
  'efficiency',
  'effectiveness',
  'competency',
  'capability',
  'capacity',
  'resources',
  'assets',
  'liabilities',
  'revenue',
  'profit',
  'margin',
  'growth',
  'expansion',
  'acquisition',
  'merger',
  'vertical',
  'horizontal',
  'matrix',
  'hierarchy',
  'structure',
  'framework',
];

const WORD_LISTS: Record<TextVariant, string[]> = {
  classic: LOREM_WORDS,
  cicero: CICERO_WORDS,
  tech: TECH_WORDS,
  hipster: HIPSTER_WORDS,
  office: OFFICE_WORDS,
};

// Simple seeded random number generator (mulberry32)
function createRng(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a random word from the word list
 */
function getRandomWord(words: string[], rng: () => number): string {
  return words[Math.floor(rng() * words.length)];
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a sentence
 */
function generateSentence(
  words: string[],
  rng: () => number,
  minWords: number = 5,
  maxWords: number = 15
): string {
  const wordCount = Math.floor(rng() * (maxWords - minWords + 1)) + minWords;
  const sentenceWords: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    sentenceWords.push(getRandomWord(words, rng));
  }

  // Capitalize first word and add period
  sentenceWords[0] = capitalize(sentenceWords[0]);

  // Maybe add comma in the middle
  if (wordCount > 8 && rng() > 0.5) {
    const commaPos = Math.floor(wordCount / 2);
    sentenceWords[commaPos] = sentenceWords[commaPos] + ',';
  }

  return sentenceWords.join(' ') + '.';
}

/**
 * Generate a paragraph
 */
function generateParagraph(
  words: string[],
  rng: () => number,
  minSentences: number = 3,
  maxSentences: number = 7
): string {
  const sentenceCount =
    Math.floor(rng() * (maxSentences - minSentences + 1)) + minSentences;
  const sentences: string[] = [];

  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(words, rng));
  }

  return sentences.join(' ');
}

/**
 * Generate words
 */
function generateWords(
  words: string[],
  rng: () => number,
  count: number,
  startWithLoremIpsum: boolean
): string {
  const result: string[] = [];

  if (startWithLoremIpsum && words === LOREM_WORDS) {
    result.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    for (let i = 5; i < count; i++) {
      result.push(getRandomWord(words, rng));
    }
  } else {
    for (let i = 0; i < count; i++) {
      result.push(getRandomWord(words, rng));
    }
  }

  return result.slice(0, count).join(' ');
}

/**
 * Generate sentences
 */
function generateSentences(
  words: string[],
  rng: () => number,
  count: number,
  startWithLoremIpsum: boolean
): string {
  const sentences: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLoremIpsum && words === LOREM_WORDS) {
      sentences.push(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      );
    } else {
      sentences.push(generateSentence(words, rng));
    }
  }

  return sentences.join(' ');
}

/**
 * Generate paragraphs
 */
function generateParagraphs(
  words: string[],
  rng: () => number,
  count: number,
  startWithLoremIpsum: boolean
): string[] {
  const paragraphs: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLoremIpsum && words === LOREM_WORDS) {
      paragraphs.push(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
          generateParagraph(words, rng, 2, 5)
      );
    } else {
      paragraphs.push(generateParagraph(words, rng));
    }
  }

  return paragraphs;
}

/**
 * Format paragraphs based on output format
 */
function formatParagraphs(paragraphs: string[], format: OutputFormat): string {
  switch (format) {
    case 'html':
      return paragraphs.map((p) => `<p>${p}</p>`).join('\n\n');
    case 'markdown':
      return paragraphs.join('\n\n');
    case 'plain':
    default:
      return paragraphs.join('\n\n');
  }
}

/**
 * Main generation function
 */
export function generateLoremIpsum(
  options: LoremIpsumOptions,
  seed?: number
): LoremIpsumResult {
  const { type, count, format, variant, startWithLoremIpsum } = options;
  const words = WORD_LISTS[variant];
  const rng = createRng(seed ?? Date.now());

  let text: string;
  let paragraphs: string[] = [];

  switch (type) {
    case 'words':
      text = generateWords(words, rng, count, startWithLoremIpsum);
      break;
    case 'sentences':
      text = generateSentences(words, rng, count, startWithLoremIpsum);
      break;
    case 'paragraphs':
      paragraphs = generateParagraphs(words, rng, count, startWithLoremIpsum);
      text = formatParagraphs(paragraphs, format);
      break;
    default:
      text = '';
  }

  // Count statistics
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = text.length;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length;
  const paragraphCount =
    type === 'paragraphs' ? paragraphs.length : text ? 1 : 0;

  return {
    text,
    wordCount,
    charCount,
    paragraphCount,
    sentenceCount,
  };
}

/**
 * Get default options
 */
export function getDefaultOptions(): LoremIpsumOptions {
  return {
    type: 'paragraphs',
    count: 3,
    format: 'plain',
    variant: 'classic',
    startWithLoremIpsum: true,
  };
}

/**
 * Get variant display names
 */
export function getVariantNames(): Record<TextVariant, string> {
  return {
    classic: 'Classic Lorem Ipsum',
    cicero: 'Original Cicero',
    tech: 'Tech/Developer',
    hipster: 'Hipster Ipsum',
    office: 'Corporate Buzzwords',
  };
}

/**
 * Get generation type names
 */
export function getTypeNames(): Record<GenerationType, string> {
  return {
    words: 'Words',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
  };
}

/**
 * Get format names
 */
export function getFormatNames(): Record<OutputFormat, string> {
  return {
    plain: 'Plain Text',
    html: 'HTML',
    markdown: 'Markdown',
  };
}
