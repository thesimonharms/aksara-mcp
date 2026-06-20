# aksara-mcp

MCP server that gives AI agents bidirectional transliteration between Latin-script Javanese and **Aksara Jawa** (Hanacaraka), powered by [aksara-ts](https://www.npmjs.com/package/aksara-ts).

```
lamun sira nginguk ucing   →  ꦭꦩꦸꦤ꧀ꦱꦶꦫꦔꦶꦔꦸꦏꦸꦕꦶꦁ
ꦲꦤꦕꦫꦏ                  →  hanacaraka
```

Aksara Jawa is essentially absent from LLM training data. This server lets agents read manuscript OCR output, transliterate user input, and work with Javanese script in both directions without guessing at rare Unicode codepoints.

## Tools

| Tool | Direction | Description |
|------|-----------|-------------|
| `to_aksara` | Latin → Aksara | Convert Latin-script Javanese to Hanacaraka |
| `from_aksara` | Aksara → Latin | Decode Aksara Jawa back to Latin script |

### `to_aksara`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | `string` | — | Latin-script Javanese text |
| `spaces` | `boolean` | `false` | Preserve spaces in the output |
| `explicit_vowels` | `boolean` | `false` | Use standalone vowel letters (ꦄ ꦆ ꦈ ꦌ ꦎ) for vowels without a preceding consonant |

### `from_aksara`

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `string` | Aksara Jawa text to decode |

Decoding handles murda consonants, retroflex letters (ṭ, ḍ), cakra (medial r), pengkal (medial y), and standalone vowel letters.

## Install

```bash
npm install aksara-mcp
```

Or clone and build locally:

```bash
git clone https://github.com/thesimonharms/aksara-mcp.git
cd aksara-mcp
npm install
npm run build
```

Requires Node.js 18+.

## MCP configuration

### Cursor / Claude Desktop

```json
{
  "mcpServers": {
    "aksara": {
      "command": "node",
      "args": ["/absolute/path/to/aksara-mcp/dist/index.js"]
    }
  }
}
```

If installed globally or via `npx`:

```json
{
  "mcpServers": {
    "aksara": {
      "command": "npx",
      "args": ["aksara-mcp"]
    }
  }
}
```

## Examples

**Latin → Aksara**

```json
{ "text": "hanacaraka" }
```
→ `ꦲꦤꦕꦫꦏ`

```json
{ "text": "aji saka", "spaces": true }
```
→ `ꦲꦗꦶ ꦱꦏ`

```json
{ "text": "aksara", "explicit_vowels": true }
```
→ `ꦄꦏ꧀ꦱꦫ`

**Aksara → Latin**

```json
{ "text": "ꦲꦤꦕꦫꦏ" }
```
→ `hanacaraka`

```json
{ "text": "ꦧꦸꦟ꧀ꦝꦼꦭ꧀" }
```
→ `bunḍel`

## Development

```bash
npm run build   # bundle server to dist/
npm start       # run on stdio
npm test        # build + run cobasaja tests
```

Tests live in `tests/` and use [cobasaja](https://www.npmjs.com/package/cobasaja) to spawn the server over stdio and assert tool behaviour end-to-end.

## Known limitations

Inherited from aksara-ts:

- **ꦲ ambiguity** — the glyph is both consonant `h` and the carrier for standalone vowels. `from_aksara` on `ꦲꦗꦶ` returns `haji`, not `aji`. Use `explicit_vowels: true` when encoding if disambiguation matters.
- **Spaces** — Aksara Jawa traditionally omits word boundaries. Pass `spaces: true` to `to_aksara` if you need spaces preserved for round-tripping.

## License

MIT © [Simon Harms](https://github.com/thesimonharms)