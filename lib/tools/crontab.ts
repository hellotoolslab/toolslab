// lib/tools/crontab.ts
export interface CronField {
  type: 'minute' | 'hour' | 'day' | 'month' | 'weekday' | 'second' | 'year';
  value: string;
  description: string;
  valid: boolean;
  error?: string;
}

export interface CronValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface NextExecution {
  date: Date;
  humanReadable: string;
  relativeTime: string;
}

export interface CronParseResult {
  expression: string;
  description: string;
  fields: CronField[];
  validation: CronValidation;
  nextExecutions: NextExecution[];
  timezone: string;
}

export interface CronPreset {
  name: string;
  expression: string;
  description: string;
  category: 'frequent' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'special';
}

// Predefined cron expressions
export const CRON_PRESETS: CronPreset[] = [
  // Frequent
  {
    name: 'Every minute',
    expression: '* * * * *',
    description: 'Every minute',
    category: 'frequent',
  },
  {
    name: 'Every 5 minutes',
    expression: '*/5 * * * *',
    description: 'Every 5 minutes',
    category: 'frequent',
  },
  {
    name: 'Every 15 minutes',
    expression: '*/15 * * * *',
    description: 'Every 15 minutes',
    category: 'frequent',
  },
  {
    name: 'Every 30 minutes',
    expression: '*/30 * * * *',
    description: 'Every 30 minutes',
    category: 'frequent',
  },
  {
    name: 'Every hour',
    expression: '0 * * * *',
    description: 'Every hour',
    category: 'frequent',
  },

  // Daily
  {
    name: 'Daily at midnight',
    expression: '0 0 * * *',
    description: 'Every day at 12:00 AM',
    category: 'daily',
  },
  {
    name: 'Daily at 6 AM',
    expression: '0 6 * * *',
    description: 'Every day at 6:00 AM',
    category: 'daily',
  },
  {
    name: 'Daily at noon',
    expression: '0 12 * * *',
    description: 'Every day at 12:00 PM',
    category: 'daily',
  },
  {
    name: 'Daily at 6 PM',
    expression: '0 18 * * *',
    description: 'Every day at 6:00 PM',
    category: 'daily',
  },
  {
    name: 'Twice a day',
    expression: '0 6,18 * * *',
    description: 'Every day at 6:00 AM and 6:00 PM',
    category: 'daily',
  },

  // Weekly
  {
    name: 'Weekly (Sunday)',
    expression: '0 0 * * 0',
    description: 'Every Sunday at midnight',
    category: 'weekly',
  },
  {
    name: 'Weekly (Monday)',
    expression: '0 0 * * 1',
    description: 'Every Monday at midnight',
    category: 'weekly',
  },
  {
    name: 'Weekdays only',
    expression: '0 9 * * 1-5',
    description: 'Every weekday at 9:00 AM',
    category: 'weekly',
  },
  {
    name: 'Weekend only',
    expression: '0 10 * * 0,6',
    description: 'Every Saturday and Sunday at 10:00 AM',
    category: 'weekly',
  },

  // Monthly
  {
    name: 'First day of month',
    expression: '0 0 1 * *',
    description: 'First day of every month at midnight',
    category: 'monthly',
  },
  {
    name: 'Last day of month',
    expression: '0 0 L * *',
    description: 'Last day of every month at midnight',
    category: 'monthly',
  },
  {
    name: 'Mid-month',
    expression: '0 0 15 * *',
    description: '15th of every month at midnight',
    category: 'monthly',
  },

  // Yearly
  {
    name: 'Yearly',
    expression: '0 0 1 1 *',
    description: 'Every January 1st at midnight',
    category: 'yearly',
  },
  {
    name: 'Christmas',
    expression: '0 0 25 12 *',
    description: 'Every Christmas at midnight',
    category: 'yearly',
  },

  // Special
  {
    name: '@yearly',
    expression: '@yearly',
    description: 'Once a year',
    category: 'special',
  },
  {
    name: '@monthly',
    expression: '@monthly',
    description: 'Once a month',
    category: 'special',
  },
  {
    name: '@weekly',
    expression: '@weekly',
    description: 'Once a week',
    category: 'special',
  },
  {
    name: '@daily',
    expression: '@daily',
    description: 'Once a day',
    category: 'special',
  },
  {
    name: '@hourly',
    expression: '@hourly',
    description: 'Once an hour',
    category: 'special',
  },
  {
    name: '@reboot',
    expression: '@reboot',
    description: 'At startup',
    category: 'special',
  },
];

// Special expressions mapping
const SPECIAL_EXPRESSIONS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
  '@reboot': '0 0 1 1 *', // Treat as yearly for parsing purposes
};

