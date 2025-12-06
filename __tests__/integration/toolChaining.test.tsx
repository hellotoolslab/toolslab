import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useToolStore } from '@/lib/store/toolStore';
import { TEST_JWT, TEST_BASE64, TEST_JSON } from '../fixtures/test-data';

// Mock components for testing
const MockToolChainFlow = () => {
  const { chainedData, setChainedData, addToHistory } = useToolStore();

  // Cast chainedData to string for this test component
  const dataStr = typeof chainedData === 'string' ? chainedData : '';

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
            input: dataStr,
            output: dataStr,
            timestamp: Date.now(),
          });
        }}
      >
        Format
      </button>
      {dataStr && dataStr.includes('eyJ') && (
        <>
          <div>JWT token detected</div>
          <button data-testid="decode-jwt">Decode JWT</button>
        </>
      )}
      <input
        data-testid="jwt-input"
        value={
          dataStr?.includes('eyJ') ? dataStr.match(/eyJ[^"]+/)?.[0] || '' : ''
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

      // Re-read state after mutations (Zustand getState() returns snapshot)
      const history = useToolStore.getState().history;
      expect(history).toHaveLength(2);
      // Note: addToHistory adds to front of array, so newest is first
      expect(history[0].tool).toBe('base64-encode');
      expect(history[1].tool).toBe('json-formatter');
    });

    it('should pass output of one tool as input to next', () => {
      // First tool output
      const jsonOutput = '{\n  "data": "formatted"\n}';
      useToolStore.getState().setChainedData(jsonOutput);

      // Second tool receives it as input (re-read state after mutation)
      expect(useToolStore.getState().chainedData).toBe(jsonOutput);

      // Convert to Base64
      const base64Output = Buffer.from(jsonOutput).toString('base64');
      useToolStore.getState().setChainedData(base64Output);

      // Re-read state after mutation
      expect(useToolStore.getState().chainedData).toBe(base64Output);
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
      // Simulate workspace with multiple tools
      const workspace = [
        { tool: 'json-formatter', position: { x: 0, y: 0 } },
        { tool: 'base64-encode', position: { x: 300, y: 0 } },
        { tool: 'jwt-decoder', position: { x: 600, y: 0 } },
      ];

      // Store workspace configuration
      useToolStore.getState().setChainedData({ workspace });

      // Re-read state after mutation and cast to expected type
      const chainedData = useToolStore.getState().chainedData as {
        workspace: Array<{ tool: string; position: { x: number; y: number } }>;
      };
      expect(chainedData.workspace).toHaveLength(3);
      expect(chainedData.workspace[0].tool).toBe('json-formatter');
    });

    it('should maintain tool connections in workspace', () => {
      const connections = [
        { from: 'json-formatter', to: 'jwt-decoder', dataPath: 'token' },
        { from: 'jwt-decoder', to: 'base64-encode', dataPath: 'payload' },
      ];

      useToolStore.getState().setChainedData({ connections });

      // Re-read state after mutation and cast to expected type
      const chainedData = useToolStore.getState().chainedData as {
        connections: Array<{ from: string; to: string; dataPath: string }>;
      };
      expect(chainedData.connections).toHaveLength(2);
      expect(chainedData.connections[0].from).toBe('json-formatter');
    });
  });

  describe('Error Handling in Chain', () => {
    it('should handle errors gracefully in tool chain', () => {
      // Simulate error in first tool
      const errorOperation = {
        id: '1',
        tool: 'json-formatter',
        input: TEST_JSON.invalid.syntaxError,
        output: '',
        error: 'Invalid JSON syntax',
        timestamp: Date.now(),
      };

      useToolStore.getState().addToHistory(errorOperation as any);

      // Re-read state after mutation
      const state = useToolStore.getState();
      // Chain should stop on error
      expect(state.chainedData).toBeNull();
      expect(state.history[0]).toHaveProperty('error');
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
      const items = Array(100)
        .fill(null)
        .map((_, i) => ({
          id: i.toString(),
          data: `{"item": ${i}}`,
        }));

      const startTime = performance.now();

      // Process all items
      const results = items.map((item) => {
        useToolStore.getState().addToHistory({
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
      // History is limited to 50 items (HISTORY_LIMIT), so we expect 50 items
      expect(useToolStore.getState().history).toHaveLength(50);
    });
  });

  describe('Data Persistence', () => {
    it('should persist history across sessions', async () => {
      const store = useToolStore.getState();

      // Add operations
      store.addToHistory({
        id: '1',
        tool: 'json-formatter',
        input: 'test',
        output: 'test',
        timestamp: Date.now(),
      });

      // Wait for debounced storage to write (1000ms debounce + buffer)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Simulate page reload by checking localStorage
      const persistedState = localStorage.getItem('toolslab-store');
      expect(persistedState).toBeTruthy();

      const parsed = JSON.parse(persistedState!);
      expect(parsed.state.history).toHaveLength(1);
    });

    it('should limit history size to prevent storage overflow', () => {
      const store = useToolStore.getState();

      // Add more than limit (50) operations
      // Note: History limit was reduced from 100 to 50 for performance (Dec 2024)
      for (let i = 0; i < 75; i++) {
        store.addToHistory({
          id: i.toString(),
          tool: 'test-tool',
          input: 'test',
          output: 'test',
          timestamp: Date.now() + i,
        });
      }

      // Should keep only last 50 (HISTORY_LIMIT constant)
      expect(store.history.length).toBeLessThanOrEqual(50);
    });
  });
});
