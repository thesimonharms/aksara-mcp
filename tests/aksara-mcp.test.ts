import { defineServer, describe, it, expect } from 'cobasaja';
import type { McpToolResult } from 'cobasaja';

defineServer({
  command: 'node',
  args: ['dist/index.js'],
  timeout: 10000,
});

function text(result: McpToolResult): string {
  return result.content[0]?.text ?? '';
}

it('lists the transliteration tools', async ({ tools }) => {
  expect(tools).toHaveTool('to_aksara');
  expect(tools).toHaveTool('from_aksara');
  expect(tools.length).toBe(2);
});

describe('to_aksara', () => {
  it('transliterates hanacaraka', async ({ call }) => {
    const result = await call('to_aksara', { text: 'hanacaraka' });
    expect(result).toBeSuccessful();
    expect(text(result)).toBe('ꦲꦤꦕꦫꦏ');
  });

  it('transliterates wong jawa', async ({ call }) => {
    const result = await call('to_aksara', { text: 'wong jawa' });
    expect(result).toBeSuccessful();
    expect(text(result)).toBe('ꦮꦺꦴꦁꦗꦮ');
  });

  it('preserves spaces when requested', async ({ call }) => {
    const result = await call('to_aksara', {
      text: 'aji saka',
      spaces: true,
    });
    expect(result).toBeSuccessful();
    expect(text(result)).toBe('ꦲꦗꦶ ꦱꦏ');
  });

  it('uses explicit vowel letters when requested', async ({ call }) => {
    const result = await call('to_aksara', {
      text: 'aksara',
      explicit_vowels: true,
    });
    expect(result).toBeSuccessful();
    expect(text(result)).toBe('ꦄꦏ꧀ꦱꦫ');
  });
});

describe('from_aksara', () => {
  it('decodes hanacaraka', async ({ call }) => {
    const result = await call('from_aksara', { text: 'ꦲꦤꦕꦫꦏ' });
    expect(result).toBeSuccessful();
    expect(text(result)).toBe('hanacaraka');
  });

  it('decodes wong jawa with preserved spaces', async ({ call }) => {
    const result = await call('from_aksara', { text: 'ꦮꦺꦴꦁ ꦗꦮ' });
    expect(result).toBeSuccessful();
    expect(text(result)).toBe('wong jawa');
  });

  it('decodes murda and retroflex consonants', async ({ call }) => {
    const result = await call('from_aksara', { text: 'ꦧꦸꦟ꧀ꦝꦼꦭ꧀' });
    expect(result).toBeSuccessful();
    expect(text(result)).toBe('bunḍel');
  });
});

describe('roundtrip', () => {
  it('latin → aksara → latin for hanacaraka', async ({ call }) => {
    const forward = await call('to_aksara', { text: 'hanacaraka' });
    expect(forward).toBeSuccessful();

    const backward = await call('from_aksara', { text: text(forward) });
    expect(backward).toBeSuccessful();
    expect(text(backward)).toBe('hanacaraka');
  });

  it('latin → aksara → latin for kra (cakra)', async ({ call }) => {
    const forward = await call('to_aksara', { text: 'kra' });
    expect(forward).toBeSuccessful();
    expect(text(forward)).toBe('ꦏꦿ');

    const backward = await call('from_aksara', { text: text(forward) });
    expect(backward).toBeSuccessful();
    expect(text(backward)).toBe('kra');
  });
});