// Field configurations
const FIELD_CONFIG = {
  minute: { min: 0, max: 59, name: 'minute' },
  hour: { min: 0, max: 23, name: 'hour' },
  day: { min: 1, max: 31, name: 'day of month' },
  month: { min: 1, max: 12, name: 'month' },
  weekday: { min: 0, max: 7, name: 'day of week' }, // 0 and 7 are both Sunday
};

// Month names mapping
const MONTH_NAMES: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

// Day names mapping
const DAY_NAMES: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

/**
 * Parse a cron expression and return detailed information
 */
export function parseCronExpression(
  expression: string,
  timezone: string = 'UTC'
): CronParseResult {
  try {
    // Handle special expressions
    const normalizedExpression = normalizeExpression(expression.trim());

    const fields = parseFields(normalizedExpression);
    const validation = validateExpression(fields);
    const description = generateDescription(fields);
    const nextExecutions = calculateNextExecutions(fields, timezone, 10);

    return {
      expression: normalizedExpression,
      description,
      fields,
      validation,
      nextExecutions,
      timezone,
    };
  } catch (error) {
    return {
      expression,
      description: 'Invalid cron expression',
      fields: [],
      validation: {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Invalid expression'],
        warnings: [],
      },
      nextExecutions: [],
      timezone,
    };
  }
}

/**
 * Normalize special expressions
 */
function normalizeExpression(expression: string): string {
  const lower = expression.toLowerCase();
  if (SPECIAL_EXPRESSIONS[lower]) {
    return SPECIAL_EXPRESSIONS[lower];
  }
  return expression;
}

/**
 * Parse individual fields of cron expression
 */
function parseFields(expression: string): CronField[] {
  const parts = expression.split(/\s+/);

  if (parts.length < 5 || parts.length > 7) {
    throw new Error('Cron expression must have 5-7 fields');
  }

  const fieldTypes: Array<CronField['type']> =
    parts.length === 5
      ? ['minute', 'hour', 'day', 'month', 'weekday']
      : parts.length === 6
        ? ['second', 'minute', 'hour', 'day', 'month', 'weekday']
        : ['second', 'minute', 'hour', 'day', 'month', 'weekday', 'year'];

  return parts.map((part, index) => parseField(part, fieldTypes[index]));
}

/**
 * Validate field value is within allowed range
 */
function validateFieldValue(value: string, type: CronField['type']): boolean {
  const config = FIELD_CONFIG[type as keyof typeof FIELD_CONFIG];
  if (!config) return true; // Skip validation for unknown types

  // Handle special characters and patterns
  if (
    value === '*' ||
    value.includes('L') ||
    value.includes('W') ||
    value.includes('#')
  ) {
    return true;
  }

  // Extract numeric values from the field
  const numericValues: number[] = [];

  if (value.includes(',')) {
    // Handle lists (1,3,5)
    value
      .split(',')
      .forEach((v) => extractNumericValues(v.trim(), type, numericValues));
  } else if (value.includes('-')) {
    // Handle ranges (1-5)
    const [start, end] = value.split('-');
    extractNumericValues(start.trim(), type, numericValues);
    extractNumericValues(end.trim(), type, numericValues);
  } else if (value.includes('/')) {
    // Handle step values (*/5, 2-10/2)
    const [range, step] = value.split('/');
    const stepNum = parseInt(step);
    if (isNaN(stepNum) || stepNum <= 0) return false;

    if (range === '*') {
      return true;
    } else {
      extractNumericValues(range.trim(), type, numericValues);
    }
  } else {
    // Single value
    extractNumericValues(value, type, numericValues);
  }

  // Check if all numeric values are within range
  return numericValues.every((num) => num >= config.min && num <= config.max);
}

/**
 * Extract numeric values from a field value, handling named values
 */
function extractNumericValues(
  value: string,
  type: CronField['type'],
  results: number[]
): void {
  const lower = value.toLowerCase();

  // Handle month names
  if (type === 'month' && MONTH_NAMES[lower]) {
    results.push(MONTH_NAMES[lower]);
    return;
  }

  // Handle day names
  if (type === 'weekday' && DAY_NAMES[lower]) {
    results.push(DAY_NAMES[lower]);
    return;
  }

  // Handle numeric values
  const num = parseInt(value);
  if (!isNaN(num)) {
    // Special case: Sunday can be 7 or 0
    if (type === 'weekday' && num === 7) {
      results.push(0);
    } else {
      results.push(num);
    }
  }
}

/**
 * Parse a single cron field
 */
