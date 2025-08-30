import {
  parseCronExpression,
  buildCronExpression,
  exportCronExpression,
  CRON_PRESETS,
} from '@/lib/tools/crontab';

describe('Crontab Tools', () => {
  describe('parseCronExpression', () => {
    it('should parse valid cron expressions', () => {
      const result = parseCronExpression('*/15 0 1,15 * 1-5');

      expect(result.expression).toBe('*/15 0 1,15 * 1-5');
      expect(result.validation.isValid).toBe(true);
      expect(result.fields).toHaveLength(5);
      expect(result.fields[0].type).toBe('minute');
      expect(result.fields[0].value).toBe('*/15');
    });

    it('should handle special expressions', () => {
      const result = parseCronExpression('@daily');

      expect(result.expression).toBe('0 0 * * *');
      expect(result.validation.isValid).toBe(true);
    });

    it('should validate invalid expressions', () => {
      const result = parseCronExpression('invalid expression');

      expect(result.validation.isValid).toBe(false);
      expect(result.validation.errors).toContain(
        'Cron expression must have 5-7 fields'
      );
    });

    it('should parse different field types correctly', () => {
      const testCases = [
        { expr: '* * * * *', desc: 'every minute every day' },
        { expr: '0 * * * *', desc: 'at every hour' },
        { expr: '0 0 * * *', desc: 'daily at midnight' },
        { expr: '0 0 1 * *', desc: 'first day of month' },
        { expr: '0 0 * * 0', desc: 'every Sunday' },
      ];

      testCases.forEach(({ expr }) => {
        const result = parseCronExpression(expr);
        expect(result.validation.isValid).toBe(true);
        expect(result.fields).toHaveLength(5);
      });
    });

    it('should generate human-readable descriptions', () => {
      const testCases = [
        { expr: '0 0 * * *', expectedDesc: /daily|every day/ },
        { expr: '*/5 * * * *', expectedDesc: /every 5 minute/ },
        { expr: '0 9-17 * * 1-5', expectedDesc: /weekday|monday.*friday/ },
      ];

      testCases.forEach(({ expr, expectedDesc }) => {
        const result = parseCronExpression(expr);
        expect(result.description.toLowerCase()).toMatch(expectedDesc);
      });
    });

    it('should calculate next executions', () => {
      const result = parseCronExpression('0 0 * * *');

      expect(result.nextExecutions).toHaveLength(10);
      expect(result.nextExecutions[0]).toHaveProperty('date');
      expect(result.nextExecutions[0]).toHaveProperty('humanReadable');
      expect(result.nextExecutions[0]).toHaveProperty('relativeTime');
    });

    it('should handle different timezone settings', () => {
      const resultUTC = parseCronExpression('0 12 * * *', 'UTC');
      const resultEST = parseCronExpression('0 12 * * *', 'America/New_York');

      expect(resultUTC.timezone).toBe('UTC');
      expect(resultEST.timezone).toBe('America/New_York');
    });

    it('should detect warnings for edge cases', () => {
      // Test for February 30 warning
      const febResult = parseCronExpression('0 0 30 2 *');
      expect(
        febResult.validation.warnings.some((warning) =>
          /february.*30.*does not exist/i.test(warning)
        )
      ).toBe(true);

      // Test for very frequent execution warning
      const frequentResult = parseCronExpression('* * * * *');
      expect(
        frequentResult.validation.warnings.some((warning) =>
          /every minute.*consider/i.test(warning)
        )
      ).toBe(true);

      // Test for conflicting day specifications
      const conflictResult = parseCronExpression('0 0 15 * 1');
      expect(
        conflictResult.validation.warnings.some((warning) =>
          /both.*day.*specified/i.test(warning)
        )
      ).toBe(true);
    });
  });

  describe('buildCronExpression', () => {
    it('should build expressions from field values', () => {
      const result = buildCronExpression({
        minute: '0',
        hour: '12',
        day: '*',
        month: '*',
        weekday: '*',
      });

      expect(result).toBe('0 12 * * *');
    });

    it('should use defaults for missing fields', () => {
      const result = buildCronExpression({
        minute: '30',
        hour: '14',
      });

      expect(result).toBe('30 14 * * *');
    });

    it('should handle complex field values', () => {
      const result = buildCronExpression({
        minute: '*/15',
        hour: '9-17',
        day: '1,15',
        month: '*',
        weekday: '1-5',
      });

      expect(result).toBe('*/15 9-17 1,15 * 1-5');
    });
  });

  describe('exportCronExpression', () => {
    const testExpression = '0 2 * * *';

    it('should export shell format', () => {
      const result = exportCronExpression(testExpression, 'shell');
      expect(result).toContain('crontab -e');
      expect(result).toContain(testExpression);
    });

    it('should export docker format', () => {
      const result = exportCronExpression(testExpression, 'docker');
      expect(result).toContain('docker');
      expect(result).toContain(testExpression);
    });

    it('should export kubernetes format', () => {
      const result = exportCronExpression(testExpression, 'k8s');
      expect(result).toContain('CronJob');
      expect(result).toContain('apiVersion');
      expect(result).toContain(testExpression);
    });

    it('should export github actions format', () => {
      const result = exportCronExpression(testExpression, 'github-actions');
      expect(result).toContain('schedule:');
      expect(result).toContain('cron:');
      expect(result).toContain(testExpression);
    });

    it('should export python format', () => {
      const result = exportCronExpression(testExpression, 'python');
      expect(result).toContain('APScheduler');
      expect(result).toContain('CronTrigger');
      expect(result).toContain(testExpression);
    });

    it('should export nodejs format', () => {
      const result = exportCronExpression(testExpression, 'nodejs');
      expect(result).toContain('node-cron');
      expect(result).toContain('cron.schedule');
      expect(result).toContain(testExpression);
    });
  });

  describe('CRON_PRESETS', () => {
    it('should have required preset structure', () => {
      expect(CRON_PRESETS.length).toBeGreaterThan(0);

      CRON_PRESETS.forEach((preset) => {
        expect(preset).toHaveProperty('name');
        expect(preset).toHaveProperty('expression');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('category');
        expect(typeof preset.name).toBe('string');
        expect(typeof preset.expression).toBe('string');
        expect(typeof preset.description).toBe('string');
        expect([
          'frequent',
          'daily',
          'weekly',
          'monthly',
          'yearly',
          'special',
        ]).toContain(preset.category);
      });
    });

    it('should have valid expressions in presets', () => {
      const specialExpressions = [
        '@yearly',
        '@monthly',
        '@weekly',
        '@daily',
        '@hourly',
        '@reboot',
      ];

      CRON_PRESETS.forEach((preset) => {
        if (!specialExpressions.includes(preset.expression)) {
          const parts = preset.expression.split(' ');
          expect(parts.length).toBeGreaterThanOrEqual(5);
          expect(parts.length).toBeLessThanOrEqual(7);
        }

        // Should be able to parse without errors
        const result = parseCronExpression(preset.expression);
        expect(result.validation.isValid).toBe(true);
      });
    });

    it('should include common use cases', () => {
      const expressions = CRON_PRESETS.map((p) => p.expression);

      // Check for common patterns
      expect(expressions).toContain('* * * * *'); // Every minute
      expect(expressions).toContain('0 0 * * *'); // Daily
      expect(expressions).toContain('0 * * * *'); // Hourly
      expect(expressions).toContain('*/5 * * * *'); // Every 5 minutes
      expect(expressions).toContain('@daily'); // Special syntax
    });

    it('should have appropriate categories', () => {
      const categories = [...new Set(CRON_PRESETS.map((p) => p.category))];

      expect(categories).toContain('frequent');
      expect(categories).toContain('daily');
      expect(categories).toContain('weekly');
      expect(categories).toContain('monthly');
      expect(categories.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Field validation', () => {
    it('should validate minute field range', () => {
      const result = parseCronExpression('60 * * * *'); // Invalid minute
      expect(result.validation.isValid).toBe(false);
    });

    it('should validate hour field range', () => {
      const result = parseCronExpression('0 24 * * *'); // Invalid hour
      expect(result.validation.isValid).toBe(false);
    });

    it('should validate day field range', () => {
      const result = parseCronExpression('0 0 32 * *'); // Invalid day
      expect(result.validation.isValid).toBe(false);
    });

    it('should validate month field range', () => {
      const result = parseCronExpression('0 0 1 13 *'); // Invalid month
      expect(result.validation.isValid).toBe(false);
    });

    it('should validate weekday field range', () => {
      const result = parseCronExpression('0 0 * * 8'); // Invalid weekday (should accept 0-7)
      expect(result.validation.isValid).toBe(false);
    });

    it('should accept valid weekday values including 7 for Sunday', () => {
      const result1 = parseCronExpression('0 0 * * 0'); // Sunday as 0
      const result2 = parseCronExpression('0 0 * * 7'); // Sunday as 7

      expect(result1.validation.isValid).toBe(true);
      expect(result2.validation.isValid).toBe(true);
    });
  });

  describe('Named values', () => {
    it('should parse month names', () => {
      const result = parseCronExpression('0 0 1 JAN *');
      expect(result.validation.isValid).toBe(true);
      expect(result.description.toLowerCase()).toContain('january');
    });

    it('should parse day names', () => {
      const result = parseCronExpression('0 0 * * MON');
      expect(result.validation.isValid).toBe(true);
      expect(result.description.toLowerCase()).toContain('monday');
    });

    it('should handle mixed case names', () => {
      const result = parseCronExpression('0 0 * Jan mon');
      expect(result.validation.isValid).toBe(true);
    });
  });

  describe('Complex expressions', () => {
    it('should handle step values with ranges', () => {
      const result = parseCronExpression('*/15 9-17 * * 1-5');
      expect(result.validation.isValid).toBe(true);
      expect(result.description).toBeTruthy();
    });

    it('should handle lists of values', () => {
      const result = parseCronExpression('0 8,12,17 * * 1,3,5');
      expect(result.validation.isValid).toBe(true);
      expect(result.description).toBeTruthy();
    });

    it('should handle L (last day) modifier', () => {
      const result = parseCronExpression('0 0 L * *');
      expect(result.validation.isValid).toBe(true);
      expect(result.description.toLowerCase()).toContain('last');
    });
  });
});
