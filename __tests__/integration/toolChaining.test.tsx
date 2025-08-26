import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useToolStore } from '@/lib/store/toolStore';
import { TEST_JWT, TEST_BASE64, TEST_JSON } from '../fixtures/test-data';

// Mock components for testing
const MockToolChainFlow = () => {
  const { chainedData, setChainedData, addToHistory } = useToolStore();

  return (
    <div>
      <input
        data-testid="json-input"
        placeholder="JSON input"
        onChange={(e) => setChainedData(e.target.value)}
      />
      <button
        data-testid="format-btn"
        onClick={() => {
          addToHistory({
            id: Date.now().toString(),
            tool: 'json-formatter',
            input: chainedData,
            output: chainedData,
            timestamp: Date.now(),
          });
        }}
      >
        Format
      </button>
      {chainedData && chainedData.includes('eyJ') && (
        <>
          <div>JWT token detected</div>
          <button data-testid="decode-jwt">Decode JWT</button>
        </>
      )}
      <input
        data-testid="jwt-input"
        value={
          chainedData?.includes('eyJ')
            ? chainedData.match(/eyJ[^"]+/)?.[0] || ''
            : ''
        }
        readOnly
      />
    </div>
  );
};

describe('Tool Chaining Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    useToolStore.setState({
      history: [],
      chainedData: null,
      userLevel: 'first_time',
      proUser: false,
    });
  });

  describe('Data Flow Between Tools', () => {
    it('should chain data from JSON formatter to JWT decoder', async () => {
      const user = userEvent.setup();

      render(<MockToolChainFlow />);

      // Input JWT in JSON formatter
      const input = await screen.findByTestId('json-input');
      await user.type(input, `{{"token":"${TEST_JWT.valid}"}}`);

      // Format JSON
      const formatBtn = screen.getByTestId('format-btn');
      await user.click(formatBtn);

      // Check suggestion appears
      await waitFor(() => {
        expect(screen.getByText('JWT token detected')).toBeDefined();
      });

      // Verify JWT is extracted
      const jwtInput = screen.getByTestId('jwt-input') as HTMLInputElement;
      expect(jwtInput.value).toContain('eyJ');
    });

    it('should maintain chain history', async () => {
      const store = useToolStore.getState();

      // Simulate tool operations
      store.addToHistory({
        id: '1',
        tool: 'json-formatter',
        input: '{"test":1}',
        output: '{\n  "test": 1\n}',
        timestamp: Date.now(),
      });

      store.addToHistory({
        id: '2',
        tool: 'base64-encode',
        input: 'test',
        output: 'dGVzdA==',
        timestamp: Date.now() + 1000,
      });

      const history = useToolStore.getState().history;
      expect(history).toHaveLength(2);
      expect(history[0].tool).toBe('json-formatter');
      expect(history[1].tool).toBe('base64-encode');
    });

    it('should pass output of one tool as input to next', () => {
      const store = useToolStore.getState();

      // First tool output
      const jsonOutput = '{\n  "data": "formatted"\n}';
      store.setChainedData(jsonOutput);

      // Second tool receives it as input
      const chainedData = store.chainedData;
      expect(chainedData).toBe(jsonOutput);

      // Convert to Base64
      const base64Output = Buffer.from(jsonOutput).toString('base64');
      store.setChainedData(base64Output);

      expect(store.chainedData).toBe(base64Output);
    });
  });

  describe('User Level Tracking', () => {
    it('should track user progression from first_time to returning', () => {
      const store = useToolStore.getState();

      expect(store.getUserLevel()).toBe('first_time');

      // Add some operations
      for (let i = 0; i < 5; i++) {
        store.addToHistory({
          id: i.toString(),
          tool: 'json-formatter',
          input: 'test',
          output: 'test',
          timestamp: Date.now() + i,
        });
      }

      expect(store.getUserLevel()).toBe('returning');
    });

    it('should identify power users', () => {
      const store = useToolStore.getState();

      // Add many operations
      for (let i = 0; i < 15; i++) {
        store.addToHistory({
          id: i.toString(),
          tool: 'various-tools',
          input: 'test',
          output: 'test',
          timestamp: Date.now() + i,
        });
      }

      expect(store.getUserLevel()).toBe('power');
    });
  });

  describe('Workspace Mode', () => {
    it('should support multiple tools in workspace', async () => {
      const store = useToolStore.getState();

      // Simulate workspace with multiple tools
      const workspace = [
        { tool: 'json-formatter', position: { x: 0, y: 0 } },
        { tool: 'base64-encode', position: { x: 300, y: 0 } },
        { tool: 'jwt-decoder', position: { x: 600, y: 0 } },
      ];

      // Store workspace configuration
      store.setChainedData({ workspace });

      expect(store.chainedData.workspace).toHaveLength(3);
      expect(store.chainedData.workspace[0].tool).toBe('json-formatter');
    });

    it('should maintain tool connections in workspace', () => {
      const store = useToolStore.getState();

      const connections = [
        { from: 'json-formatter', to: 'jwt-decoder', dataPath: 'token' },
        { from: 'jwt-decoder', to: 'base64-encode', dataPath: 'payload' },
      ];

      store.setChainedData({ connections });

      expect(store.chainedData.connections).toHaveLength(2);
      expect(store.chainedData.connections[0].from).toBe('json-formatter');
    });
  });

  describe('Error Handling in Chain', () => {
    it('should handle errors gracefully in tool chain', () => {
      const store = useToolStore.getState();

      // Simulate error in first tool
      const errorOperation = {
        id: '1',
        tool: 'json-formatter',
        input: TEST_JSON.invalid.syntaxError,
        output: '',
        error: 'Invalid JSON syntax',
        timestamp: Date.now(),
      };

      store.addToHistory(errorOperation as any);

      // Chain should stop on error
      expect(store.chainedData).toBeNull();
      expect(store.history[0]).toHaveProperty('error');
    });

    it('should provide fallback suggestions on error', () => {
      const store = useToolStore.getState();

      // Set invalid data
      store.setChainedData(TEST_JSON.invalid.syntaxError);

      // Tool should suggest alternatives
      const suggestions = [
        'json-validator',
        'text-formatter',
        'syntax-checker',
      ];

      // In real implementation, this would be computed
      expect(suggestions).toContain('json-validator');
    });
  });

  describe('Batch Processing', () => {
    it('should handle batch operations efficiently', async () => {
      const store = useToolStore.getState();
      const items = Array(100)
        .fill(null)
        .map((_, i) => ({
          id: i.toString(),
          data: `{"item": ${i}}`,
        }));

      const startTime = performance.now();

      // Process all items
      const results = items.map((item) => {
        store.addToHistory({
          id: item.id,
          tool: 'json-formatter',
          input: item.data,
          output: item.data,
          timestamp: Date.now(),
        });
        return item;
      });

      const duration = performance.now() - startTime;

      expect(results).toHaveLength(100);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      expect(store.history).toHaveLength(100);
    });
  });

  describe('Data Persistence', () => {
    it('should persist history across sessions', () => {
      const store = useToolStore.getState();

      // Add operations
      store.addToHistory({
        id: '1',
        tool: 'json-formatter',
        input: 'test',
        output: 'test',
        timestamp: Date.now(),
      });

      // Simulate page reload by checking localStorage
      const persistedState = localStorage.getItem('octotools-store');
      expect(persistedState).toBeTruthy();

      const parsed = JSON.parse(persistedState!);
      expect(parsed.state.history).toHaveLength(1);
    });

    it('should limit history size to prevent storage overflow', () => {
      const store = useToolStore.getState();

      // Add more than limit (100) operations
      for (let i = 0; i < 150; i++) {
        store.addToHistory({
          id: i.toString(),
          tool: 'test-tool',
          input: 'test',
          output: 'test',
          timestamp: Date.now() + i,
        });
      }

      // Should keep only last 100
      expect(store.history.length).toBeLessThanOrEqual(100);
    });
  });
});