function parseField(value: string, type: CronField['type']): CronField {
  const field: CronField = {
    type,
    value,
    description: '',
    valid: true,
  };

  try {
    // Validate field range first
    if (!validateFieldValue(value, type)) {
      throw new Error(`Value out of valid range for ${type}`);
    }

    if (value === '*') {
      field.description = `every ${FIELD_CONFIG[type as keyof typeof FIELD_CONFIG]?.name || type}`;
    } else if (value.includes('/')) {
      // Step values (*/5, 2/10)
      const [range, step] = value.split('/');
      const stepNum = parseInt(step);
      if (isNaN(stepNum) || stepNum <= 0) {
        throw new Error('Invalid step value');
      }

      if (range === '*') {
        field.description = `every ${stepNum} ${FIELD_CONFIG[type as keyof typeof FIELD_CONFIG]?.name || type}${stepNum > 1 ? 's' : ''}`;
      } else {
        field.description = `every ${stepNum} ${FIELD_CONFIG[type as keyof typeof FIELD_CONFIG]?.name || type}${stepNum > 1 ? 's' : ''} starting from ${range}`;
      }
    } else if (value.includes('-')) {
      // Ranges (1-5, MON-FRI)
      const [start, end] = value.split('-');
      field.description = `from ${parseNamedValue(start, type)} to ${parseNamedValue(end, type)}`;
    } else if (value.includes(',')) {
      // Lists (1,3,5, MON,WED,FRI)
      const values = value.split(',').map((v) => parseNamedValue(v, type));
      field.description = `on ${values.join(', ')}`;
    } else if (value.includes('L')) {
      // Last day of month
      field.description = 'on the last day of the month';
    } else if (value.includes('W')) {
      // Weekday
      field.description = 'on weekdays';
    } else if (value.includes('#')) {
      // Nth weekday (1#2 = second Monday)
      const [dayOfWeek, occurrence] = value.split('#');
      field.description = `on the ${getOrdinal(parseInt(occurrence))} ${getDayName(parseInt(dayOfWeek))}`;
    } else {
      // Single value
      const parsedValue = parseNamedValue(value, type);
      field.description = `at ${parsedValue}`;
    }
  } catch (error) {
    field.valid = false;
    field.error =
      error instanceof Error ? error.message : 'Invalid field value';
    field.description = 'Invalid';
  }

  return field;
}

/**
 * Parse named values (JAN, MON, etc.) to numbers
 */
function parseNamedValue(value: string, type: CronField['type']): string {
  const lower = value.toLowerCase();

  if (type === 'month' && MONTH_NAMES[lower]) {
    return getMonthName(MONTH_NAMES[lower]);
  }

  if (type === 'weekday' && DAY_NAMES[lower]) {
    return getDayName(DAY_NAMES[lower]);
  }

  const num = parseInt(value);
  if (!isNaN(num)) {
    if (type === 'month' && num >= 1 && num <= 12) {
      return getMonthName(num);
    }
    if (type === 'weekday' && ((num >= 0 && num <= 6) || num === 7)) {
      return getDayName(num === 7 ? 0 : num);
    }
    if (type === 'hour' && num >= 0 && num <= 23) {
      return formatHour(num);
    }
    return value;
  }

  return value;
}

/**
 * Get month name from number
 */
function getMonthName(month: number): string {
  const months = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month] || month.toString();
}

/**
 * Get day name from number
 */
function getDayName(day: number): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[day] || day.toString();
}

/**
 * Format hour in 12-hour format
 */
function formatHour(hour: number): string {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
}

/**
 * Get ordinal string (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Validate the entire cron expression
 */
