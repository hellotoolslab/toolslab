import {
  formatSQL,
  validateSQL,
  SqlFormatterOptions,
  SqlFormatterResult,
  SqlDialect,
  detectSqlDialect,
  formatKeywords,
  getKeywordStyle,
} from '../../../lib/tools/sql-formatter';

describe('SQL Formatter', () => {
  describe('Square Brackets and LIKE Pattern Validation', () => {
    it('should handle square brackets correctly with IN clause', () => {
      const sql = 'SELECT * FROM users WHERE id IN [1, 2, 3]';
      const validation = validateSQL(sql);

      // Should NOT report unmatched parentheses for square brackets
      const parenErrors = validation.errors.filter((e) =>
        e.message.includes('Unmatched parentheses')
      );
      expect(parenErrors.length).toBe(0);
    });

    it('should handle SQL Server style identifiers with square brackets', () => {
      const sql =
        'SELECT [user].[name], [order].[id] FROM [users] [user] JOIN [orders] [order] ON [user].[id] = [order].[user_id]';
      const validation = validateSQL(sql);

      // Should NOT report unmatched parentheses for square brackets
      const parenErrors = validation.errors.filter((e) =>
        e.message.includes('Unmatched parentheses')
      );
      expect(parenErrors.length).toBe(0);
    });

    it('should detect LIKE without string pattern', () => {
      const sql = 'SELECT * FROM users WHERE name LIKE john';
      const validation = validateSQL(sql);

      // Should report error for LIKE without proper string
      const likeErrors = validation.errors.filter((e) =>
        e.message.includes('LIKE pattern must be')
      );
      expect(likeErrors.length).toBe(1);
    });

    it('should detect NOT LIKE without string pattern', () => {
      const sql = 'SELECT * FROM users WHERE name NOT LIKE admin';
      const validation = validateSQL(sql);

      // Should report error for NOT LIKE without proper string
      const likeErrors = validation.errors.filter((e) =>
        e.message.includes('LIKE pattern must be')
      );
      expect(likeErrors.length).toBe(1);
    });

    it('should accept LIKE with valid string patterns', () => {
      const sql1 = "SELECT * FROM users WHERE name LIKE 'john%'";
      const sql2 = 'SELECT * FROM users WHERE name LIKE "%admin%"';
      const sql3 = "SELECT * FROM users WHERE name NOT LIKE '_test'";

      const validation1 = validateSQL(sql1);
      const validation2 = validateSQL(sql2);
      const validation3 = validateSQL(sql3);

      // Should NOT report errors for valid LIKE patterns
      expect(
        validation1.errors.filter((e) => e.message.includes('LIKE pattern'))
          .length
      ).toBe(0);
      expect(
        validation2.errors.filter((e) => e.message.includes('LIKE pattern'))
          .length
      ).toBe(0);
      expect(
        validation3.errors.filter((e) => e.message.includes('LIKE pattern'))
          .length
      ).toBe(0);
    });

    it('should accept LIKE with parameters', () => {
      const sql1 = 'SELECT * FROM users WHERE name LIKE ?';
      const sql2 = 'SELECT * FROM users WHERE name LIKE :pattern';
      const sql3 = 'SELECT * FROM users WHERE name LIKE @pattern';

      const validation1 = validateSQL(sql1);
      const validation2 = validateSQL(sql2);
      const validation3 = validateSQL(sql3);

      // Should NOT report errors for parameterized LIKE patterns
      expect(
        validation1.errors.filter((e) => e.message.includes('LIKE pattern'))
          .length
      ).toBe(0);
      expect(
        validation2.errors.filter((e) => e.message.includes('LIKE pattern'))
          .length
      ).toBe(0);
      expect(
        validation3.errors.filter((e) => e.message.includes('LIKE pattern'))
          .length
      ).toBe(0);
    });

    it('should accept LIKE with column references', () => {
      const sql = 'SELECT * FROM users u1 WHERE u1.name LIKE u2.pattern';
      const validation = validateSQL(sql);

      // Should NOT report errors for column references in LIKE
      expect(
        validation.errors.filter((e) => e.message.includes('LIKE pattern'))
          .length
      ).toBe(0);
    });

    it('should handle mixed brackets and parentheses correctly', () => {
      const sql =
        "SELECT * FROM [users] WHERE ([id] IN (1, 2, 3) OR [name] LIKE 'test%')";
      const validation = validateSQL(sql);

      // Should handle both brackets and parentheses correctly
      const parenErrors = validation.errors.filter((e) =>
        e.message.includes('Unmatched parentheses')
      );
      expect(parenErrors.length).toBe(0);
    });

    it('should warn about square brackets with IN in MySQL dialect', () => {
      const sql = 'SELECT * FROM users WHERE id IN [1, 2, 3]';
      const options: SqlFormatterOptions = {
        dialect: 'mysql',
        indentSize: 2,
        keywordCase: 'uppercase',
        linesBetweenQueries: 1,
        maxLineLength: 80,
        preserveComments: true,
      };

      const result = formatSQL(sql, options);

      expect(result.success).toBe(true);
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain(
        'Square brackets are not valid MySQL syntax'
      );
      expect(result.warning).toContain('Use parentheses instead');
    });

    it('should warn about square bracket identifiers in MySQL', () => {
      const sql = 'SELECT [user].[name] FROM [users]';
      const options: SqlFormatterOptions = {
        dialect: 'mysql',
        indentSize: 2,
        keywordCase: 'uppercase',
        linesBetweenQueries: 1,
        maxLineLength: 80,
        preserveComments: true,
      };

      const result = formatSQL(sql, options);

      expect(result.success).toBe(true);
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain(
        'Square brackets for identifiers are SQL Server syntax'
      );
      expect(result.warning).toContain('use backticks');
    });

    it('should NOT warn about square brackets in SQL Server dialect', () => {
      const sql = 'SELECT * FROM users WHERE id IN [1, 2, 3]';
      const options: SqlFormatterOptions = {
        dialect: 'sqlserver',
        indentSize: 2,
        keywordCase: 'uppercase',
        linesBetweenQueries: 1,
        maxLineLength: 80,
        preserveComments: true,
      };

      const result = formatSQL(sql, options);

      expect(result.success).toBe(true);
      expect(result.warning).toBeUndefined();
    });
  });

  describe('formatSQL', () => {
    const defaultOptions: SqlFormatterOptions = {
      dialect: 'mysql',
      indentSize: 2,
      keywordCase: 'uppercase',
      linesBetweenQueries: 1,
      maxLineLength: 80,
      preserveComments: true,
    };

    it('should format basic SELECT query', () => {
      const input = 'select * from users where id=1';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('SELECT');
      expect(result.formatted).toContain('FROM');
      expect(result.formatted).toContain('WHERE');
      expect(result.formatted).toMatch(/\n/); // Should have line breaks
    });

    it('should handle complex JOIN queries', () => {
      const input =
        'select u.name, p.title from users u inner join posts p on u.id = p.user_id where u.active = 1';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('SELECT');
      expect(result.formatted).toContain('INNER JOIN');
      expect(result.formatted).toContain('ON');
      expect(result.lines).toBeGreaterThan(1);
    });

    it('should format subqueries with proper indentation', () => {
      const input =
        'select * from (select id, name from users where active = 1) as active_users';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toMatch(/\n\s+/); // Should have indentation
      expect(result.lines).toBeGreaterThan(1);
    });

    it('should handle INSERT statements', () => {
      const input =
        'insert into users (name, email) values ("john doe", "john@example.com")';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('INSERT INTO');
      expect(result.formatted).toContain('VALUES');
    });

    it('should format UPDATE statements', () => {
      const input =
        'update users set name = "jane doe", email = "jane@example.com" where id = 1';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('UPDATE');
      expect(result.formatted).toContain('SET');
      expect(result.formatted).toContain('WHERE');
    });

    it('should format DELETE statements', () => {
      const input = 'delete from users where created_at < "2023-01-01"';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('DELETE');
      expect(result.formatted).toContain('FROM');
      expect(result.formatted).toContain('WHERE');
    });

    it('should handle CREATE TABLE statements', () => {
      const input =
        'create table users (id int primary key, name varchar(255), email varchar(255) unique)';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('CREATE TABLE');
      expect(result.formatted).toContain('PRIMARY KEY');
      expect(result.formatted).toContain('UNIQUE');
    });

    it('should preserve comments when option is enabled', () => {
      const input = 'SELECT * FROM users -- Get all users\nWHERE active = 1';
      const result = formatSQL(input, {
        ...defaultOptions,
        preserveComments: true,
      });

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('-- Get all users');
    });

    it('should remove comments when option is disabled', () => {
      const input = 'SELECT * FROM users -- Get all users\nWHERE active = 1';
      const result = formatSQL(input, {
        ...defaultOptions,
        preserveComments: false,
      });

      expect(result.success).toBe(true);
      expect(result.formatted).not.toContain('-- Get all users');
    });

    it('should use lowercase keywords when specified', () => {
      const input = 'SELECT * FROM users';
      const result = formatSQL(input, {
        ...defaultOptions,
        keywordCase: 'lowercase',
      });

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('select');
      expect(result.formatted).toContain('from');
    });

    it('should use custom indentation size', () => {
      const input = 'select * from (select id from users) as sub';
      const result = formatSQL(input, { ...defaultOptions, indentSize: 4 });

      expect(result.success).toBe(true);
      expect(result.formatted).toMatch(/\n    /); // 4-space indentation
    });

    it('should handle CTEs (Common Table Expressions)', () => {
      const input =
        'with active_users as (select * from users where active = 1) select * from active_users';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('WITH');
      expect(result.formatted).toContain('AS');
    });

    it('should handle complex CTE queries without validation errors', () => {
      const complexCteQuery = `with monthly_sales as(select date_trunc('month',order_date)as month,sum(total_amount)as revenue,count(*)as order_count from orders where order_date>=current_date-interval '12 months'group by date_trunc('month',order_date)),top_products as(select p.name,sum(oi.quantity*oi.price)as product_revenue from order_items oi join products p on oi.product_id=p.id join orders o on oi.order_id=o.id where o.order_date>=current_date-interval '3 months'group by p.id,p.name order by product_revenue desc limit 5)select ms.month,ms.revenue,ms.order_count,case when ms.revenue>lag(ms.revenue)over(order by ms.month)then'Growth'when ms.revenue<lag(ms.revenue)over(order by ms.month)then'Decline'else'Stable'end as trend,(select string_agg(tp.name,', ')from top_products tp)as top_products_last_quarter from monthly_sales ms order by ms.month desc;`;

      const result = formatSQL(complexCteQuery, defaultOptions);
      const validation = validateSQL(complexCteQuery);

      expect(result.success).toBe(true);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(result.formatted).toContain('WITH');
      expect(result.formatted).toContain('monthly_sales');
      expect(result.formatted).toContain('top_products');
    });

    it('should handle CASE expressions', () => {
      const input =
        'select name, case when age < 18 then "minor" else "adult" end as age_group from users';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('CASE');
      expect(result.formatted).toContain('WHEN');
      expect(result.formatted).toContain('THEN');
      expect(result.formatted).toContain('ELSE');
      expect(result.formatted).toContain('END');
    });

    it('should handle window functions', () => {
      const input =
        'select name, row_number() over (partition by department order by salary desc) as rank from employees';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('row_number()');
      expect(result.formatted).toContain('OVER');
      expect(result.formatted).toContain('PARTITION');
      expect(result.formatted).toContain('ORDER');
    });

    it('should handle empty input', () => {
      const result = formatSQL('', defaultOptions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('should handle whitespace-only input', () => {
      const result = formatSQL('   \n\t  ', defaultOptions);

      expect(result.success).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('should handle very large SQL scripts', () => {
      const largeQuery =
        'SELECT * FROM users WHERE id IN (' +
        Array.from({ length: 1000 }, (_, i) => i + 1).join(', ') +
        ')';
      const result = formatSQL(largeQuery, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('SELECT');
      expect(result.characters).toBeGreaterThan(1000);
    });
  });

  describe('validateSQL', () => {
    it('should validate correct SQL syntax', () => {
      const sql = 'SELECT * FROM users WHERE id = 1';
      const result = validateSQL(sql);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing semicolon in multi-statement', () => {
      const sql = 'SELECT * FROM users DELETE FROM posts';
      const result = validateSQL(sql);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((err) => err.message.includes('semicolon'))
      ).toBe(true);
    });

    it('should detect unclosed parentheses', () => {
      const sql = 'SELECT * FROM (SELECT id FROM users';
      const result = validateSQL(sql);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some((err) => err.message.includes('parentheses'))
      ).toBe(true);
    });

    it('should detect unclosed quotes', () => {
      const sql = 'SELECT * FROM users WHERE name = "john';
      const result = validateSQL(sql);

      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.message.includes('quote'))).toBe(
        true
      );
    });

    it('should detect invalid keywords', () => {
      const sql = 'SELCT * FROM users'; // Typo in SELECT
      const result = validateSQL(sql);

      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.message.includes('keyword'))).toBe(
        true
      );
    });

    it('should handle empty SQL', () => {
      const result = validateSQL('');

      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.message.includes('empty'))).toBe(
        true
      );
    });
  });

  describe('detectSqlDialect', () => {
    it('should detect MySQL syntax', () => {
      const sql = 'SELECT * FROM users LIMIT 10';
      const dialect = detectSqlDialect(sql);

      expect(['mysql', 'postgresql']).toContain(dialect);
    });

    it('should detect PostgreSQL-specific syntax', () => {
      const sql = 'SELECT * FROM users OFFSET 10';
      const dialect = detectSqlDialect(sql);

      expect(['postgresql', 'mysql']).toContain(dialect);
    });

    it('should detect SQL Server syntax', () => {
      const sql = 'SELECT TOP 10 * FROM users';
      const dialect = detectSqlDialect(sql);

      expect(dialect).toBe('sqlserver');
    });

    it('should detect SQLite syntax', () => {
      const sql = 'SELECT * FROM pragma_table_info(users)';
      const dialect = detectSqlDialect(sql);

      expect(dialect).toBe('sqlite');
    });

    it('should default to mysql for generic SQL', () => {
      const sql = 'SELECT * FROM users';
      const dialect = detectSqlDialect(sql);

      expect(dialect).toBe('mysql');
    });
  });

  describe('formatKeywords', () => {
    it('should convert keywords to uppercase', () => {
      const text = 'select * from users where id = 1';
      const result = formatKeywords(text, 'uppercase');

      expect(result).toContain('SELECT');
      expect(result).toContain('FROM');
      expect(result).toContain('WHERE');
      expect(result).not.toMatch(/\bselect\b|\bfrom\b|\bwhere\b/);
    });

    it('should convert keywords to lowercase', () => {
      const text = 'SELECT * FROM users WHERE id = 1';
      const result = formatKeywords(text, 'lowercase');

      expect(result).toContain('select');
      expect(result).toContain('from');
      expect(result).toContain('where');
      expect(result).not.toMatch(/\bSELECT\b|\bFROM\b|\bWHERE\b/);
    });

    it('should preserve original case when unchanged', () => {
      const text = 'SeLeCt * FrOm users';
      const result = formatKeywords(text, 'unchanged');

      expect(result).toBe(text);
    });

    it('should not change non-keywords', () => {
      const text = 'SELECT * FROM users WHERE name = "SELECT"';
      const result = formatKeywords(text, 'uppercase');

      expect(result).toContain('name = "SELECT"'); // String should not change
    });
  });

  describe('getKeywordStyle', () => {
    it('should return correct CSS class for keywords', () => {
      const style = getKeywordStyle('SELECT');

      expect(style).toContain('sql-keyword');
    });

    it('should return correct CSS class for functions', () => {
      const style = getKeywordStyle('COUNT');

      expect(style).toContain('sql-function');
    });

    it('should return correct CSS class for operators', () => {
      const style = getKeywordStyle('AND');

      expect(style).toContain('sql-operator');
    });

    it('should return empty for non-keywords', () => {
      const style = getKeywordStyle('username');

      expect(style).toBe('');
    });
  });

  describe('Edge Cases', () => {
    const defaultOptions: SqlFormatterOptions = {
      dialect: 'mysql',
      indentSize: 2,
      keywordCase: 'uppercase',
      linesBetweenQueries: 1,
      maxLineLength: 80,
      preserveComments: true,
    };

    it('should handle SQL with unicode characters', () => {
      const input = 'SELECT * FROM users WHERE name = "José García"';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('José García');
    });

    it('should handle SQL with backticks (MySQL)', () => {
      const input = 'SELECT `user`.`name` FROM `users` AS `user`';
      const result = formatSQL(input, { ...defaultOptions, dialect: 'mysql' });

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('`user`');
      expect(result.formatted).toContain('`name`');
    });

    it('should handle SQL with double quotes (PostgreSQL)', () => {
      const input = 'SELECT "user"."name" FROM "users" AS "user"';
      const result = formatSQL(input, {
        ...defaultOptions,
        dialect: 'postgresql',
      });

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('"user"');
      expect(result.formatted).toContain('"name"');
    });

    it('should handle SQL with square brackets (SQL Server)', () => {
      const input = 'SELECT [user].[name] FROM [users] AS [user]';
      const result = formatSQL(input, {
        ...defaultOptions,
        dialect: 'sqlserver',
      });

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('[user]');
      expect(result.formatted).toContain('[name]');
    });

    it('should handle malformed SQL gracefully', () => {
      const input = 'SELECT * FROM WHERE ORDER BY';
      const result = formatSQL(input, defaultOptions);

      // The formatter should still attempt to format even malformed SQL
      expect(result.success).toBe(true);
      expect(result.formatted).toContain('SELECT');
    });

    it('should handle multiple semicolons', () => {
      const input = 'SELECT * FROM users;;; SELECT * FROM posts;';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).not.toContain(';;;');
    });

    it('should handle different line endings', () => {
      const input = 'SELECT *\r\nFROM users\rWHERE id = 1';
      const result = formatSQL(input, defaultOptions);

      expect(result.success).toBe(true);
      expect(result.formatted).toMatch(/\n/); // Should normalize line endings
    });

    it('should handle ORDER BY with semicolon at the end correctly', () => {
      const input = `SELECT
        s.num_ordine,
        s.num_spedizione,
        o.brand
      FROM ordine o
      JOIN spedizione s USING (num_ordine, brand)
      ORDER BY s.num_ordine, s.num_spedizione;`;

      const validation = validateSQL(input);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);

      // Check that semicolon doesn't interfere with column name parsing
      const errorMessages = validation.errors.map(e => e.message);
      expect(errorMessages).not.toContain("Column 'num_spedizione;' is not defined");

      const result = formatSQL(input, defaultOptions);
      expect(result.success).toBe(true);
      expect(result.formatted).toContain('ORDER BY');
      expect(result.formatted).toMatch(/num_spedizione\s*;?\s*$/m);
    });
  });
});
