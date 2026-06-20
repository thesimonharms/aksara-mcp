import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Aksara } from 'aksara-ts';
import { z } from 'zod';

const server = new McpServer(
  {
    name: 'aksara-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.registerTool(
  'to_aksara',
  {
    description:
      'Convert Latin-script Javanese text to Aksara Jawa (Hanacaraka script). Supports optional space preservation and explicit standalone vowel letters.',
    inputSchema: {
      text: z.string().describe('Latin-script Javanese text to transliterate'),
      spaces: z
        .boolean()
        .optional()
        .describe('Preserve spaces in the output (default: false)'),
      explicit_vowels: z
        .boolean()
        .optional()
        .describe(
          'Use standalone vowel letters (ꦄ ꦆ ꦈ ꦌ ꦎ) for vowels without a preceding consonant (default: false)',
        ),
    },
  },
  async ({ text, spaces, explicit_vowels }) => {
    const aksara = new Aksara(text, spaces ?? false, explicit_vowels ?? false);
    return {
      content: [{ type: 'text' as const, text: aksara.getAksara() }],
    };
  },
);

server.registerTool(
  'from_aksara',
  {
    description:
      'Convert Aksara Jawa (Hanacaraka script) to Latin-script Javanese. Handles murda consonants, retroflex letters, cakra, pengkal, and standalone vowel letters.',
    inputSchema: {
      text: z.string().describe('Aksara Jawa text to decode to Latin script'),
    },
  },
  async ({ text }) => {
    return {
      content: [{ type: 'text' as const, text: Aksara.fromAksara(text) }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error('Server error:', error);
  process.exit(1);
});