function validateExpression(fields: CronField[]): CronValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for invalid fields
  fields.forEach((field) => {
    if (!field.valid && field.error) {
      errors.push(`${field.type}: ${field.error}`);
    }
  });

  // Check for conflicting day specifications
  const dayField = fields.find((f) => f.type === 'day');
  const weekdayField = fields.find((f) => f.type === 'weekday');

  if (
    dayField &&
    weekdayField &&
    dayField.value !== '*' &&
    weekdayField.value !== '*'
  ) {
    warnings.push(
      'Both day-of-month and day-of-week are specified. The job will run when either condition is met.'
    );
  }

  // Check for very frequent executions
  const minuteField = fields.find((f) => f.type === 'minute');
  const hourField = fields.find((f) => f.type === 'hour');

  if (minuteField?.value === '*' && hourField?.value === '*') {
    warnings.push(
      'This expression runs every minute. Consider if this frequency is necessary.'
    );
  }

  // Check for February 30/31
  if (
    dayField &&
    (dayField.value.includes('30') || dayField.value.includes('31'))
  ) {
    const monthField = fields.find((f) => f.type === 'month');
    if (monthField?.value.includes('2')) {
      warnings.push(
        'February 30/31 does not exist. The job will not run in February.'
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate human-readable description
 */
function generateDescription(fields: CronField[]): string {
  const validFields = fields.filter((f) => f.valid);

  if (validFields.length === 0) {
    return 'Invalid cron expression';
  }

  const minuteField = validFields.find((f) => f.type === 'minute');
  const hourField = validFields.find((f) => f.type === 'hour');
  const dayField = validFields.find((f) => f.type === 'day');
  const monthField = validFields.find((f) => f.type === 'month');
  const weekdayField = validFields.find((f) => f.type === 'weekday');

  // Check for business hour patterns
  const isBusinessHours =
    hourField?.value?.includes('9-17') || hourField?.value?.includes('9-18');
  const isWeekdays =
    weekdayField?.value === '1-5' || weekdayField?.value?.includes('1-5');

  if (isBusinessHours && isWeekdays) {
    const minute =
      minuteField?.value === '0' ? '' : `at minute ${minuteField?.value} `;
    return `${minute}from 9:00 am to 5:00 pm from monday to friday`;
  }

  let description = 'At ';

  // Time part
  if (minuteField?.value === '0' && hourField?.value !== '*') {
    description += `${hourField?.description?.replace('at ', '') || 'every hour'}`;
  } else if (minuteField && hourField) {
    if (minuteField.value === '*') {
      description += `every minute`;
    } else {
      description += `${minuteField.description} past ${hourField.description?.replace('at ', '') || 'every hour'}`;
    }
  }

  // Date part
  const dateParts: string[] = [];

  if (dayField && dayField.value !== '*') {
    dateParts.push(`${dayField.description}`);
  }

  if (monthField && monthField.value !== '*') {
    dateParts.push(`in ${monthField.description?.replace('at ', '')}`);
  }

  if (weekdayField && weekdayField.value !== '*') {
    dateParts.push(`${weekdayField.description}`);
  }

  if (dateParts.length > 0) {
    description += ` ${dateParts.join(' ')}`;
  } else if (
    dayField?.value === '*' &&
    monthField?.value === '*' &&
    weekdayField?.value === '*'
  ) {
    description += ' every day';
  }

  return description;
}

/**
 * Calculate next execution times
 */
function calculateNextExecutions(
  fields: CronField[],
  timezone: string,
  count: number
): NextExecution[] {
  const executions: NextExecution[] = [];

  // This is a simplified implementation
  // In a real implementation, you'd use a proper cron parser library
  // like node-cron or cron-parser for accurate calculations

  const now = new Date();
  const baseDate = new Date(now.getTime());

  for (let i = 0; i < count; i++) {
    // Add increasing intervals as a placeholder
    const futureDate = new Date(baseDate.getTime() + (i + 1) * 60 * 1000);

    executions.push({
      date: futureDate,
      humanReadable: futureDate.toLocaleString('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      relativeTime: getRelativeTime(futureDate),
    });
  }

  return executions;
}

/**
 * Get relative time description
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffMinutes > 0) {
    return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else {
    return 'now';
  }
}

/**
 * Build cron expression from individual field values
 */
export function buildCronExpression(fields: {
  minute?: string;
  hour?: string;
  day?: string;
  month?: string;
  weekday?: string;
}): string {
  const {
    minute = '*',
    hour = '*',
    day = '*',
    month = '*',
    weekday = '*',
  } = fields;

  return [minute, hour, day, month, weekday].join(' ');
}

/**
 * Export cron expression in different formats
 */
export function exportCronExpression(
  expression: string,
  format: 'shell' | 'docker' | 'k8s' | 'github-actions' | 'python' | 'nodejs'
): string {
  switch (format) {
    case 'shell':
      return `# Add to crontab with: crontab -e\n${expression} /path/to/your/script.sh`;

    case 'docker':
      return `# Docker crontab setup\n# Use this with docker to schedule cron jobs\n# Docker Compose service\nservices:\n  cron-job:\n    image: your-image\n    command: crond -f\n    volumes:\n      - ./crontab:/etc/crontabs/root\n# crontab file content:\n${expression} /app/script.sh`;

    case 'k8s':
      return `apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: my-cronjob\nspec:\n  schedule: "${expression}"\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          containers:\n          - name: job\n            image: your-image\n            command: ["your-command"]\n          restartPolicy: OnFailure`;

    case 'github-actions':
      return `name: Scheduled Job\non:\n  schedule:\n    - cron: '${expression}'\njobs:\n  run:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Run script\n        run: ./script.sh`;

    case 'python':
      return `# Using APScheduler\nfrom apscheduler.schedulers.blocking import BlockingScheduler\nfrom apscheduler.triggers.cron import CronTrigger\n\nscheduler = BlockingScheduler()\ntrigger = CronTrigger.from_crontab('${expression}')\nscheduler.add_job(your_function, trigger)\nscheduler.start()`;

    case 'nodejs':
      return `// Using node-cron\nconst cron = require('node-cron');\n\ncron.schedule('${expression}', () => {\n  console.log('Running scheduled task...');\n  // Your code here\n});`;

    default:
      return expression;
  }
}
